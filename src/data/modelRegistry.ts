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
