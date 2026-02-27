param(
  [string]$InputDir = ".\voice-raw",
  [string]$OutputDir = ".\public\assets\voice",
  [string]$Bitrate = "128k"
)

$ErrorActionPreference = "Stop"

function Resolve-FfmpegExe {
  $cmd = Get-Command ffmpeg -ErrorAction SilentlyContinue
  if ($cmd -and $cmd.Source) {
    return $cmd.Source
  }

  $wingetPath = "C:\Program Files\ffmpeg\bin\ffmpeg.exe"
  if (Test-Path $wingetPath) {
    return $wingetPath
  }

  throw "ffmpeg tidak ditemukan. Install ffmpeg lalu jalankan ulang script ini."
}

function Resolve-PathSafe([string]$pathValue) {
  if ([System.IO.Path]::IsPathRooted($pathValue)) {
    return $pathValue
  }
  return Join-Path (Get-Location) $pathValue
}

$ffmpeg = Resolve-FfmpegExe
$sourceDir = Resolve-PathSafe $InputDir
$targetDir = Resolve-PathSafe $OutputDir

if (-not (Test-Path $sourceDir)) {
  throw "Folder input tidak ditemukan: $sourceDir"
}

if (-not (Test-Path $targetDir)) {
  New-Item -ItemType Directory -Path $targetDir | Out-Null
}

$targets = 1..10 | ForEach-Object { "page-{0}.mp3" -f $_.ToString("00") }
$success = 0
$skipped = 0

foreach ($fileName in $targets) {
  $inputPath = Join-Path $sourceDir $fileName
  $outputPath = Join-Path $targetDir $fileName

  if (-not (Test-Path $inputPath)) {
    Write-Host "Skip (tidak ada): $inputPath"
    $skipped += 1
    continue
  }

  & $ffmpeg `
    -y `
    -i $inputPath `
    -af "highpass=f=80,lowpass=f=10000,afftdn=nf=-22,loudnorm=I=-16:LRA=11:TP=-1.5" `
    -ar 44100 `
    -ac 1 `
    -b:a $Bitrate `
    $outputPath | Out-Null

  Write-Host "Processed: $outputPath"
  $success += 1
}

Write-Host ""
Write-Host "Selesai. Berhasil: $success, Skip: $skipped"
Write-Host "Output VO siap dipakai di public/assets/voice."
