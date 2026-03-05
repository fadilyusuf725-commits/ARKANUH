# Download 3D models from Tripo3D and save locally
# This script downloads all 9 page models before signed URLs expire

$modelsDir = "d:\ARKANUH\public\assets\models"
$outputDir = "public/assets/models"

# Create models directory if it doesn't exist
if (-not (Test-Path $modelsDir)) {
    Write-Host "Creating models directory: $modelsDir"
    New-Item -ItemType Directory -Path $modelsDir -Force | Out-Null
}

# Tripo3D model IDs with invite code
$models = @(
    @{ pageId = "1"; modelId = "0fd8a38a-8e97-4115-aa44-cc10a22a2c18"; filename = "page-01.glb"; size = "9.5 MB" },
    @{ pageId = "2"; modelId = "ac1160db-5473-4df9-9d05-98bce22955e3"; filename = "page-02.glb"; size = "8.6 MB" },
    @{ pageId = "3"; modelId = "13a00c36-367b-4371-8740-b1d8bc5390b2"; filename = "page-03.glb"; size = "9.1 MB" },
    @{ pageId = "4"; modelId = "68c748d4-9e64-4e0f-b9c7-6a7150d87c42"; filename = "page-04.glb"; size = "9.1 MB" },
    @{ pageId = "5"; modelId = "2bd377ae-fbd0-4ca4-9006-ece3d2ec772c"; filename = "page-05.glb"; size = "9.9 MB" },
    @{ pageId = "6"; modelId = "941a73af-5d63-4312-b1cb-23994ba41cc6"; filename = "page-06.glb"; size = "8.5 MB" },
    @{ pageId = "7"; modelId = "ed013efe-9660-4863-8347-0a535312edb9"; filename = "page-07.glb"; size = "7.2 MB" },
    @{ pageId = "8"; modelId = "351ea7bc-edac-470e-ac60-c3fb9d3792db"; filename = "page-08.glb"; size = "9.6 MB" },
    @{ pageId = "9"; modelId = "b5d24a9f-55a9-4931-b774-fead65d02b10"; filename = "page-09.glb"; size = "9.2 MB" }
)

$inviteCode = "LKAST7"
$successCount = 0
$failCount = 0
$totalSize = 0

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "ARKANUH 3D Model Downloader" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

foreach ($model in $models) {
    $outputPath = Join-Path $modelsDir $model.filename
    $studioUrl = "https://studio.tripo3d.ai/3d-model/$($model.modelId)?invite_code=$inviteCode"
    
    # Try multiple endpoints to get the download link
    $endpoints = @(
        "https://api.tripo3d.ai/v2/openapi/models/$($model.modelId)/download?format=glb",
        "https://tripo-data.rg1.data.tripo3d.com/studio/$($model.modelId).glb"
    )
    
    Write-Host "[$($model.pageId)] Downloading page $($model.pageId)..." -NoNewline
    
    $downloaded = $false
    
    # Try each endpoint
    foreach ($endpoint in $endpoints) {
        try {
            $ProgressPreference = 'SilentlyContinue'
            Invoke-WebRequest -Uri $endpoint -OutFile $outputPath -ErrorAction Stop -TimeoutSec 30 | Out-Null
            $downloaded = $true
            break
        }
        catch {
            # Try next endpoint
        }
    }
    
    if (-not $downloaded) {
        # Fallback: Try to fetch from studio URL with browser automation
        Write-Host " [MANUAL FALLBACK REQUIRED]" -ForegroundColor Yellow
        Write-Host "   Studio URL: $studioUrl" -ForegroundColor Gray
        Write-Host "   Please manually download the model or use browser DevTools to inspect network requests." -ForegroundColor Yellow
        Write-Host "   Then save as: $outputPath" -ForegroundColor Gray
        $failCount++
    }
    else {
        $fileSize = (Get-Item $outputPath).Length / 1MB
        $totalSize += $fileSize
        Write-Host " ✓ Downloaded ($([math]::Round($fileSize, 1)) MB)" -ForegroundColor Green
        $successCount++
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Download Summary:" -ForegroundColor Cyan
Write-Host "  Successfully downloaded: $successCount / 9" -ForegroundColor $(if ($successCount -eq 9) { "Green" } else { "Yellow" })
Write-Host "  Failed/Manual: $failCount / 9" -ForegroundColor $(if ($failCount -eq 0) { "Green" } else { "Yellow" })
Write-Host "  Total size downloaded: $([math]::Round($totalSize, 1)) MB" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if ($failCount -gt 0) {
    Write-Host "NOTE: Some models require manual download." -ForegroundColor Yellow
    Write-Host "Visit the Tripo3D studio URLs above in a browser and export as GLB files." -ForegroundColor Yellow
}

if ($successCount -eq 9) {
    Write-Host "`n✓ All models downloaded successfully!" -ForegroundColor Green
    Write-Host "You can now run: npm run build" -ForegroundColor Cyan
}
