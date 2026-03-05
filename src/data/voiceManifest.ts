import { withBasePath } from "../lib/assetPaths";
import { VoiceAssetManifest } from "../types/domain";

export const voiceAssets: VoiceAssetManifest[] = [
  { pageId: "1", src: withBasePath("assets/voice/page-01.wav") },
  { pageId: "2", src: withBasePath("assets/voice/page-02.wav") },
  { pageId: "3", src: withBasePath("assets/voice/page-03.wav") },
  { pageId: "4", src: withBasePath("assets/voice/page-04.wav") },
  { pageId: "5", src: withBasePath("assets/voice/page-05.wav") },
  { pageId: "6", src: withBasePath("assets/voice/page-06.wav") },
  { pageId: "7", src: withBasePath("assets/voice/page-07.wav") },
  { pageId: "8", src: withBasePath("assets/voice/page-08.wav") },
  { pageId: "9", src: withBasePath("assets/voice/page-09.wav") },
  { pageId: "10", src: withBasePath("assets/voice/page-10.wav") }
];

const voiceAssetMap = new Map(voiceAssets.map((item) => [item.pageId, item]));

export function getVoiceAssetByPageId(pageId: string): VoiceAssetManifest | undefined {
  return voiceAssetMap.get(pageId);
}
