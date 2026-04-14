import { withBasePath } from "../lib/assetPaths";
import { VoiceAssetManifest } from "../types/domain";

export const voiceAssets: VoiceAssetManifest[] = Array.from({ length: 10 }, (_, index) => {
  const pageId = String(index + 1);
  const pagePadded = pageId.padStart(2, "0");

  return {
    pageId,
    src: withBasePath(`assets/voice/page-${pagePadded}.mp3`),
    fallbackSrc: withBasePath(`assets/voice/page-${pagePadded}.wav`)
  };
});

const voiceAssetMap = new Map(voiceAssets.map((item) => [item.pageId, item]));

export function getVoiceAssetByPageId(pageId: string): VoiceAssetManifest | undefined {
  return voiceAssetMap.get(pageId);
}
