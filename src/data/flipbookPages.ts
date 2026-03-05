import { FlipbookPage } from "../types/domain";

export const flipbookPages: FlipbookPage[] = [
  // Tambahkan halaman cerita di sini
];

export const flipbookPageMap = new Map<string, FlipbookPage>(
  flipbookPages.map((page) => [page.id, page])
);

export const totalFlipbookPages = flipbookPages.length;

export function getNextFlipbookPageId(pageId: string): string | null {
  const index = flipbookPages.findIndex((page) => page.id === pageId);
  if (index === -1 || index === flipbookPages.length - 1) {
    return null;
  }
  return flipbookPages[index + 1].id;
}

export function getPrevFlipbookPageId(pageId: string): string | null {
  const index = flipbookPages.findIndex((page) => page.id === pageId);
  if (index <= 0) {
    return null;
  }
  return flipbookPages[index - 1].id;
}
