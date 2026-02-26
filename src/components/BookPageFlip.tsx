import { ComponentType, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { FlipbookPage } from "../types/domain";
import { FlipPageFrame } from "./FlipPageFrame";

type BookPageFlipProps = {
  pages: FlipbookPage[];
  currentPageIndex: number;
  canAdvance: boolean;
  onTurnRequest: (nextIndex: number) => void;
};

export function BookPageFlip({ pages, currentPageIndex, canAdvance, onTurnRequest }: BookPageFlipProps) {
  const HTMLFlipBookAny = HTMLFlipBook as unknown as ComponentType<any>;
  const flipRef = useRef<{
    pageFlip: () => {
      turnToPage?: (pageIndex: number) => void;
      flipNext?: () => void;
      flipPrev?: () => void;
    };
  } | null>(null);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    const api = flipRef.current?.pageFlip?.();
    if (!api?.turnToPage) {
      return;
    }

    isSyncingRef.current = true;
    api.turnToPage(currentPageIndex);
    const timeout = window.setTimeout(() => {
      isSyncingRef.current = false;
    }, 40);

    return () => window.clearTimeout(timeout);
  }, [currentPageIndex]);

  const handleFlip = (event: { data: number }) => {
    if (isSyncingRef.current) {
      return;
    }

    const nextIndex = event.data;
    if (nextIndex > currentPageIndex && !canAdvance) {
      const api = flipRef.current?.pageFlip?.();
      if (api?.turnToPage) {
        isSyncingRef.current = true;
        api.turnToPage(currentPageIndex);
        window.setTimeout(() => {
          isSyncingRef.current = false;
        }, 40);
      }
      return;
    }

    onTurnRequest(nextIndex);
  };

  return (
    <section className="book-pageflip-wrap">
      <HTMLFlipBookAny
        ref={flipRef}
        className="book-pageflip"
        style={{}}
        width={380}
        height={460}
        size="stretch"
        startPage={currentPageIndex}
        minWidth={280}
        maxWidth={980}
        minHeight={320}
        maxHeight={560}
        drawShadow
        flippingTime={680}
        usePortrait={false}
        startZIndex={0}
        autoSize
        maxShadowOpacity={0.35}
        showCover
        mobileScrollSupport={false}
        swipeDistance={30}
        clickEventForward
        useMouseEvents
        renderOnlyPageLengthChange
        onFlip={handleFlip}
      >
        {pages.map((page, index) => (
          <FlipPageFrame
            key={page.id}
            page={page}
            pageNumber={index + 1}
            isActive={index === currentPageIndex}
            isCover={index === 0 || index === pages.length - 1}
          />
        ))}
      </HTMLFlipBookAny>
    </section>
  );
}
