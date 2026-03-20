import { withBasePath } from "../lib/assetPaths";

export type ModelManifestEntry = {
  pageId: string;
  status: "ready" | "missing";
  src?: string;
  reason?: string;
  sourcePageUrl?: string;
};

type ModelManifestFile = {
  generatedAt?: string;
  entries: ModelManifestEntry[];
};

const defaultEntries: ModelManifestEntry[] = Array.from({ length: 10 }, (_, index) => {
  const pageId = String(index + 1);
  const pagePadded = String(index + 1).padStart(2, "0");
  return {
    pageId,
    status: "ready",
    src: `assets/models/page-${pagePadded}.glb`
  };
});

export async function loadModelManifest(): Promise<Map<string, ModelManifestEntry>> {
  const manifestUrl = withBasePath("assets/models/model-manifest.json");
  try {
    const response = await fetch(manifestUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = (await response.json()) as ModelManifestFile;
    if (!payload?.entries || !Array.isArray(payload.entries)) {
      throw new Error("manifest_invalid");
    }

    const mapped: ModelManifestEntry[] = [];
    payload.entries.forEach((entry) => {
      if (!entry || !entry.pageId) {
        return;
      }

      const hasRemoteSrc = Boolean(entry.src && /^https?:\/\//i.test(entry.src));
      mapped.push({
        pageId: String(entry.pageId),
        status: entry.status === "ready" ? "ready" : "missing",
        src: entry.src ? (hasRemoteSrc ? entry.src : withBasePath(entry.src)) : undefined,
        reason: entry.reason,
        sourcePageUrl: typeof entry.sourcePageUrl === "string" ? entry.sourcePageUrl : undefined
      });
    });

    return new Map(mapped.map((entry) => [entry.pageId, entry]));
  } catch {
    const fallback = defaultEntries.map((entry) => ({
      ...entry,
      src: withBasePath(entry.src ?? "")
    }));
    return new Map(fallback.map((entry) => [entry.pageId, entry]));
  }
}
