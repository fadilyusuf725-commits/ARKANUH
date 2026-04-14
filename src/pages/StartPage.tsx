import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { ProgressTracker } from "../components/ProgressTracker";
import { VoiceNarration } from "../components/VoiceNarration";
import { flipbookPageMap, flipbookPages, getFirstIncompleteFlipbookPageId, totalFlipbookPages } from "../data/flipbookPages";
import { loadModelManifest, ModelManifestEntry } from "../data/modelManifest";
import { getVoiceAssetByPageId } from "../data/voiceManifest";
import { useSessionContext } from "../state/SessionContext";

const StoryModelViewer = lazy(() =>
  import("../components/StoryModelViewer").then((module) => ({ default: module.StoryModelViewer }))
);

type ViewerPreference = "heyzine" | "3d";
type ReaderBookState = "loading" | "ready" | "fallback";

const HEYZINE_VIEWER_URL = "https://heyzine.com/flip-book/88f0fa4179.html";
const HEYZINE_THUMBNAIL_URL = "https://cdnc.heyzine.com/files/uploaded/v3/88f0fa4179926a6389bd059154cfb01e027df725-2.pdf-thumb.jpg";

function clampStoryPageId(pageId: string | null, fallbackPageId: string): string {
  if (pageId && flipbookPageMap.has(pageId)) {
    return pageId;
  }
  return fallbackPageId;
}

function clampViewerPreference(mode: string | null): ViewerPreference {
  return mode === "3d" ? "3d" : "heyzine";
}

function StoryModelFallback() {
  return (
    <section className="card story-model-card story-model-card-3d">
      <div className="story-model-topbar">
        <div className="story-model-heading">
          <p className="eyebrow">Viewer 3D</p>
          <h2>Menyiapkan panggung 3D...</h2>
        </div>
      </div>
      <div className="story-model-stage story-model-stage-3d">
        <div className="story-model-placeholder" role="status">
          <strong>Viewer 3D sedang dimuat</strong>
          <p>Kanvas akan aktif sesaat lagi begitu komponen selesai disiapkan.</p>
        </div>
      </div>
    </section>
  );
}

