import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { BookSceneCanvas } from "../components/BookSceneCanvas";
import { FloatingSideText } from "../components/FloatingSideText";
import { InteractionCard } from "../components/InteractionCard";
import { ProgressTracker } from "../components/ProgressTracker";
import { VoiceNarration } from "../components/VoiceNarration";
import { flipbookPageMap, flipbookPages, totalFlipbookPages } from "../data/flipbookPages";
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

  const firstIncomplete = flipbookPages.find((item) => !session.flipbook.completedPages.includes(item.id));
  if (firstIncomplete && Number(pageId) > Number(firstIncomplete.id)) {
    return <Navigate to={`/flipbook/${firstIncomplete.id}`} replace />;
  }

  const interactionComplete = session.flipbook.completedPages.includes(page.id);
  const canGoPrev = currentIndex > 0;
  const canGoNext = interactionComplete;
  const isLastPage = currentIndex === totalFlipbookPages - 1;
  const nextPage = currentIndex < totalFlipbookPages - 1 ? flipbookPages[currentIndex + 1] : undefined;

  const goToIndex = (nextIndex: number) => {
    const targetPage = flipbookPages[nextIndex];
    if (!targetPage) {
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

  return (
    <main className="page-shell">
      <section className="story-header card">
        <p className="eyebrow">Flipbook Halaman {page.id} dari 10</p>
        <h1>{page.title}</h1>
        <p className="subtitle">{page.objective}</p>
      </section>

      <ProgressTracker
        completedPages={session.flipbook.completedPages}
        currentPageId={page.id}
        totalPages={totalFlipbookPages}
      />

      <section className="flipbook-layout">
        <div className="flipbook-main">
          <BookSceneCanvas
            page={page}
            currentIndex={currentIndex}
            totalPages={totalFlipbookPages}
            triggerFinalClose={isFinalClosing}
            onFinalCloseComplete={() => navigate("/posttest")}
          />
        </div>
        <FloatingSideText page={page} />
      </section>

      <VoiceNarration text={page.narration} title={page.title} audioSrc={page.voAudio} nextAudioSrc={nextPage?.voAudio} />
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
