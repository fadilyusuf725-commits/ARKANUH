import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ProgressTracker } from "../components/ProgressTracker";
import { UnityFlipbookCanvas } from "../components/UnityFlipbookCanvas";
import { VoiceNarration } from "../components/VoiceNarration";
import { flipbookPageMap, flipbookPages, totalFlipbookPages } from "../data/flipbookPages";
import { getVoiceAssetByPageId } from "../data/voiceManifest";
import { useSessionContext } from "../state/SessionContext";

export function FlipbookReaderPage() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { session, markFlipbookPageCompleted } = useSessionContext();
  const [isFinalClosing, setIsFinalClosing] = useState(false);

  useEffect(() => {
    setIsFinalClosing(false);
  }, [pageId]);

  if (!session.pretest.completed) {
    return <Navigate to="/pretest" replace />;
  }

  if (!pageId) {
    return <Navigate to="/404" replace />;
  }

  const page = flipbookPageMap.get(pageId);
  if (!page) {
    return <Navigate to="/404" replace />;
  }

  const currentIndex = flipbookPages.findIndex((item) => item.id === page.id);
  if (currentIndex < 0) {
    return <Navigate to="/404" replace />;
  }

  const firstIncompleteIndex = flipbookPages.findIndex((item) => !session.flipbook.completedPages.includes(item.id));
  const firstIncompleteId = firstIncompleteIndex >= 0 ? flipbookPages[firstIncompleteIndex].id : null;

  if (firstIncompleteId && Number(pageId) > Number(firstIncompleteId)) {
    return <Navigate to={`/flipbook/${firstIncompleteId}`} replace />;
  }

  const canGoPrev = currentIndex > 0;
  const canGoNext = true;
  const isLastPage = currentIndex === totalFlipbookPages - 1;
  const nextPage = currentIndex < totalFlipbookPages - 1 ? flipbookPages[currentIndex + 1] : undefined;
  const voiceAsset = getVoiceAssetByPageId(page.id);
  const nextVoiceAsset = nextPage ? getVoiceAssetByPageId(nextPage.id) : undefined;

  useEffect(() => {
    if (isLastPage) {
      return;
    }
    markFlipbookPageCompleted(page.id, totalFlipbookPages);
  }, [isLastPage, markFlipbookPageCompleted, page.id]);

  const goToIndex = (nextIndex: number) => {
    const targetPage = flipbookPages[nextIndex];
    if (!targetPage || nextIndex < 0 || nextIndex >= totalFlipbookPages) {
      return;
    }

    navigate(`/flipbook/${targetPage.id}`);
  };

  const goPrev = () => {
    if (!canGoPrev) {
      return;
    }
    goToIndex(currentIndex - 1);
  };

  const goNext = () => {
    if (!canGoNext || isFinalClosing) {
      return;
    }

    markFlipbookPageCompleted(page.id, totalFlipbookPages);

    if (isLastPage) {
      setIsFinalClosing(true);
      return;
    }

    goToIndex(currentIndex + 1);
  };

  return (
    <main className="page-shell">
      <section className="hero-card reader-focus-hero">
        <p className="eyebrow">Buku Cerita 3D</p>
        <h1>
          Halaman {currentIndex + 1}: {page.title}
        </h1>
        <p className="subtitle">{page.narration}</p>
      </section>

      <UnityFlipbookCanvas
        page={page}
        currentIndex={currentIndex}
        totalPages={totalFlipbookPages}
        canAdvance={canGoNext}
        triggerFinalClose={isFinalClosing}
        onRequestNext={goNext}
        onRequestPrev={goPrev}
        onFinalCloseComplete={() => navigate("/posttest", { replace: true })}
      />

      <ProgressTracker
        completedPages={session.flipbook.completedPages}
        currentPageId={page.id}
        totalPages={totalFlipbookPages}
      />

      <VoiceNarration
        text={page.narration}
        title={page.title}
        audioSrc={voiceAsset?.src ?? page.voAudio}
        nextAudioSrc={nextVoiceAsset?.src ?? nextPage?.voAudio}
      />

      <section className="card sticky-action">
        <div className="button-row">
          <button type="button" className="btn btn-outline" onClick={goPrev} disabled={!canGoPrev || isFinalClosing}>
            Sebelumnya
          </button>
          <button type="button" className="btn btn-primary" onClick={goNext} disabled={!canGoNext || isFinalClosing}>
            {isFinalClosing ? "Menutup Buku..." : isLastPage ? "Tutup Buku & Posttest" : "Berikutnya"}
          </button>
        </div>
      </section>
    </main>
  );
}
