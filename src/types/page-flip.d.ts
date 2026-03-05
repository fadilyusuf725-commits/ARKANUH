// page-flip library type definitions
// Uses dynamic import to avoid strict TypeScript issues with UMD export
declare module "page-flip" {
  interface PageFlipOptions {
    width?: number;
    height?: number;
    size?: "fixed" | "stretch";
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    showCover?: boolean;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    useMouseEvents?: boolean;
    disableFlip?: boolean;
    clickEventForward?: boolean;
    usePortrait?: boolean;
    startZIndex?: number;
    drawShadow?: boolean;
    flips?: number;
    duration?: number;
    mobileScrollSupport?: boolean;
  }

  interface PageFlipObject {
    data: number;
  }

  class PageFlip {
    constructor(container: HTMLElement, options?: PageFlipOptions);
    addPage(page: HTMLElement, pageIndex: number): void;
    on(event: string, callback: (object: PageFlipObject) => void): void;
    off(event: string, callback: (object: PageFlipObject) => void): void;
    turnToPage(pageIndex: number): void;
    nextPage(): void;
    prevPage(): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    destroy(): void;
  }

  export default PageFlip;
}
