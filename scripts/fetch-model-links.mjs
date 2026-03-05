import fs from "node:fs/promises";
import path from "node:path";

const EXPECTED_PAGE_IDS = Array.from({ length: 10 }, (_, index) => String(index + 1));
const VALID_FORMATS = new Set(["fbx", "glb"]);
const VALID_SOURCE_TYPES = new Set(["tripo_page", "direct_file", "none"]);

function normalizePageId(pageId) {
  const parsed = Number(pageId);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 10) {
    throw new Error(`pageId tidak valid: ${pageId}`);
  }
  return String(parsed);
}

function inferFormatFromUrl(urlText) {
  const cleanUrl = urlText.split("?")[0].toLowerCase();
  if (cleanUrl.endsWith(".fbx")) {
    return "fbx";
  }
  if (cleanUrl.endsWith(".glb")) {
    return "glb";
  }
  return null;
}

function decodePossibleEscapedUrl(rawValue) {
  if (!rawValue || typeof rawValue !== "string") {
    return "";
  }

  return rawValue
    .replace(/\\\//g, "/")
    .replace(/\\u0026/gi, "&")
    .replace(/&amp;/gi, "&")
    .trim();
}

function parseConfig(argv) {
  const mappingArg = argv.find((value) => value.startsWith("--mapping="));
  const outputArg = argv.find((value) => value.startsWith("--output="));
  const resolvedArg = argv.find((value) => value.startsWith("--resolved="));
  return {
    mappingPath: mappingArg ? mappingArg.split("=")[1] : "assets/model-links/page-model-links.json",
    outputDir: outputArg ? outputArg.split("=")[1] : "unity/ARKANUHBook/Assets/Models/Incoming",
    resolvedPath: resolvedArg
      ? resolvedArg.split("=")[1]
      : "assets/model-links/.resolved-model-links.json"
  };
}

async function readMappingFile(mappingPath) {
  const raw = await fs.readFile(mappingPath, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("Format page-model-links.json harus berupa array.");
  }
  return parsed;
}

function extractTripoModelId(urlText) {
  const match = urlText.match(/\/3d-model\/([0-9a-f-]{36})/i);
  return match ? match[1].toLowerCase() : null;
}

async function validateEntries(entries) {
  const seenPageIds = new Set();
  for (const entry of entries) {
    if (typeof entry !== "object" || entry === null) {
      throw new Error("Setiap entri model harus berupa object.");
    }

    const pageId = normalizePageId(entry.pageId);
    if (seenPageIds.has(pageId)) {
      throw new Error(`Duplikat pageId terdeteksi: ${pageId}`);
    }
    seenPageIds.add(pageId);

    if (typeof entry.sourceType !== "string" || !VALID_SOURCE_TYPES.has(entry.sourceType)) {
      throw new Error(`sourceType tidak valid di pageId ${pageId}.`);
    }

    if (entry.sourceType === "none") {
      continue;
    }

    if (typeof entry.url !== "string" || !entry.url.startsWith("http")) {
      throw new Error(`URL tidak valid di pageId ${pageId}.`);
    }

    if (entry.sourceType === "tripo_page" && !extractTripoModelId(entry.url)) {
      throw new Error(`URL Tripo tidak valid di pageId ${pageId}.`);
    }

    if (entry.sourceType === "direct_file") {
      const declaredFormat = typeof entry.format === "string" ? entry.format.toLowerCase() : null;
      const inferredFormat = inferFormatFromUrl(entry.url);
      const finalFormat = declaredFormat ?? inferredFormat;

      if (!finalFormat || !VALID_FORMATS.has(finalFormat)) {
        throw new Error(`Format model tidak valid di pageId ${pageId}. Hanya glb/fbx.`);
      }

      if (declaredFormat && inferredFormat && declaredFormat !== inferredFormat) {
        throw new Error(`Format pada URL dan field format berbeda untuk pageId ${pageId}.`);
      }
    }
  }

  for (const pageId of EXPECTED_PAGE_IDS) {
    if (!seenPageIds.has(pageId)) {
      throw new Error(`Mapping pageId ${pageId} belum diisi.`);
    }
  }
}

function pickTripoModelContentUrl(html, modelId) {
  const scripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const modelIdNeedle = modelId?.toLowerCase() ?? "";
  const candidates = [];

  function scoreUrl(url) {
    let score = 0;
    if (url.includes("tripo_pbr_model_")) {
      score += 60;
    } else if (url.includes("tripo_model_")) {
      score += 45;
    } else if (url.includes("output_model_")) {
      score += 30;
    } else if (url.includes("output_point_cloud") || url.includes("structure_point_cloud")) {
      score -= 80;
    }

    if (url.includes("_meshopt")) {
      score += 5;
    }

    return score;
  }

  for (const [, scriptContent] of scripts) {
    try {
      const payload = JSON.parse(scriptContent);
      const items = Array.isArray(payload) ? payload : [payload];

      for (const item of items) {
        if (!item || typeof item !== "object") {
          continue;
        }

        if (typeof item.contentUrl !== "string") {
          continue;
        }

        const contentUrl = decodePossibleEscapedUrl(item.contentUrl);
        if (!contentUrl.toLowerCase().includes(".glb")) {
          continue;
        }

        const haystack = `${item.url ?? ""} ${item.mainEntityofPage ?? ""}`.toLowerCase();
        const score = (haystack.includes(modelIdNeedle) ? 100 : 0) + scoreUrl(contentUrl);

        candidates.push({ contentUrl, score });
      }
    } catch {
      // ignore invalid json-ld block
    }
  }

  const rawUrls = [...html.matchAll(/https?:\\?\/\\?\/[^"'\\<>\s]+?\.glb[^"'\\<>\s]*/gi)].map((match) =>
    decodePossibleEscapedUrl(match[0])
  );
  const filteredRaw = rawUrls.filter((url) => url.includes("tripo-data") && url.includes(".glb"));

  if (candidates.length > 0) {
    candidates.sort((left, right) => right.score - left.score);
    return candidates[0].contentUrl;
  }

  if (filteredRaw.length > 0) {
    const rawCandidates = filteredRaw.map((contentUrl) => ({
      contentUrl,
      score: (modelIdNeedle && contentUrl.toLowerCase().includes(modelIdNeedle) ? 100 : 0) + scoreUrl(contentUrl)
    }));
    rawCandidates.sort((left, right) => right.score - left.score);
    return rawCandidates[0].contentUrl;
  }

  return null;
}

async function resolveSourceUrl(entry) {
  if (entry.sourceType === "none") {
    return { resolvedUrl: null, resolvedFormat: null };
  }

  if (entry.sourceType === "direct_file") {
    const inferred = inferFormatFromUrl(entry.url);
    const format = (entry.format || inferred || "").toLowerCase();
    if (!VALID_FORMATS.has(format)) {
      throw new Error(`Format tidak bisa ditentukan untuk pageId ${entry.pageId}.`);
    }
    return { resolvedUrl: entry.url, resolvedFormat: format };
  }

  const modelId = extractTripoModelId(entry.url);
  const response = await fetch(entry.url, {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }
  });
  if (!response.ok) {
    throw new Error(`Gagal membaca halaman Tripo pageId ${entry.pageId}. HTTP ${response.status}`);
  }

  const html = await response.text();
  const contentUrl = pickTripoModelContentUrl(html, modelId);
  if (!contentUrl) {
    throw new Error(`Tidak menemukan contentUrl GLB pada halaman Tripo pageId ${entry.pageId}.`);
  }

  return { resolvedUrl: contentUrl, resolvedFormat: "glb" };
}

async function downloadFile(url, targetPath) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} saat mengunduh ${url}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  if (buffer.byteLength === 0) {
    throw new Error(`File kosong: ${url}`);
  }

  await fs.writeFile(targetPath, buffer);
  return buffer.byteLength;
}

