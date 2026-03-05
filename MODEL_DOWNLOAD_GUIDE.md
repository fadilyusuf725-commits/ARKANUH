# ARKANUH 3D Model Setup Guide

## Status

✅ **Local model storage configured** - The app now points to `/assets/models/` for all 3D models.
⏳ **Placeholder models available** - Minimal fallback models are in place for testing (each ~0.5 KB blue cube).
📥 **Real models need to be downloaded** - Replace placeholders with actual Tripo3D GLB models.

## What's Configured

- All 9 pages point to local models in `public/assets/models/`
- Model registry: [assets/model-links/.resolved-model-links.json](assets/model-links/.resolved-model-links.json)
- Actual paths: `/assets/models/page-01.glb` through `/assets/models/page-09.glb`
- Placeholder files created for testing (valid GLB format, minimal geometry)

## Download Real Models

### Option 1: Browser-Based Download (Easiest)

For each Tripo3D model below, open the studio URL in your browser and export as GLB:

1. **Page 1**: [Open in Tripo3D](https://studio.tripo3d.ai/3d-model/0fd8a38a-8e97-4115-aa44-cc10a22a2c18?invite_code=LKAST7)
   - Click `Export` → Select `GLB` → Download
   - Save as: `public/assets/models/page-01.glb`

2. **Page 2**: [Open in Tripo3D](https://studio.tripo3d.ai/3d-model/ac1160db-5473-4df9-9d05-98bce22955e3?invite_code=LKAST7)
   - Save as: `public/assets/models/page-02.glb`

3. **Page 3**: [Open in Tripo3D](https://studio.tripo3d.ai/3d-model/13a00c36-367b-4371-8740-b1d8bc5390b2?invite_code=LKAST7)
   - Save as: `public/assets/models/page-03.glb`

4. **Page 4**: [Open in Tripo3D](https://studio.tripo3d.ai/3d-model/68c748d4-9e64-4e0f-b9c7-6a7150d87c42?invite_code=LKAST7)
   - Save as: `public/assets/models/page-04.glb`

5. **Page 5**: [Open in Tripo3D](https://studio.tripo3d.ai/3d-model/2bd377ae-fbd0-4ca4-9006-ece3d2ec772c?invite_code=LKAST7)
   - Save as: `public/assets/models/page-05.glb`

6. **Page 6**: [Open in Tripo3D](https://studio.tripo3d.ai/3d-model/941a73af-5d63-4312-b1cb-23994ba41cc6?invite_code=LKAST7)
   - Save as: `public/assets/models/page-06.glb`

7. **Page 7**: [Open in Tripo3D](https://studio.tripo3d.ai/3d-model/ed013efe-9660-4863-8347-0a535312edb9?invite_code=LKAST7)
   - Save as: `public/assets/models/page-07.glb`

8. **Page 8**: [Open in Tripo3D](https://studio.tripo3d.ai/3d-model/351ea7bc-edac-470e-ac60-c3fb9d3792db?invite_code=LKAST7)
   - Save as: `public/assets/models/page-08.glb`

9. **Page 9**: [Open in Tripo3D](https://studio.tripo3d.ai/3d-model/b5d24a9f-55a9-4931-b774-fead65d02b10?invite_code=LKAST7)
   - Save as: `public/assets/models/page-09.glb`

### Option 2: Batch Download via Script

If you have Tripo3D API access with credentials:

```bash
# Set your Tripo3D API credentials
$env:TRIPO_API_KEY = "your-api-key"
$env:TRIPO_API_SECRET = "your-api-secret"

# Run the downloader
node scripts/download-models.mjs
```

### Option 3: Using DevTools Network Inspector

1. Open a studio URL in browser
2. Press `F12` to open DevTools
3. Go to Network tab
4. Click the export button on the page
5. Look for the download request (GLB file)
6. Save the file to `public/assets/models/page-XX.glb`

## File Sizes Expected

| Page | Expected Size | Path |
|------|--------------|------|
| 1 | 9.5 MB | `public/assets/models/page-01.glb` |
| 2 | 8.6 MB | `public/assets/models/page-02.glb` |
| 3 | 9.1 MB | `public/assets/models/page-03.glb` |
| 4 | 9.1 MB | `public/assets/models/page-04.glb` |
| 5 | 9.9 MB | `public/assets/models/page-05.glb` |
| 6 | 8.5 MB | `public/assets/models/page-06.glb` |
| 7 | 7.2 MB | `public/assets/models/page-07.glb` |
| 8 | 9.6 MB | `public/assets/models/page-08.glb` |
| 9 | 9.2 MB | `public/assets/models/page-09.glb` |
| **Total** | **~75 MB** | All pages |

## Verify Downloads

After downloading, run:

```bash
npm run build
npm run preview
```

Then open `http://localhost:4173` to test the 3D models.

## Production Deployment

Once models are downloaded locally:

1. Run build: `npm run build`
2. Deploy dist folder to GitHub Pages
3. All 9 models will be served from `/ARKANUH/assets/models/`
4. No API keys or expiring URLs needed - models are permanent!

## Troubleshooting

### Models show as blue cubes
- You're using placeholder models (useful for testing layout/audio)
- Replace them with real GLB files from Tripo3D

### Build fails
- Check: `npm run build 2>&1 | head -20`
- Most errors are warnings only

### 404 errors in console
- Check model paths match: `/assets/models/page-0X.glb`
- Verify files exist: `ls public/assets/models/`

## Architecture Changes Made

### 1. Model Registry Updated
- **Old**: AWS signed URLs (Tripo3D CDN) - **Expires every 30 days**
- **New**: Local file paths `/assets/models/page-0X.glb` - **Permanent**

### 2. Error Handling
- Added timeout mechanism (3 seconds)
- Creates fallback 3D geometry if loading fails
- Logs all attempted URLs for debugging

### 3. Page Navigation Fixed
- Changed string comparison to integer parsing
- Future-proof for 10+ pages
- No more brittle `Number()` conversions

### 4. Code Cleanup
- Removed orphaned page 10 entry
- Deleted unused audio files (Cap 1-10.wav, cap 1-10.wav)
- Created `.gitkeep` for models folder

## Key Files

| File | Purpose |
|------|---------|
| [assets/model-links/.resolved-model-links.json](assets/model-links/.resolved-model-links.json) | Model registry with local paths |
| [src/data/modelRegistry.ts](src/data/modelRegistry.ts) | Model loading logic with caching |
| [src/components/ThreeFlipbookCanvas.tsx](src/components/ThreeFlipbookCanvas.tsx) | 3D rendering with fallback geometry |
| [src/pages/FlipbookReaderPage.tsx](src/pages/FlipbookReaderPage.tsx) | Fixed page navigation |
| [public/assets/models/](public/assets/models/) | Local model storage (placeholder + real GLBs) |

## Next Steps

1. ✅ Placeholder models created (testing ready)
2. ✅ Model registry configured (local paths)
3. ✅ Build passing (226.70 KB gzipped)
4. 📥 **Manual: Download real GLB files from Tripo3D** (see links above)
5. 🚀 Deploy to GitHub Pages

**Total setup time**: ~2 minutes to download + replace models