export function StartPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { session, markFlipbookPageCompleted, restartSession } = useSessionContext();
  const [modelManifest, setModelManifest] = useState<Map<string, ModelManifestEntry>>(new Map());
  const [readerBookState, setReaderBookState] = useState<ReaderBookState>("loading");

  const fallbackPageId = useMemo(
    () => getFirstIncompleteFlipbookPageId(session.flipbook.completedPages),
    [session.flipbook.completedPages]
  );
  const activePageId = clampStoryPageId(searchParams.get("page"), fallbackPageId);
  const viewerPreference = clampViewerPreference(searchParams.get("viewer"));
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
  const nextModelEntry = nextPage ? modelManifest.get(nextPage.id) : undefined;
  const heyzinePageUrl = `${HEYZINE_VIEWER_URL}#page/${activePage.id}`;
  const completionPercentage = Math.round((session.flipbook.completedPages.length / totalFlipbookPages) * 100);

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
    if (requested === activePageId && requestedViewer === viewerPreference) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", activePageId);
    nextParams.set("viewer", viewerPreference);
    setSearchParams(nextParams, { replace: true });
  }, [activePageId, searchParams, setSearchParams, viewerPreference]);

  useEffect(() => {
    if (!session.pretest.completed) {
      return;
    }
    markFlipbookPageCompleted(activePage.id, totalFlipbookPages);
  }, [activePage.id, markFlipbookPageCompleted, session.pretest.completed]);

  useEffect(() => {
    setReaderBookState("loading");

    const timeoutId = window.setTimeout(() => {
      setReaderBookState((value) => (value === "loading" ? "fallback" : value));
    }, 7000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [heyzinePageUrl]);

  useEffect(() => {
    const nextModelSrc = nextModelEntry?.status === "ready" ? nextModelEntry.src : undefined;
    if (!nextModelSrc) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      void fetch(nextModelSrc, { cache: "force-cache", signal: controller.signal }).catch(() => undefined);
    }, 450);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [nextModelEntry?.src, nextModelEntry?.status]);

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

  const setViewerPreference = (preference: ViewerPreference) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", activePage.id);
    nextParams.set("viewer", preference);
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <main className="page-shell reader-page">
      <section className="hero-card reader-focus-hero">
        <div className="reader-hero-copy">
          <p className="eyebrow">Mulai Membaca</p>
          <h1>Flipbook 3D ARKANUH</h1>
          <p className="subtitle">
            Buku kembali menjadi panel utama agar lebih lega dibaca, sementara viewer 3D tetap menemani di sisi yang
            sama. Halaman aktif akan menyinkronkan buku, model, narasi, audio, dan progres belajarmu.
          </p>
        </div>
        <div className="reader-hero-meta">
          <span className="reader-hero-pill">Halaman {activePage.id}/{totalFlipbookPages}</span>
          <span className="reader-hero-pill">{completionPercentage}% progres</span>
          <span className="reader-hero-pill">Buku utama aktif</span>
        </div>
      </section>

      <section className={`reader-stage reader-stage-combined ${viewerPreference === "heyzine" ? "is-book-focus" : "is-model-focus"}`}>
        <div className="reader-stage-toolbar">
          <div className="reader-stage-heading">
            <p className="eyebrow">Halaman Aktif</p>
            <h2>{activePage.title}</h2>
            <p className="muted">Gunakan fokus panel untuk menonjolkan area yang ingin kamu lihat lebih dulu.</p>
          </div>

          <div className="viewer-mode-switch-wrap">
            <div className="viewer-mode-switch" role="tablist" aria-label="Pilih fokus panel pembelajaran">
              <button
                type="button"
                className={`mode-chip ${viewerPreference === "heyzine" ? "is-active" : ""}`}
                onClick={() => setViewerPreference("heyzine")}
                role="tab"
                aria-selected={viewerPreference === "heyzine"}
              >
                Sorot Buku
              </button>
              <button
                type="button"
                className={`mode-chip ${viewerPreference === "3d" ? "is-active" : ""}`}
                onClick={() => setViewerPreference("3d")}
                role="tab"
                aria-selected={viewerPreference === "3d"}
              >
                Sorot 3D
              </button>
            </div>
          </div>
        </div>

        <div className="reader-canvas">
          <section className="reader-primary-grid">
            <section className={`card reader-book-card reader-book-card-primary ${viewerPreference === "heyzine" ? "is-preferred" : ""}`}>
              <div className="reader-book-topbar">
                <div>
                  <p className="eyebrow">Flipbook Heyzine</p>
                  <h3>Halaman {activePage.id}</h3>
                </div>
                <a href={heyzinePageUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline inline-btn-link">
                  Buka Tab Baru
                </a>
              </div>

              <div className="reader-book-stage reader-book-stage-primary">
                <iframe
                  key={activePage.id}
                  className="reader-book-frame"
                  src={heyzinePageUrl}
                  title={`Heyzine halaman ${activePage.id}`}
                  loading="eager"
                  allow="clipboard-write"
                  scrolling="no"
                  allowFullScreen
                  onLoad={() => setReaderBookState("ready")}
                  onError={() => setReaderBookState("fallback")}
                />

                {readerBookState === "loading" ? (
                  <div className="reader-book-overlay" role="status">
                    <strong>Menyiapkan flipbook...</strong>
                    <p>Panel buku sedang dibuka sebagai area baca utama.</p>
                  </div>
                ) : null}

                {readerBookState === "fallback" ? (
                  <div className="reader-book-fallback" role="status">
                    <img src={HEYZINE_THUMBNAIL_URL} alt="Pratinjau sampul flipbook Cerita Nabi Nuh" />
                    <div className="reader-book-fallback-copy">
                      <strong>Embed buku belum stabil di browser ini</strong>
                      <p>
                        Beberapa browser kadang membatasi iframe dari localhost. Flipbook tetap bisa dibuka penuh di
                        tab baru tanpa mengganggu sinkronisasi halaman.
                      </p>
                      <a href={heyzinePageUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary inline-btn-link">
                        Buka Flipbook Penuh
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>

              <p className="muted reader-book-note">
                Buku ini mengikuti halaman aktif dan sekarang menjadi area baca utama. Viewer 3D tetap sinkron sebagai
                pendamping visual di sisi kanan.
              </p>
            </section>

            <Suspense fallback={<StoryModelFallback />}>
              <StoryModelViewer
                pageId={activePage.id}
                title={activePage.title}
                modelEntry={modelEntry}
                onPrev={onPrevPage}
                onNext={onNextPage}
                canPrev={Boolean(prevPage)}
                canNext={Boolean(nextPage)}
                isPreferred={viewerPreference === "3d"}
              />
            </Suspense>
          </section>

          <section className="reader-support-stack">
            <section className="card reader-story-inline reader-story-inline-wide">
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
            </section>

            <VoiceNarration
              title={activePage.title}
              text={activePage.narration}
              audioSrc={activeVoice?.src}
              fallbackAudioSrc={activeVoice?.fallbackSrc}
              nextAudioSrc={nextVoice?.src}
              nextFallbackAudioSrc={nextVoice?.fallbackSrc}
              showText={false}
              variant="compact"
            />

            <div className="card reader-mode-note reader-mode-note-card">
              <p className="muted">
                Sorot Buku untuk menegaskan area baca utama. Sorot 3D untuk memberi aksen pada model tanpa memisahkan
                keduanya dari kanvas yang sama.
              </p>
            </div>
          </section>
        </div>
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
