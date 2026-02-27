param(
  [ValidateSet("dev", "release", "all")]
  [string]$Mode = "release",
  [string]$ProjectPath = ".\unity\ARKANUHBook",
  [string]$UnityExe = "C:\Program Files\Unity\Hub\Editor\6000.3.7f1\Editor\Unity.exe"
)

$ErrorActionPreference = "Stop"

function Resolve-PathSafe([string]$value) {
  if ([System.IO.Path]::IsPathRooted($value)) {
    return $value
  }
  return Join-Path (Get-Location) $value
}

$projectPathResolved = Resolve-PathSafe $ProjectPath
if (-not (Test-Path $projectPathResolved)) {
  throw "Project Unity tidak ditemukan: $projectPathResolved"
}

if (-not (Test-Path $UnityExe)) {
  throw "Unity.exe tidak ditemukan: $UnityExe"
}

$logDir = Join-Path (Split-Path $projectPathResolved -Parent) "Logs"
if (-not (Test-Path $logDir)) {
  New-Item -ItemType Directory -Path $logDir | Out-Null
}

$logPath = Join-Path $logDir ("unity-build-{0}.log" -f $Mode)

Write-Host "Running Unity build mode: $Mode"
$args = @(
  "-batchmode",
  "-nographics",
  "-quit",
  "-projectPath", $projectPathResolved,
  "-executeMethod", "Arkanuh.UnityBridgeEditor.BuildWebGL.BuildFromCommandLine",
  "-buildMode", $Mode,
  "-logFile", $logPath
)

$proc = Start-Process -FilePath $UnityExe -ArgumentList $args -PassThru -Wait -NoNewWindow
if ($proc.ExitCode -ne 0) {
  throw "Unity build gagal. Lihat log: $logPath"
}

Write-Host "Unity build selesai. Log: $logPath"
