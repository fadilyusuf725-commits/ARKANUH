param(
  [string]$InputPptx = "C:\Users\Thinkpad T490s\Downloads\KISAH NABI NUH.pptx",
  [string]$OutputDir = ".\public\assets\ppt-story\raw"
)

$ErrorActionPreference = "Stop"

function Resolve-PathSafe([string]$pathValue) {
  if ([System.IO.Path]::IsPathRooted($pathValue)) {
    return $pathValue
  }
  return Join-Path (Get-Location) $pathValue
}

$pptxPath = Resolve-PathSafe $InputPptx
$targetDir = Resolve-PathSafe $OutputDir

if (-not (Test-Path $pptxPath)) {
  throw "File PPTX tidak ditemukan: $pptxPath"
}

if (-not (Test-Path $targetDir)) {
  New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($pptxPath)

try {
  $entries = $zip.Entries | Where-Object {
    $_.FullName -match '^ppt/media/image\d+\.(png|jpg|jpeg)$'
  } | Sort-Object FullName

  if ($entries.Count -eq 0) {
    throw "Tidak ada aset gambar pada ppt/media."
  }

  foreach ($entry in $entries) {
    $fileName = [System.IO.Path]::GetFileName($entry.FullName)
    $destPath = Join-Path $targetDir $fileName
    [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $destPath, $true)
    Write-Host "Extracted: $fileName"
  }
}
finally {
  $zip.Dispose()
}

Write-Host ""
Write-Host "Selesai ekstraksi aset PPT."
Write-Host "Output: $targetDir"
