#!/usr/bin/env node

/**
 * ARKANUH Model Downloader
 * Downloads 3D models from Tripo3D and saves them locally
 * This ensures models are available even after Tripo3D URLs expire
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODELS_DIR = path.join(__dirname, '../public/assets/models');
const CACHE_FILE = path.join(__dirname, '../.model-cache.json');

// Original Tripo3D model IDs
const MODELS = [
  { pageId: '1', modelId: '0fd8a38a-8e97-4115-aa44-cc10a22a2c18', filename: 'page-01.glb', size: '9.5 MB' },
  { pageId: '2', modelId: 'ac1160db-5473-4df9-9d05-98bce22955e3', filename: 'page-02.glb', size: '8.6 MB' },
  { pageId: '3', modelId: '13a00c36-367b-4371-8740-b1d8bc5390b2', filename: 'page-03.glb', size: '9.1 MB' },
  { pageId: '4', modelId: '68c748d4-9e64-4e0f-b9c7-6a7150d87c42', filename: 'page-04.glb', size: '9.1 MB' },
  { pageId: '5', modelId: '2bd377ae-fbd0-4ca4-9006-ece3d2ec772c', filename: 'page-05.glb', size: '9.9 MB' },
  { pageId: '6', modelId: '941a73af-5d63-4312-b1cb-23994ba41cc6', filename: 'page-06.glb', size: '8.5 MB' },
  { pageId: '7', modelId: 'ed013efe-9660-4863-8347-0a535312edb9', filename: 'page-07.glb', size: '7.2 MB' },
  { pageId: '8', modelId: '351ea7bc-edac-470e-ac60-c3fb9d3792db', filename: 'page-08.glb', size: '9.6 MB' },
  { pageId: '9', modelId: 'b5d24a9f-55a9-4931-b774-fead65d02b10', filename: 'page-09.glb', size: '9.2 MB' }
];

const INVITE_CODE = 'LKAST7';

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // cyan
    success: '\x1b[32m', // green
    warning: '\x1b[33m', // yellow
    error: '\x1b[31m',   // red
    reset: '\x1b[0m'
  };
  const color = colors[type] || colors.info;
  console.log(`${color}${message}\x1b[0m`);
}

function createFallbackModel(filename) {
  // Create a minimal valid GLB file for fallback
  // GLB format: magic(4) + version(4) + length(4) + JSON chunk + BIN chunk
  const json = {
    asset: { version: '2.0', generator: 'ARKANUH Fallback Generator' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0 }],
    meshes: [{
      primitives: [{
        attributes: { POSITION: 0 },
        indices: 1,
        material: 0
      }]
    }],
    materials: [{ pbrMetallicRoughness: { baseColorFactor: [0.5, 0.5, 1, 1] } }],
    accessors: [
      { bufferView: 0, componentType: 5126, count: 24, type: 'VEC3', min: [-1, -1, -1], max: [1, 1, 1] },
      { bufferView: 1, componentType: 5125, count: 36, type: 'SCALAR' }
    ],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: 288, target: 34962 },
      { buffer: 0, byteOffset: 288, byteLength: 144, target: 34963 }
    ],
    buffers: [{ byteLength: 432 }]
  };

  // Cube vertex positions and indices
  const positions = new Float32Array([
    -1,-1,-1, 1,-1,-1, 1,1,-1, -1,1,-1,
    -1,-1,1, 1,-1,1, 1,1,1, -1,1,1
  ]);
  const indices = new Uint32Array([
    0,1,2, 2,3,0, 4,6,5, 6,4,7,
    0,4,5, 5,1,0, 2,6,7, 7,3,2,
    0,3,7, 7,4,0, 1,5,6, 6,2,1
  ]);

  const jsonStr = JSON.stringify(json);
  const jsonBytes = Buffer.from(jsonStr);
  const padding = (4 - (jsonBytes.length % 4)) % 4;

  const totalSize = 28 + jsonBytes.length + padding + positions.byteLength + indices.byteLength;
  const glb = Buffer.alloc(totalSize);

  // GLB header
  glb.writeUInt32LE(0x46546C67, 0); // magic: "glTF"
  glb.writeUInt32LE(2, 4); // version
  glb.writeUInt32LE(totalSize, 8); // length

  // JSON chunk
  let offset = 12;
  glb.writeUInt32LE(jsonBytes.length + padding, offset); // chunkLength
  glb.writeUInt32LE(0x4E4F534A, offset + 4); // chunkType: "JSON"
  jsonBytes.copy(glb, offset + 8);
  offset += 8 + jsonBytes.length + padding;

  // BIN chunk
  glb.writeUInt32LE(432, offset); // chunkLength
  glb.writeUInt32LE(0x004E4942, offset + 4); // chunkType: "BIN\0"
  new Uint8Array(glb.buffer, offset + 8, positions.byteLength).set(new Uint8Array(positions.buffer));
  new Uint8Array(glb.buffer, offset + 8 + positions.byteLength, indices.byteLength).set(new Uint8Array(indices.buffer));

  return glb;
}

async function downloadFile(url, outputPath, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    const request = https.get(url, { timeout }, (response) => {
      if (response.statusCode !== 200) {
        file.destroy();
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
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
      reject(err);
    });

    request.on('timeout', () => {
      request.destroy();
      fs.unlink(outputPath, () => {});
      reject(new Error('Download timeout'));
    });
  });
}

async function main() {
  log('\n========================================', 'info');
  log('ARKANUH 3D Model Downloader', 'info');
  log('========================================\n', 'info');

  // Create models directory
  if (!fs.existsSync(MODELS_DIR)) {
    fs.mkdirSync(MODELS_DIR, { recursive: true });
    log(`Created directory: ${MODELS_DIR}`, 'success');
  }

  let successCount = 0;
  let fallbackCount = 0;
  let totalSize = 0;

  for (const model of MODELS) {
    const outputPath = path.join(MODELS_DIR, model.filename);
    const studioUrl = `https://studio.tripo3d.ai/3d-model/${model.modelId}?invite_code=${INVITE_CODE}`;

    process.stdout.write(`[${model.pageId}] Downloading ${model.filename}... `);

    // Check if file already exists and is valid
    if (fs.existsSync(outputPath)) {
      const fileSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(1);
      log(`already exists (${fileSize} MB)`, 'success');
      totalSize += parseFloat(fileSize);
      successCount++;
      continue;
    }

    // Try to download from various endpoints
    const endpoints = [
      `https://api.tripo3d.ai/v2/openapi/models/${model.modelId}/download?format=glb&token=${INVITE_CODE}`,
      `https://studio.tripo3d.ai/api/download/${model.modelId}`,
    ];

    let downloaded = false;
    for (const endpoint of endpoints) {
      try {
        await downloadFile(endpoint, outputPath);
        const fileSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(1);
        log(`downloaded (${fileSize} MB)`, 'success');
        totalSize += parseFloat(fileSize);
        successCount++;
        downloaded = true;
        break;
      } catch (err) {
        // Try next endpoint
      }
    }

    if (!downloaded) {
      // Create fallback model
      try {
        const fallbackGlb = createFallbackModel(model.filename);
        fs.writeFileSync(outputPath, fallbackGlb);
        log(`created placeholder (0.5 KB) - Studio URL: ${studioUrl}`, 'warning');
        fallbackCount++;
      } catch (err) {
        log(`failed: ${err.message}`, 'error');
      }
    }
  }

  log('\n========================================', 'info');
  log('Download Summary:', 'info');
  log(`  Downloaded: ${successCount} / 9`, successCount === 9 ? 'success' : 'warning');
  log(`  Fallback models: ${fallbackCount} / 9`, 'info');
  log(`  Total size: ${totalSize.toFixed(1)} MB`, 'info');
  log('========================================\n', 'info');

  if (successCount === 9) {
    log('✓ All models ready!', 'success');
  } else if (successCount + fallbackCount === 9) {
    log('⚠ Using placeholder models for testing', 'warning');
    log('To complete setup, manually download from Tripo3D studio URLs and replace placeholders.', 'warning');
  }

  log('Run "npm run build" to compile the project.\n', 'info');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
