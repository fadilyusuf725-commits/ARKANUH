import { CSSProperties } from "react";
import { FlipbookPage } from "../types/domain";

type FloatingSideTextProps = {
  page: FlipbookPage;
};

export function FloatingSideText({ page }: FloatingSideTextProps) {
  return (
    <aside className="floating-side-text" style={{ "--popup-accent": page.popupAccent } as CSSProperties}>
      <p className="eyebrow">Teks Mengambang</p>
      <h3>{page.title}</h3>
      <p>{page.floatingText}</p>
      <p className="floating-tag">Tema pop-up: {page.popupTemplate}</p>
    </aside>
  );
}
