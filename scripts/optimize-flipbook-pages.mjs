import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

function parseArgs(argv) {
  const map = new Map();
  for (let index = 2; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) {
      continue;
    }
    map.set(key.slice(2), argv[index + 1]);
    index += 1;
  }
  return {
    input: map.get("input"),
    output: map.get("output"),
    pages: Number(map.get("pages") ?? 10),
    longest: Number(map.get("longest") ?? 1600),
    quality: Number(map.get("quality") ?? 80)
  };
}

function extractTrailingNumber(fileName) {
  const match = path.parse(fileName).name.match(/(\d+)$/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

async function ensureDirectory(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true });
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.input || !args.output) {
    throw new Error("Gunakan --input <dir> --output <dir>.");
  }

  const inputDir = path.resolve(args.input);
  const outputDir = path.resolve(args.output);

  const allFiles = await fs.readdir(inputDir);
  const imageFiles = allFiles
    .filter((name) => /\.(png|jpg|jpeg)$/i.test(name))
    .sort((left, right) => extractTrailingNumber(left) - extractTrailingNumber(right))
    .slice(0, args.pages);

  if (imageFiles.length < args.pages) {
    throw new Error(`File slide ditemukan ${imageFiles.length}, butuh minimal ${args.pages}.`);
  }

  await ensureDirectory(outputDir);

  for (let index = 0; index < imageFiles.length; index += 1) {
    const sourceName = imageFiles[index];
    const pageNumber = String(index + 1).padStart(2, "0");
    const sourcePath = path.join(inputDir, sourceName);
    const targetPath = path.join(outputDir, `page-${pageNumber}.webp`);

    await sharp(sourcePath)
      .rotate()
      .resize({
        width: args.longest,
        height: args.longest,
        fit: "inside",
        withoutEnlargement: true
      })
      .webp({ quality: args.quality, effort: 5 })
      .toFile(targetPath);

    process.stdout.write(`Generated ${path.basename(targetPath)}\n`);
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
