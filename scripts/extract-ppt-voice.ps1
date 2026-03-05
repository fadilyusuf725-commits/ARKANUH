param(
  [string]$InputPath = ".\assets\flipbook\source\flipbook.pptx",
  [string]$OutputPath = ".\public\assets\voice",
  [int]$StartSlide = 3,
  [int]$PageCount = 10
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression.FileSystem

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

function Find-Entry($Archive, [string]$FullName) {
  return $Archive.Entries | Where-Object { $_.FullName -eq $FullName } | Select-Object -First 1
}

$inputResolved = Resolve-PptInputPath $InputPath
$outputResolved = Resolve-ProjectPath $OutputPath
if (-not (Test-Path $outputResolved)) {
  New-Item -ItemType Directory -Path $outputResolved -Force | Out-Null
}

Get-ChildItem -Path $outputResolved -File -Filter "page-*.wav" -ErrorAction SilentlyContinue | Remove-Item -Force

$archive = [System.IO.Compression.ZipFile]::OpenRead($inputResolved)
try {
  for ($pageIndex = 0; $pageIndex -lt $PageCount; $pageIndex++) {
    $pageNumber = $pageIndex + 1
    $slideNumber = $StartSlide + $pageIndex
    $relsPath = "ppt/slides/_rels/slide$slideNumber.xml.rels"
    $relsEntry = Find-Entry -Archive $archive -FullName $relsPath
    if ($null -eq $relsEntry) {
      Write-Host "Page $pageNumber (slide $slideNumber): tidak ada relasi audio."
      continue
    }

    $reader = New-Object System.IO.StreamReader($relsEntry.Open())
    $relsXml = $reader.ReadToEnd()
    $reader.Close()

    $matches = [regex]::Matches($relsXml, '\.\./media/(media\d+\.(wav|mp3|m4a|wma))', 'IgnoreCase')
    if ($matches.Count -eq 0) {
      Write-Host "Page $pageNumber (slide $slideNumber): tidak ada target audio."
      continue
    }

    $mediaName = $matches[0].Groups[1].Value
    $mediaPath = "ppt/media/$mediaName"
    $mediaEntry = Find-Entry -Archive $archive -FullName $mediaPath
    if ($null -eq $mediaEntry) {
      Write-Host "Page $pageNumber (slide $slideNumber): file media tidak ditemukan ($mediaPath)."
      continue
    }

    $outputFile = Join-Path $outputResolved ("page-{0:D2}.wav" -f $pageNumber)
    $sourceStream = $mediaEntry.Open()
    $targetStream = [System.IO.File]::Open($outputFile, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write)
    try {
      $sourceStream.CopyTo($targetStream)
    }
    finally {
      $targetStream.Close()
      $sourceStream.Close()
    }

    Write-Host "Extracted page-$('{0:D2}' -f $pageNumber).wav dari slide $slideNumber ($mediaName)"
  }
}
finally {
  $archive.Dispose()
}

Write-Host "Ekstraksi voice selesai: $outputResolved"
