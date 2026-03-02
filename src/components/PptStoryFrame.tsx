import { FlipbookPage } from "../types/domain";
import { LayeredIllustration } from "./LayeredIllustration";

type PptStoryFrameProps = {
  page: FlipbookPage;
};

export function PptStoryFrame({ page }: PptStoryFrameProps) {
  return (
    <section className="card ppt-story-frame">
      <header className="ppt-story-head">
        <span className="ppt-badge">{page.slideLayout.pageBadgeLabel}</span>
        <div>
          <h2>{page.title}</h2>
          <p className="muted">{page.objective}</p>
        </div>
      </header>

      <LayeredIllustration layers={page.slideLayout.layers} title={page.title} />

      <div className="ppt-story-body">
        <p>{page.slideLayout.bodyText}</p>
        {page.slideLayout.emphasizeText ? (
          <p className="ppt-emphasize">"{page.slideLayout.emphasizeText}"</p>
        ) : null}
      </div>

      <aside className="ppt-floating-note">
        <p className="floating-tag">Pesan Utama</p>
        <p>{page.floatingText}</p>
      </aside>
    </section>
  );
}
