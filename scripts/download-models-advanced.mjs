#!/usr/bin/env node

/**
 * ARKANUH Advanced Model Downloader
 * Download high-quality 3D models from Tripo3D with retry logic
 * Proper error handling and progress tracking
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import { URL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODELS_DIR = path.join(__dirname, '../public/assets/models');
const CACHE_FILE = path.join(__dirname, '../.model-download-cache.json');

// Updated Tripo3D model URLs from DOCX
const MODELS = [
  { 
    pageId: '2', 
    url: 'https://studio.tripo3d.ai/3d-model/ac1160db-5473-4df9-9d05-98bce22955e3?invite_code=LKAST7',
    filename: 'page-02.glb',
    modelId: 'ac1160db-5473-4df9-9d05-98bce22955e3'
  },
  { 
    pageId: '3', 
    url: 'https://studio.tripo3d.ai/3d-model/13a00c36-367b-4371-8740-b1d8bc5390b2?invite_code=LKAST7',
    filename: 'page-03.glb',
    modelId: '13a00c36-367b-4371-8740-b1d8bc5390b2'
  },
  { 
    pageId: '4', 
    url: 'https://studio.tripo3d.ai/3d-model/72294589-9b8c-4554-9bf7-c6ea880c9360?invite_code=QCYWGH',
    filename: 'page-04.glb',
    modelId: '72294589-9b8c-4554-9bf7-c6ea880c9360'
  },
  { 
    pageId: '5', 
    url: 'https://studio.tripo3d.ai/3d-model/716b3922-1112-4456-941d-dad7f25b495e?invite_code=QCYWGH',
    filename: 'page-05.glb',
    modelId: '716b3922-1112-4456-941d-dad7f25b495e'
  },
  { 
    pageId: '6', 
    url: 'https://studio.tripo3d.ai/3d-model/081f023b-8053-4c46-b240-db0462e4d637?invite_code=QCYWGH',
    filename: 'page-06.glb',
    modelId: '081f023b-8053-4c46-b240-db0462e4d637'
  },
  { 
    pageId: '7', 
    url: 'https://studio.tripo3d.ai/3d-model/228e64d9-651b-453d-b626-4e3864e069b1?invite_code=QCYWGH',
    filename: 'page-07.glb',
    modelId: '228e64d9-651b-453d-b626-4e3864e069b1'
  },
  { 
    pageId: '8', 
    url: 'https://studio.tripo3d.ai/3d-model/2bd377ae-fbd0-4ca4-9006-ece3d2ec772c?invite_code=LKAST7',
    filename: 'page-08.glb',
    modelId: '2bd377ae-fbd0-4ca4-9006-ece3d2ec772c'
  },
  { 
    pageId: '9', 
    url: 'https://studio.tripo3d.ai/3d-model/6f41fe0b-7cce-40d8-8b72-93d4b01264e0?invite_code=31OFKB',
    filename: 'page-09.glb',
    modelId: '6f41fe0b-7cce-40d8-8b72-93d4b01264e0'
  },
  { 
    pageId: '10', 
    url: 'https://studio.tripo3d.ai/3d-model/941a73af-5d63-4312-b1cb-23994ba41cc6?invite_code=LKAST7',
    filename: 'page-10.glb',
    modelId: '941a73af-5d63-4312-b1cb-23994ba41cc6'
  },
  { 
    pageId: '1', 
    url: 'https://studio.tripo3d.ai/3d-model/b5d24a9f-55a9-4931-b774-fead65d02b10?invite_code=LKAST7',
    filename: 'page-01.glb',
    modelId: 'b5d24a9f-55a9-4931-b774-fead65d02b10'
  }
];

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };
  const color = colors[type] || colors.info;
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${color}[${timestamp}] ${message}\x1b[0m`);
}

async function downloadFile(url, outputPath, maxRetries = 3) {
  return new Promise((resolve, reject) => {
    const maxSize = 50 * 1024 * 1024; // 50MB limit
    let retries = 0;
    let downloadedSize = 0;

    const attemptDownload = () => {
      const file = fs.createWriteStream(outputPath);
      const request = https.get(url, { 
        timeout: 60000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          // Handle redirects
          const redirectUrl = response.headers.location;
          file.destroy();
          fs.unlink(outputPath, () => {});
          
          if (retries < maxRetries) {
            retries++;
            log(`Redirect detected, retry ${retries}/${maxRetries}...`, 'warning');
            setTimeout(() => attemptDownload(), 500);
          } else {
            reject(new Error(`Too many redirects (${retries})`));
          }
          return;
        }

        if (response.statusCode !== 200) {
          file.destroy();
          fs.unlink(outputPath, () => {});
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }

        downloadedSize = 0;
        response.on('data', (chunk) => {
          downloadedSize += chunk.length;
          if (downloadedSize > maxSize) {
            file.destroy();
            fs.unlink(outputPath, () => {});
            request.destroy();
            reject(new Error(`Download exceeds ${maxSize / 1024 / 1024}MB limit`));
          }
        });

        response.pipe(file);
      });

      file.on('finish', () => {
        file.close();
        resolve(true);
      });

      file.on('error', (err) => {
        fs.unlink(outputPath, () => {});
        reject(err);
      });

      request.on('error', (err) => {
        fs.unlink(outputPath, () => {});
        if (retries < maxRetries && err.code !== 'ENOTFOUND') {
          retries++;
          log(`Error: ${err.message}, retry ${retries}/${maxRetries}...`, 'warning');
          setTimeout(() => attemptDownload(), 1000);
        } else {
          reject(err);
        }
      });

      request.on('timeout', () => {
        request.destroy();
        fs.unlink(outputPath, () => {});
        if (retries < maxRetries) {
          retries++;
          log(`Timeout, retry ${retries}/${maxRetries}...`, 'warning');
          setTimeout(() => attemptDownload(), 1000);
        } else {
          reject(new Error('Download timeout'));
        }
      });
    };

    attemptDownload();
  });
}

async function getDirectDownloadUrl(studioUrl) {
  return new Promise((resolve, reject) => {
    https.get(studioUrl, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        // Try to extract download URL from response
        const downloadMatch = data.match(/download["\']?\s*:\s*["\']?([^"\']+glb[^"\']*)/i);
        if (downloadMatch) {
          resolve(downloadMatch[1]);
        } else {
          // If not found, return original URL (might work)
          resolve(studioUrl);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  log('\n╔════════════════════════════════════════════════════╗');
  log('║     ARKANUH Advanced 3D Model Downloader v2.0       ║');
  log('║     Downloading High-Quality Realistic Models      ║');
  log('╚════════════════════════════════════════════════════╝\n');

  // Create models directory
  if (!fs.existsSync(MODELS_DIR)) {
    fs.mkdirSync(MODELS_DIR, { recursive: true });
    log(`Created directory: ${MODELS_DIR}`, 'success');
  }

  let successCount = 0;
  let failedCount = 0;
  let totalSize = 0;
  const results = [];

  log(`Downloading ${MODELS.length} models from Tripo3D...`, 'info');
  log('(This may take a few minutes)\n');

  for (const model of MODELS) {
    const outputPath = path.join(MODELS_DIR, model.filename);
    
    // Check if already downloaded
    if (fs.existsSync(outputPath)) {
      const fileSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(1);
      log(`[${model.pageId}] ${model.filename}: already exists (${fileSize}MB)`, 'success');
      totalSize += parseFloat(fileSize);
      successCount++;
      results.push({ pageId: model.pageId, status: 'cached', size: fileSize });
      continue;
    }

    process.stdout.write(`[${model.pageId}] Downloading ${model.filename}... `);

    try {
      await downloadFile(model.url, outputPath);
      const fileSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(1);
      log(`✓ (${fileSize}MB)`, 'success');
      totalSize += parseFloat(fileSize);
      successCount++;
      results.push({ pageId: model.pageId, filename: model.filename, status: 'downloaded', size: fileSize });
    } catch (err) {
      log(`✗ Failed: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
      failedCount++;
      results.push({ pageId: model.pageId, status: 'failed', error: err instanceof Error ? err.message : 'Unknown' });
    }
  }

  log('\n╔════════════════════════════════════════════════════╗');
  log('║                Download Summary                    ║');
  log('╚════════════════════════════════════════════════════╝\n');

  log(`Downloaded: ${successCount} / ${MODELS.length}`, successCount === MODELS.length ? 'success' : 'warning');
  log(`Failed: ${failedCount} / ${MODELS.length}`, failedCount === 0 ? 'success' : 'error');
  log(`Total Downloaded: ${totalSize.toFixed(1)} MB\n`);

  if (successCount === MODELS.length) {
    log('✓ All models downloaded successfully!', 'success');
    log('Ready to build production version.\n');
    log('Next steps:', 'info');
    log('  1. npm run build');
    log('  2. npm run preview');
    log('  3. git push origin main\n');
  } else if (successCount > 0) {
    log(`⚠ Partial success: ${successCount} models ready`, 'warning');
    log(`${failedCount} models failed to download\n`);
  } else {
    log('✗ Download failed completely', 'error');
    log('Check your internet connection and try again.\n');
    process.exit(1);
  }

  // Save cache
  fs.writeFileSync(CACHE_FILE, JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2));
}

main().catch(err => {
  log(`Fatal error: ${err.message}`, 'error');
  process.exit(1);
});
