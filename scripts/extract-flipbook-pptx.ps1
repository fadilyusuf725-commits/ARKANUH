param(
  [string]$InputPath = ".\assets\flipbook\source\flipbook.pptx",
  [string]$OutputPath = ".\public\assets\flipbook\pages",
  [int]$StartSlide = 3,
  [int]$PageCount = 10,
  [int]$LongestEdge = 1600,
  [int]$Quality = 80,
  [switch]$SkipOptimize
)

$ErrorActionPreference = "Stop"

function Resolve-ProjectPath([string]$PathValue) {
  if ([System.IO.Path]::IsPathRooted($PathValue)) {
    return $PathValue
  }
  return Join-Path (Get-Location) $PathValue
}

function Resolve-PptInputPath([string]$RequestedInputPath) {
  $candidate = Resolve-ProjectPath $RequestedInputPath
  if (Test-Path $candidate) {
    return $candidate
  }

  $sourceDir = Resolve-ProjectPath ".\assets\flipbook\source"
  if (-not (Test-Path $sourceDir)) {
    throw "Folder sumber PPT tidak ditemukan: $sourceDir"
  }

  $firstPpt = Get-ChildItem -Path $sourceDir -File -Filter *.pptx | Sort-Object Name | Select-Object -First 1
  if ($null -eq $firstPpt) {
    throw "PPT tidak ditemukan. Letakkan file .pptx di: $sourceDir"
  }

  return $firstPpt.FullName
}

function Export-SlidesFromPowerPoint([string]$SourceFile, [string]$TempDirectory) {
  $powerPoint = $null
  $presentation = $null
  try {
    $powerPoint = New-Object -ComObject PowerPoint.Application
    $presentation = $powerPoint.Presentations.Open($SourceFile, $false, $true, $false)
    $presentation.Export($TempDirectory, "PNG")
  }
  finally {
    if ($presentation -ne $null) {
      $presentation.Close()
      [System.Runtime.InteropServices.Marshal]::ReleaseComObject($presentation) | Out-Null
    }
    if ($powerPoint -ne $null) {
      $powerPoint.Quit()
      [System.Runtime.InteropServices.Marshal]::ReleaseComObject($powerPoint) | Out-Null
    }
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
  }
}
$inputResolved = Resolve-PptInputPath $InputPath

$outputResolved = Resolve-ProjectPath $OutputPath
if (-not (Test-Path $outputResolved)) {
  New-Item -ItemType Directory -Path $outputResolved -Force | Out-Null
}

$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("arkanuh-pptx-" + [System.Guid]::NewGuid().ToString("N"))
$exportDirectory = Join-Path $tempRoot "exported"
$mappedDirectory = Join-Path $tempRoot "mapped"
New-Item -ItemType Directory -Path $exportDirectory -Force | Out-Null
New-Item -ItemType Directory -Path $mappedDirectory -Force | Out-Null

try {
  Write-Host "Export slide dari PPTX: $inputResolved"
  Export-SlidesFromPowerPoint -SourceFile $inputResolved -TempDirectory $exportDirectory

  $slideFiles = Get-ChildItem -Path $exportDirectory -File |
    Where-Object { $_.Extension -match '^\.(png|jpg|jpeg)$' } |
    Sort-Object {
      if ($_.BaseName -match '(\d+)$') { [int]$matches[1] } else { [int]::MaxValue }
    }

  $requiredSlide = $StartSlide + $PageCount - 1
  if ($slideFiles.Count -lt $requiredSlide) {
    throw "Slide hasil export hanya $($slideFiles.Count). Minimal slide $requiredSlide dibutuhkan."
  }

  $slideByNumber = @{}
  foreach ($file in $slideFiles) {
    if ($file.BaseName -match '(\d+)$') {
      $slideByNumber[[int]$matches[1]] = $file.FullName
    }
  }

  for ($pageIndex = 0; $pageIndex -lt $PageCount; $pageIndex++) {
    $slideNumber = $StartSlide + $pageIndex
    if (-not $slideByNumber.ContainsKey($slideNumber)) {
      throw "Slide $slideNumber tidak ditemukan pada hasil export."
    }

    $targetPage = "{0:D2}" -f ($pageIndex + 1)
    $mappedTarget = Join-Path $mappedDirectory "page-$targetPage.png"
    Copy-Item -Path $slideByNumber[$slideNumber] -Destination $mappedTarget -Force
  }

  if ($SkipOptimize.IsPresent) {
    for ($pageIndex = 0; $pageIndex -lt $PageCount; $pageIndex++) {
      $pageNumber = "{0:D2}" -f ($pageIndex + 1)
      $source = Join-Path $mappedDirectory "page-$pageNumber.png"
      $target = Join-Path $outputResolved "page-$pageNumber.png"
      Copy-Item -Path $source -Destination $target -Force
    }
    Write-Host "Export selesai tanpa optimasi: $outputResolved"
    exit 0
  }

  $optimizeScript = Join-Path (Get-Location) "scripts\optimize-flipbook-pages.mjs"
  if (-not (Test-Path $optimizeScript)) {
    throw "Script optimasi tidak ditemukan: $optimizeScript"
  }

  Get-ChildItem -Path $outputResolved -File -Filter "page-*.webp" -ErrorAction SilentlyContinue | Remove-Item -Force

  Write-Host "Optimasi ke WebP..."
  node $optimizeScript --input "$mappedDirectory" --output "$outputResolved" --pages "$PageCount" --longest "$LongestEdge" --quality "$Quality"

  Write-Host "Selesai. Halaman flipbook (slide $StartSlide-$requiredSlide) tersimpan di: $outputResolved"
}
finally {
  if (Test-Path $tempRoot) {
    Remove-Item -Path $tempRoot -Recurse -Force
  }
}
