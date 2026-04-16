import { withBasePath } from "../lib/assetPaths";
import { VoiceAssetManifest } from "../types/domain";

const revisedVoiceOverrides: Partial<Record<string, string>> = {
  "1": "assets/voice/revisi/page-01.wav",
  "2": "assets/voice/revisi/page-02.wav",
  "5": "assets/voice/revisi/page-05.wav",
  "7": "assets/voice/revisi/page-07.wav",
  "10": "assets/voice/revisi/page-10.wav"
};

export const voiceAssets: VoiceAssetManifest[] = Array.from({ length: 10 }, (_, index) => {
  const pageId = String(index + 1);
  const pagePadded = pageId.padStart(2, "0");
  const revisedVoiceSrc = revisedVoiceOverrides[pageId];

  return {
    pageId,
    src: withBasePath(revisedVoiceSrc ?? `assets/voice/page-${pagePadded}.mp3`),
    fallbackSrc: withBasePath(revisedVoiceSrc ? `assets/voice/page-${pagePadded}.mp3` : `assets/voice/page-${pagePadded}.wav`)
  };
});

const voiceAssetMap = new Map(voiceAssets.map((item) => [item.pageId, item]));

export function getVoiceAssetByPageId(pageId: string): VoiceAssetManifest | undefined {
  return voiceAssetMap.get(pageId);
}
