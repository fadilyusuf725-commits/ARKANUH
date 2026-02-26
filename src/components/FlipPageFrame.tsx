import { forwardRef } from "react";
import { FlipbookPage } from "../types/domain";

type FlipPageFrameProps = {
  page: FlipbookPage;
  pageNumber: number;
  isActive: boolean;
  isCover?: boolean;
};

export const FlipPageFrame = forwardRef<HTMLDivElement, FlipPageFrameProps>(function FlipPageFrame(
  { page, pageNumber, isActive, isCover = false },
  ref
) {
  return (
    <div ref={ref} className={`flip-page-frame ${isActive ? "is-active" : ""} ${isCover ? "is-cover" : ""}`}>
      <div className="flip-page-content">
        <p className="flip-page-number">Halaman {pageNumber}</p>
        <h3 className="flip-page-title">{page.title}</h3>
        <p className="flip-page-objective">{page.objective}</p>
      </div>
    </div>
  );
});
