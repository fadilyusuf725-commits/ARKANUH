import { VoiceAssetManifest } from "../types/domain";

export const voiceAssets: VoiceAssetManifest[] = [
  { pageId: "1", src: "/assets/voice/page-01.mp3" },
  { pageId: "2", src: "/assets/voice/page-02.mp3" },
  { pageId: "3", src: "/assets/voice/page-03.mp3" },
  { pageId: "4", src: "/assets/voice/page-04.mp3" },
  { pageId: "5", src: "/assets/voice/page-05.mp3" },
  { pageId: "6", src: "/assets/voice/page-06.mp3" },
  { pageId: "7", src: "/assets/voice/page-07.mp3" },
  { pageId: "8", src: "/assets/voice/page-08.mp3" },
  { pageId: "9", src: "/assets/voice/page-09.mp3" },
  { pageId: "10", src: "/assets/voice/page-10.mp3" }
];

const voiceAssetMap = new Map(voiceAssets.map((item) => [item.pageId, item]));

export function getVoiceAssetByPageId(pageId: string): VoiceAssetManifest | undefined {
  return voiceAssetMap.get(pageId);
}
