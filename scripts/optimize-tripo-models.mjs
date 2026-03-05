import { existsSync } from "node:fs";
import { mkdir, readdir, rename, rm } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const rootDir = process.cwd();
const modelDir = path.join(rootDir, "public", "assets", "models");
const tempDir = path.join(rootDir, "tmp", "optimized-models");
async function runOptimize(inputFile, outputFile) {
  await new Promise((resolve, reject) => {
    const executable = process.platform === "win32" ? "npx.cmd" : "npx";
    const args = [
      "@gltf-transform/cli",
      "optimize",
      inputFile,
      outputFile,
      "--compress",
      "meshopt",
      "--texture-compress",
      "webp",
      "--texture-size",
      "1024",
      "--simplify-ratio",
      "0.12"
    ];

    const child = spawn(executable, args, {
      cwd: rootDir,
      stdio: "inherit",
      shell: true
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve(undefined);
        return;
      }

      reject(new Error(`Optimization failed for ${path.basename(inputFile)} with code ${code ?? "unknown"}`));
    });
  });
}

async function main() {
  if (!existsSync(modelDir)) {
    throw new Error(`Model directory not found: ${modelDir}`);
  }

  await mkdir(tempDir, { recursive: true });
  const entries = await readdir(modelDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".glb"))
    .map((entry) => entry.name)
    .sort();

  for (const file of files) {
    const inputFile = path.join(modelDir, file);
    const outputFile = path.join(tempDir, file);
    console.log(`[optimize] ${file}`);
    await runOptimize(inputFile, outputFile);
    await rename(outputFile, inputFile);
  }

  await rm(tempDir, { recursive: true, force: true });
  console.log("Semua model berhasil dioptimalkan.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
