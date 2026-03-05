export type ResolvedModelLink = {
  pageId: string;
  sourceType: "tripo_page" | "direct_file" | "none";
  status: string;
  resolvedUrl: string | null;
  fileName: string | null;
  bytes?: number;
};

export type ModelLinksFile = {
  generatedAt: string;
  items: ResolvedModelLink[];
};

// Cache model links globally
let modelLinksCache: Record<string, ResolvedModelLink | null> | null = null;

// Cache for model existence checks
let modelExistenceCache: Record<string, boolean> = {};

// Cache for loaded ArrayBuffer models
let loadedModelsCache: Record<string, ArrayBuffer> = {};

export async function loadModelLinks(): Promise<Record<string, ResolvedModelLink | null>> {
  if (modelLinksCache !== null) {
    return modelLinksCache;
  }

  try {
    // Load from resolved-model-links first (pre-resolved CloudFront URLs)
    const response = await fetch(
      new URL("../../../assets/model-links/.resolved-model-links.json", import.meta.url)
    );

    if (!response.ok) {
      console.warn("Failed to load resolved model links JSON");
      return {};
    }

    const data: ModelLinksFile = await response.json();
    modelLinksCache = {};

    data.items.forEach((item) => {
      modelLinksCache![item.pageId] = item;
    });

    console.log(`[ModelRegistry] Loaded ${data.items.filter((i) => i.resolvedUrl).length} model links`);
    return modelLinksCache;
  } catch (error) {
    console.warn("Error loading model links:", error);
    return {};
  }
}

export async function getModelLinkByPageId(pageId: string): Promise<ResolvedModelLink | null> {
  const links = await loadModelLinks();
  return links[pageId] ?? null;
}

export function getModelUrl(modelLink: ResolvedModelLink | null): string | null {
  if (!modelLink || modelLink.sourceType === "none" || !modelLink.resolvedUrl) {
    return null;
  }
  return modelLink.resolvedUrl;
}

/**
 * Check if a model file exists by making a HEAD request
 * Results are cached to avoid repeated checks
 */
export async function checkModelExists(url: string): Promise<boolean> {
  if (modelExistenceCache[url] !== undefined) {
    console.log(`[ModelRegistry] Cache hit for model existence: ${url}`);
    return modelExistenceCache[url];
  }

  try {
    console.log(`[ModelRegistry] Checking model existence: ${url}`);
    const response = await fetch(url, { method: "HEAD" });
    const exists = response.ok;
    modelExistenceCache[url] = exists;
    console.log(`[ModelRegistry] Model existence check result: ${url} = ${exists}`);
    return exists;
  } catch (error) {
    console.warn(`[ModelRegistry] Error checking model existence for ${url}:`, error);
    modelExistenceCache[url] = false;
    return false;
  }
}

/**
 * Pre-load and cache a model as ArrayBuffer
 * Useful for streaming or pre-fetching models
 */
export async function preloadModel(url: string): Promise<ArrayBuffer | null> {
  if (loadedModelsCache[url]) {
    console.log(`[ModelRegistry] Using cached model: ${url}`);
    return loadedModelsCache[url];
  }

  try {
    console.log(`[ModelRegistry] Pre-loading model: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    loadedModelsCache[url] = arrayBuffer;
    console.log(`[ModelRegistry] Successfully pre-loaded model (${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)}MB): ${url}`);
    return arrayBuffer;
  } catch (error) {
    console.error(`[ModelRegistry] Error pre-loading model ${url}:`, error);
    return null;
  }
}

/**
 * Verify all model URLs in the registry are reachable
 */
export async function verifyAllModels(): Promise<{
  total: number;
  available: number;
  missing: string[];
}> {
  const links = await loadModelLinks();
  const urls = Object.values(links)
    .filter((link): link is ResolvedModelLink => link !== null && link.resolvedUrl !== null)
    .map((link) => link.resolvedUrl as string);

  console.log(`[ModelRegistry] Verifying ${urls.length} models...`);

  const checks = await Promise.all(urls.map((url) => checkModelExists(url)));
  const missing = urls.filter((_url, idx) => !checks[idx]);

  const result = {
    total: urls.length,
    available: urls.length - missing.length,
    missing
  };

  console.log(`[ModelRegistry] Verification complete: ${result.available}/${result.total} available`);
  if (missing.length > 0) {
    console.warn(`[ModelRegistry] Missing models: ${missing.join(", ")}`);
  }

  return result;
}

/**
 * Clear all caches (useful for debugging or forcing fresh loads)
 */
export function clearCaches(): void {
  modelLinksCache = null;
  modelExistenceCache = {};
  loadedModelsCache = {};
  console.log("[ModelRegistry] All caches cleared");
}
