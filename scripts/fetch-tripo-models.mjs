import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const outputDir = path.join(rootDir, "public", "assets", "models");

const models = [
  {
    pageId: "1",
    url: "https://studio.tripo3d.ai/3d-model/ac1160db-5473-4df9-9d05-98bce22955e3?invite_code=LKAST7"
  },
  {
    pageId: "2",
    url: "https://studio.tripo3d.ai/3d-model/13a00c36-367b-4371-8740-b1d8bc5390b2?invite_code=LKAST7"
  },
  {
    pageId: "3",
    url: "https://studio.tripo3d.ai/3d-model/72294589-9b8c-4554-9bf7-c6ea880c9360?invite_code=QCYWGH"
  },
  {
    pageId: "4",
    url: "https://studio.tripo3d.ai/3d-model/716b3922-1112-4456-941d-dad7f25b495e?invite_code=QCYWGH"
  },
  {
    pageId: "5",
    url: "https://studio.tripo3d.ai/3d-model/081f023b-8053-4c46-b240-db0462e4d637?invite_code=QCYWGH"
  },
  {
    pageId: "6",
    url: "https://studio.tripo3d.ai/3d-model/228e64d9-651b-453d-b626-4e3864e069b1?invite_code=QCYWGH"
  },
  {
    pageId: "7",
    url: "https://studio.tripo3d.ai/3d-model/2bd377ae-fbd0-4ca4-9006-ece3d2ec772c?invite_code=LKAST7"
  },
  {
    pageId: "8",
    url: "https://studio.tripo3d.ai/3d-model/6f41fe0b-7cce-40d8-8b72-93d4b01264e0?invite_code=31OFKB"
  },
  {
    pageId: "9",
    url: "https://studio.tripo3d.ai/3d-model/941a73af-5d63-4312-b1cb-23994ba41cc6?invite_code=LKAST7"
  },
  {
    pageId: "10",
    url: "https://studio.tripo3d.ai/3d-model/b5d24a9f-55a9-4931-b774-fead65d02b10?invite_code=LKAST7"
  }
];

function extractGlbUrl(html) {
  const matches = Array.from(
    html.matchAll(/"@type":\["3DModel","CreativeWork"\][\s\S]*?"contentUrl":"([^"]+?\.glb[^"]*)"/g)
  );

  if (matches.length > 0) {
    return matches[0][1].replaceAll("\\u0026", "&");
  }

  const fallback = html.match(/"contentUrl":"([^"]+?\.glb[^"]*)"/);
  return fallback ? fallback[1].replaceAll("\\u0026", "&") : null;
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0 Safari/537.36"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch page ${url}: ${response.status}`);
  }

  return response.text();
}

async function downloadFile(url, destination) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0 Safari/537.36"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to download model ${url}: ${response.status}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  await writeFile(destination, bytes);
}

await mkdir(outputDir, { recursive: true });

for (const item of models) {
  const outputFile = path.join(outputDir, `page-${item.pageId.padStart(2, "0")}.glb`);

  if (existsSync(outputFile)) {
    console.log(`[skip] page ${item.pageId} already exists`);
    continue;
  }

  console.log(`[page ${item.pageId}] resolving model URL`);
  const html = await fetchHtml(item.url);
  const modelUrl = extractGlbUrl(html);

  if (!modelUrl) {
    throw new Error(`Could not resolve GLB URL for page ${item.pageId}`);
  }

  console.log(`[page ${item.pageId}] downloading model`);
  await downloadFile(modelUrl, outputFile);
}

console.log("Done.");
