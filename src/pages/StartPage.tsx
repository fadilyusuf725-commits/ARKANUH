import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { ProgressTracker } from "../components/ProgressTracker";
import { StoryModelViewer } from "../components/StoryModelViewer";
import { VoiceNarration } from "../components/VoiceNarration";
import { flipbookPageMap, flipbookPages, getFirstIncompleteFlipbookPageId, totalFlipbookPages } from "../data/flipbookPages";
import { loadModelManifest, ModelManifestEntry } from "../data/modelManifest";
import { getVoiceAssetByPageId } from "../data/voiceManifest";
import { useSessionContext } from "../state/SessionContext";

type ViewerMode = "heyzine" | "3d";

const HEYZINE_VIEWER_URL = "https://heyzine.com/flip-book/88f0fa4179.html";

function clampStoryPageId(pageId: string | null, fallbackPageId: string): string {
  if (pageId && flipbookPageMap.has(pageId)) {
    return pageId;
  }
  return fallbackPageId;
}

function clampViewerMode(mode: string | null): ViewerMode {
  return mode === "3d" ? "3d" : "heyzine";
}

export function StartPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { session, markFlipbookPageCompleted, restartSession } = useSessionContext();
  const [modelManifest, setModelManifest] = useState<Map<string, ModelManifestEntry>>(new Map());

  const fallbackPageId = useMemo(
    () => getFirstIncompleteFlipbookPageId(session.flipbook.completedPages),
    [session.flipbook.completedPages]
  );
  const activePageId = clampStoryPageId(searchParams.get("page"), fallbackPageId);
  const viewerMode = clampViewerMode(searchParams.get("viewer"));
  const activePage = flipbookPageMap.get(activePageId) ?? flipbookPages[0];
  const activeIndex = Math.max(
    0,
    flipbookPages.findIndex((page) => page.id === activePage.id)
  );
  const nextPage = flipbookPages[activeIndex + 1];
  const prevPage = flipbookPages[activeIndex - 1];
  const activeVoice = getVoiceAssetByPageId(activePage.id);
  const nextVoice = nextPage ? getVoiceAssetByPageId(nextPage.id) : undefined;
  const modelEntry = modelManifest.get(activePage.id);
  const heyzinePageUrl = `${HEYZINE_VIEWER_URL}#page/${activePage.id}`;

  useEffect(() => {
    let mounted = true;
    loadModelManifest().then((manifest) => {
      if (mounted) {
        setModelManifest(manifest);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const requested = searchParams.get("page");
    const requestedViewer = searchParams.get("viewer");
    if (requested === activePageId && requestedViewer === viewerMode) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", activePageId);
    nextParams.set("viewer", viewerMode);
    setSearchParams(nextParams, { replace: true });
  }, [activePageId, searchParams, setSearchParams, viewerMode]);

  useEffect(() => {
    if (!session.pretest.completed) {
      return;
    }
    markFlipbookPageCompleted(activePage.id, totalFlipbookPages);
  }, [activePage.id, markFlipbookPageCompleted, session.pretest.completed]);

  if (!session.pretest.completed) {
    return <Navigate to="/pretest" replace />;
  }

  const goToPage = (pageId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", pageId);
    setSearchParams(nextParams, { replace: true });
  };

  const onNextPage = () => {
    if (!nextPage) {
      return;
    }
    goToPage(nextPage.id);
  };

  const onPrevPage = () => {
    if (!prevPage) {
      return;
    }
    goToPage(prevPage.id);
  };

  const onRestart = () => {
    restartSession(session.profile.nickname);
  };

  const setViewerMode = (mode: ViewerMode) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", activePage.id);
    nextParams.set("viewer", mode);
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <main className="page-shell reader-page">
      <section className="hero-card reader-focus-hero">
        <p className="eyebrow">Mulai Membaca</p>
        <h1>Flipbook 3D ARKANUH</h1>
        <p className="subtitle">Pilih mode viewer, lalu lanjutkan sampai halaman 10 untuk membuka posttest.</p>
      </section>

      <section className="reader-stage">
        <div className="viewer-mode-switch-wrap">
          <div className="viewer-mode-switch" role="tablist" aria-label="Pilih mode viewer">
            <button
              type="button"
              className={`mode-chip ${viewerMode === "heyzine" ? "is-active" : ""}`}
              onClick={() => setViewerMode("heyzine")}
              role="tab"
              aria-selected={viewerMode === "heyzine"}
            >
              Heyzine
            </button>
            <button
              type="button"
              className={`mode-chip ${viewerMode === "3d" ? "is-active" : ""}`}
              onClick={() => setViewerMode("3d")}
              role="tab"
              aria-selected={viewerMode === "3d"}
            >
              Viewer 3D
            </button>
          </div>
        </div>

        {viewerMode === "heyzine" ? (
          <section className="card story-model-card">
            <div className="story-model-topbar">
              <p className="eyebrow">Heyzine Halaman {activePage.id}</p>
              <div className="button-row story-model-nav">
                <button type="button" className="btn btn-outline" onClick={onPrevPage} disabled={!prevPage}>
                  Sebelumnya
                </button>
                <button type="button" className="btn btn-outline" onClick={onNextPage} disabled={!nextPage}>
                  Berikutnya
                </button>
                <a href={heyzinePageUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline inline-btn-link">
                  Buka Tab Baru
                </a>
              </div>
            </div>
            <div className="story-model-stage">
              <iframe
                className="reader-embed-frame"
                src={heyzinePageUrl}
                title={`Heyzine halaman ${activePage.id}`}
                loading="lazy"
                allowFullScreen
              />
            </div>
            <p className="muted story-model-help">
              Geser halaman di Heyzine, lalu pakai tombol Sebelumnya/Berikutnya agar progres pembelajaran sinkron.
            </p>
          </section>
        ) : (
          <StoryModelViewer
            pageId={activePage.id}
            title={activePage.title}
            modelEntry={modelEntry}
            onPrev={onPrevPage}
            onNext={onNextPage}
            canPrev={Boolean(prevPage)}
            canNext={Boolean(nextPage)}
          />
        )}

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

      <ProgressTracker
        completedPages={session.flipbook.completedPages}
        currentPageId={activePage.id}
        totalPages={totalFlipbookPages}
      />

      <section className="card story-actions">
        <div className="button-row">
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
