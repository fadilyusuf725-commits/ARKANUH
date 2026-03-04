import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const distDir = resolve("dist");
const indexPath = resolve(distDir, "index.html");
const fallbackPath = resolve(distDir, "404.html");

if (!existsSync(indexPath)) {
  console.warn("[postbuild] index.html tidak ditemukan. Lewati pembuatan fallback 404.");
  process.exit(0);
}

copyFileSync(indexPath, fallbackPath);
console.log("[postbuild] Fallback SPA dibuat:", fallbackPath);
