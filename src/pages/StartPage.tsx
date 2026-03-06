import { useEffect, useMemo } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { InlineModelViewer } from "../components/InlineModelViewer";
import { ProgressTracker } from "../components/ProgressTracker";
import { VoiceNarration } from "../components/VoiceNarration";
import {
  flipbookPages,
  flipbookPageMap,
  getFirstIncompleteFlipbookPageId,
  totalFlipbookPages
} from "../data/flipbookPages";
import { getVoiceAssetByPageId } from "../data/voiceManifest";
import { useSessionContext } from "../state/SessionContext";

const HEYZINE_EMBED_URL = "https://heyzine.com/flip-book/88f0fa4179.html#page/20";

export function StartPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { session, markFlipbookPageCompleted, restartSession } = useSessionContext();

  const fallbackPageId = useMemo(
    () => getFirstIncompleteFlipbookPageId(session.flipbook.completedPages),
    [session.flipbook.completedPages]
  );

  const requestedPageId = searchParams.get("page");
  const activePageId = requestedPageId && flipbookPageMap.has(requestedPageId) ? requestedPageId : fallbackPageId;
  const activePage = flipbookPageMap.get(activePageId) ?? flipbookPages[0];
  const activeIndex = flipbookPages.findIndex((page) => page.id === activePage.id);
  const nextPage = activeIndex >= 0 ? flipbookPages[activeIndex + 1] : undefined;
  const activeVoice = getVoiceAssetByPageId(activePage.id);
  const nextVoice = nextPage ? getVoiceAssetByPageId(nextPage.id) : undefined;

  useEffect(() => {
    if (requestedPageId === activePageId) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", activePageId);
    setSearchParams(nextParams, { replace: true });
  }, [activePageId, requestedPageId, searchParams, setSearchParams]);

  useEffect(() => {
    if (!session.pretest.completed) {
      return;
    }

    markFlipbookPageCompleted(activePage.id, totalFlipbookPages);
  }, [activePage.id, markFlipbookPageCompleted, session.pretest.completed]);

  if (!session.pretest.completed) {
    return <Navigate to="/pretest" replace />;
  }

  const onSelectPage = (pageId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", pageId);
    setSearchParams(nextParams);
  };

  const onRestart = () => {
    restartSession(session.profile.nickname);
  };

  return (
    <main className="page-shell reader-page">
      <section className="hero-card reader-focus-hero">
        <p className="eyebrow">Mulai Membaca</p>
        <h1>Flipbook ARKANUH</h1>
        <p className="subtitle">
          Buka bukunya di panel ini, lalu pilih Hal 1-10 di bawah agar teks dan audio sesuai dengan halaman yang sedang
          kamu baca.
        </p>
      </section>

      <section className="card heyzine-stage">
        <div className="heyzine-frame">
          <iframe
            allow="clipboard-write"
            allowFullScreen
            className="heyzine-iframe"
            scrolling="no"
            src={HEYZINE_EMBED_URL}
            title="Flipbook ARKANUH"
          />
        </div>
        <div className="reader-story-inline">
          <div className="reader-story-head">
            <div className="reader-story-titleblock">
              <p className="eyebrow">Cerita Halaman {activePage.id}</p>
              <h2>{activePage.title}</h2>
            </div>
            <p className="reader-story-objective">{activePage.objective}</p>
          </div>
          <div className="reader-story-copy">
            {activePage.narration.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <VoiceNarration
          title={activePage.title}
          text={activePage.narration}
          audioSrc={activeVoice?.src}
          nextAudioSrc={nextVoice?.src}
          showText={false}
          variant="compact"
        />
      </section>

      <section className="card page-selector-card">
        <div className="progress-top-row">
          <div>
            <p className="eyebrow">Pilih Halaman</p>
            <h2>Hal {activePage.id}</h2>
          </div>
          <strong>
            {session.flipbook.completedPages.length}/{totalFlipbookPages}
          </strong>
        </div>
        <div className="page-selector" role="tablist" aria-label="Pilih halaman cerita">
          {flipbookPages.map((page) => {
            const isActive = page.id === activePage.id;
            const isCompleted = session.flipbook.completedPages.includes(page.id);

            return (
              <button
                key={page.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`page-chip ${isActive ? "is-active" : ""} ${isCompleted ? "is-complete" : ""}`.trim()}
                onClick={() => onSelectPage(page.id)}
              >
                {page.pageTexture ? <img src={page.pageTexture} alt="" className="page-chip-thumb" /> : null}
                <span className="page-chip-meta">Hal {page.id}</span>
                <strong className="page-chip-label">{page.title}</strong>
              </button>
            );
          })}
        </div>
      </section>

      <InlineModelViewer
        title={activePage.title}
        modelSrc={activePage.id ? `${import.meta.env.BASE_URL}assets/models/page-${activePage.id.padStart(2, "0")}.glb` : undefined}
        posterSrc={activePage.pageTexture}
        assetPageUrl={activePage.asset3dUrl}
      />

      <ProgressTracker
        completedPages={session.flipbook.completedPages}
        currentPageId={activePage.id}
        totalPages={totalFlipbookPages}
      />

      <section className="card story-actions">
        <div className="button-row">
          <a
            href={HEYZINE_EMBED_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline inline-btn-link"
          >
            Buka Buku di Tab Baru
          </a>
          <Link to="/menu" className="btn btn-outline inline-btn-link">
            Kembali ke Menu
          </Link>
          <button type="button" className="btn btn-outline" onClick={onRestart}>
            Sesi Baru
          </button>
        </div>
        {session.flipbook.completed ? (
          <>
            <p className="muted">Semua halaman sudah dibaca. Kamu bisa lanjut ke posttest.</p>
            <Link to="/posttest" className="btn btn-primary inline-btn-link">
              Lanjut ke Posttest
            </Link>
          </>
        ) : (
          <p className="muted">Baca semua 10 halaman agar menu Posttest terbuka.</p>
        )}
      </section>
    </main>
  );
}
