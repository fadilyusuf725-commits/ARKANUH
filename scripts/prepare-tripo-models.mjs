import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const rootDir = process.cwd();
const linksPath = path.join(rootDir, "assets", "model-links", "tripo-page-links.json");
const modelsDir = path.join(rootDir, "public", "assets", "models");
const manifestPath = path.join(modelsDir, "model-manifest.json");

function decodeEscapedUrl(value) {
  try {
    return JSON.parse(`"${value.replace(/"/g, '\\"')}"`);
  } catch {
    return value.replace(/\\\//g, "/");
  }
}

function pickBestGlbUrl(urls) {
  if (urls.length === 0) {
    return null;
  }

  const scored = urls.map((url) => {
    const lower = url.toLowerCase();
    let score = 0;
    if (lower.includes("pbr")) score += 20;
    if (lower.includes("meshopt")) score -= 40;
    if (lower.includes("point_cloud")) score -= 80;
    if (lower.includes("vecset")) score -= 80;
    if (lower.includes("output_")) score -= 20;
    return { url, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.url ?? null;
}

function extractModelUrlFromHtml(html) {
  const allMatches = [];
  const patterns = [
    /"contentUrl":"(https:\\\/\\\/[^"]+?\.glb[^"]*)"/g,
    /"contentUrl":"(https:\/\/[^"]+?\.glb[^"]*)"/g,
    /contentUrl"\s*:\s*"(https:\/\/[^"]+?\.glb[^"]*)"/g
  ];

  for (const regex of patterns) {
    let match = regex.exec(html);
    while (match) {
      allMatches.push(decodeEscapedUrl(match[1]));
      match = regex.exec(html);
    }
  }

  const unique = Array.from(new Set(allMatches));
  return pickBestGlbUrl(unique);
}

async function downloadFile(url, targetPath) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(targetPath, buffer);
  return buffer.byteLength;
}

function optimizeModelInPlace(filePath) {
  const tmpPath = `${filePath}.optimized.glb`;
  execFileSync(
    "npx",
    [
      "@gltf-transform/cli",
      "optimize",
      filePath,
      tmpPath,
      "--compress",
      "draco",
      "--texture-compress",
      "webp",
      "--texture-size",
      "2048"
    ],
    { stdio: "pipe" }
  );

  fs.renameSync(tmpPath, filePath);
  return fs.statSync(filePath).size;
}

function createMissingEntry(pageId, reason) {
  return {
    pageId,
    status: "missing",
    reason
  };
}

async function main() {
  if (!fs.existsSync(linksPath)) {
    throw new Error(`Mapping link tidak ditemukan: ${path.relative(rootDir, linksPath)}`);
  }

  const raw = fs.readFileSync(linksPath, "utf8");
  const links = JSON.parse(raw);
  if (!Array.isArray(links) || links.length === 0) {
    throw new Error("Isi file tripo-page-links.json kosong.");
  }

  const seenPages = new Set();
  const normalized = links.map((item) => {
    const pageId = String(item.pageId ?? "").trim();
    const url = String(item.url ?? "").trim();
    if (!pageId) {
      throw new Error("Ada entry pageId kosong.");
    }

    if (seenPages.has(pageId)) {
      throw new Error(`Duplikasi pageId terdeteksi: ${pageId}`);
    }
    seenPages.add(pageId);
    return { pageId, url };
  });

  fs.mkdirSync(modelsDir, { recursive: true });

  const manifest = [];
  for (const item of normalized) {
    const pagePadded = String(Number(item.pageId)).padStart(2, "0");
    const outputName = `page-${pagePadded}.glb`;
    const outputPath = path.join(modelsDir, outputName);

    if (!item.url) {
      console.warn(`[models] page ${item.pageId}: URL kosong, skip.`);
      manifest.push(createMissingEntry(item.pageId, "missing_page_url"));
      continue;
    }

    try {
      const htmlResponse = await fetch(item.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        }
      });

      if (!htmlResponse.ok) {
        throw new Error(`fetch page failed: HTTP ${htmlResponse.status}`);
      }

      const html = await htmlResponse.text();
      const resolvedModelUrl = extractModelUrlFromHtml(html);
      if (!resolvedModelUrl) {
        throw new Error("contentUrl .glb tidak ditemukan");
      }

      const downloadedSize = await downloadFile(resolvedModelUrl, outputPath);
      let sizeBytes = downloadedSize;
      try {
        sizeBytes = optimizeModelInPlace(outputPath);
        console.log(
          `[models] page ${item.pageId}: optimized ${outputName} (${Math.round(downloadedSize / 1024)} KB -> ${Math.round(sizeBytes / 1024)} KB)`
        );
      } catch (optError) {
        console.warn(
          `[models] page ${item.pageId}: optimize failed, using original file (${optError instanceof Error ? optError.message : String(optError)})`
        );
      }

      manifest.push({
        pageId: item.pageId,
        status: "ready",
        src: `assets/models/${outputName}`,
        sourcePageUrl: item.url,
        resolvedModelUrl,
        sizeBytes
      });
    } catch (error) {
      console.warn(`[models] page ${item.pageId}: gagal -> ${error instanceof Error ? error.message : String(error)}`);
      manifest.push(createMissingEntry(item.pageId, "download_failed"));
    }
  }

  fs.writeFileSync(
    manifestPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        entries: manifest
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  console.log(`[models] manifest updated: ${path.relative(rootDir, manifestPath)}`);
}

main().catch((error) => {
  console.error(`[models] failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
