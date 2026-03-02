import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { InteractionCard } from "../components/InteractionCard";
import { PageTabRail } from "../components/PageTabRail";
import { PptStoryFrame } from "../components/PptStoryFrame";
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
  const maxReachableIndex = firstIncompleteIndex === -1 ? totalFlipbookPages - 1 : firstIncompleteIndex;
  const firstIncompleteId = firstIncompleteIndex >= 0 ? flipbookPages[firstIncompleteIndex].id : null;

  if (firstIncompleteId && Number(pageId) > Number(firstIncompleteId)) {
    return <Navigate to={`/flipbook/${firstIncompleteId}`} replace />;
  }

  const interactionComplete = session.flipbook.completedPages.includes(page.id);
  const canGoPrev = currentIndex > 0;
  const canGoNext = interactionComplete;
  const isLastPage = currentIndex === totalFlipbookPages - 1;
  const nextPage = currentIndex < totalFlipbookPages - 1 ? flipbookPages[currentIndex + 1] : undefined;
  const voiceAsset = getVoiceAssetByPageId(page.id);
  const nextVoiceAsset = nextPage ? getVoiceAssetByPageId(nextPage.id) : undefined;

  const goToIndex = (nextIndex: number) => {
    const targetPage = flipbookPages[nextIndex];
    if (!targetPage || nextIndex > maxReachableIndex) {
      return;
    }

    if (nextIndex > currentIndex && !canGoNext) {
      return;
    }

    if (nextIndex > currentIndex && canGoNext) {
      markFlipbookPageCompleted(page.id, totalFlipbookPages);
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

  const pageIds = useMemo(() => flipbookPages.map((item) => item.id), []);

  return (
    <main className="page-shell">
      <section className="ppt-flipbook-shell">
        <PageTabRail
          pageIds={pageIds}
          currentPageId={page.id}
          maxReachableIndex={maxReachableIndex}
          completedPages={session.flipbook.completedPages}
          onSelect={(targetId) => {
            const index = flipbookPages.findIndex((item) => item.id === targetId);
            if (index >= 0) {
              goToIndex(index);
            }
          }}
        />

        <div className="ppt-main-column">
          <PptStoryFrame page={page} />

          <UnityFlipbookCanvas
            page={page}
            currentIndex={currentIndex}
            totalPages={totalFlipbookPages}
            canAdvance={canGoNext}
            triggerFinalClose={isFinalClosing}
            onRequestNext={goNext}
            onRequestPrev={goPrev}
            onFinalCloseComplete={() => navigate("/posttest", { replace: true })}
            compact
          />
        </div>
      </section>

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

      <InteractionCard
        page={page}
        isCompleted={interactionComplete}
        onComplete={() => markFlipbookPageCompleted(page.id, totalFlipbookPages)}
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