async function writeResolvedReport(resolvedPath, reportItems) {
  const payload = {
    generatedAt: new Date().toISOString(),
    items: reportItems
  };
  await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
  await fs.writeFile(resolvedPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

async function main() {
  const config = parseConfig(process.argv.slice(2));
  const projectRoot = process.cwd();
  const mappingPath = path.resolve(projectRoot, config.mappingPath);
  const outputDir = path.resolve(projectRoot, config.outputDir);
  const resolvedPath = path.resolve(projectRoot, config.resolvedPath);

  const entries = await readMappingFile(mappingPath);
  await validateEntries(entries);
  await fs.mkdir(outputDir, { recursive: true });

  const reportItems = [];
  for (const entry of entries) {
    const pageId = String(Number(entry.pageId));
    const pageToken = pageId.padStart(2, "0");

    if (entry.sourceType === "none") {
      reportItems.push({
        pageId,
        sourceType: entry.sourceType,
        status: "skipped_none",
        resolvedUrl: null,
        fileName: null
      });
      process.stdout.write(`Skipping page-${pageToken} (sourceType=none)\n`);
      continue;
    }

    process.stdout.write(`Resolving source page-${pageToken} (${entry.sourceType})...\n`);
    const { resolvedUrl, resolvedFormat } = await resolveSourceUrl(entry);
    if (!resolvedUrl || !resolvedFormat) {
      throw new Error(`Resolusi URL gagal untuk pageId ${pageId}.`);
    }

    const finalFormat = (entry.format || resolvedFormat || inferFormatFromUrl(resolvedUrl) || "").toLowerCase();
    if (!VALID_FORMATS.has(finalFormat)) {
      throw new Error(`Format hasil tidak valid untuk pageId ${pageId}.`);
    }

    const fileName = `page-${pageToken}.${finalFormat}`;
    const destination = path.join(outputDir, fileName);
    process.stdout.write(`Downloading ${resolvedUrl}\n`);
    const bytes = await downloadFile(resolvedUrl, destination);

    reportItems.push({
      pageId,
      sourceType: entry.sourceType,
      status: "downloaded",
      resolvedUrl,
      fileName,
      bytes
    });
    process.stdout.write(`Saved ${fileName} (${bytes} bytes)\n`);
  }

  await writeResolvedReport(resolvedPath, reportItems);
  process.stdout.write(`Resolved report: ${resolvedPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
