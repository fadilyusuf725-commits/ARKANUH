import fs from "node:fs/promises";
import path from "node:path";

const inputDir = process.argv[2] ?? path.resolve("public/assets/ppt-story/raw");
const outputDir = process.argv[3] ?? path.resolve("public/assets/ppt-story/optimized");

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    throw new Error("Paket 'sharp' belum terpasang. Jalankan: npm install");
  }

  await fs.mkdir(outputDir, { recursive: true });
  const entries = await fs.readdir(inputDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && /^image\d+\.(png|jpg|jpeg)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "en"));

  if (files.length === 0) {
    throw new Error(`Tidak ada file image*.png/jpg di ${inputDir}`);
  }

  for (const fileName of files) {
    const sourcePath = path.join(inputDir, fileName);
    const parsed = path.parse(fileName);
    const targetPath = path.join(outputDir, `${parsed.name}.webp`);

    await sharp(sourcePath)
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 78, effort: 4 })
      .toFile(targetPath);

    console.log(`Optimized: ${fileName} -> ${path.basename(targetPath)}`);
  }

  console.log("");
  console.log(`Selesai optimasi aset PPT. Output: ${outputDir}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
