import { TouchEvent, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArMarkerView } from "../components/ArMarkerView";
import { InteractionCard } from "../components/InteractionCard";
import { ProgressTracker } from "../components/ProgressTracker";
import { VoiceNarration } from "../components/VoiceNarration";
import {
  flipbookPageMap,
  flipbookPages,
  getNextFlipbookPageId,
  getPrevFlipbookPageId,
  totalFlipbookPages
} from "../data/flipbookPages";
import { useSessionContext } from "../state/SessionContext";

const SWIPE_THRESHOLD = 45;

export function FlipbookReaderPage() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const touchStartX = useRef<number | null>(null);
  const { session, markFlipbookPageCompleted } = useSessionContext();
  const [interactionComplete, setInteractionComplete] = useState(false);

  const page = pageId ? flipbookPageMap.get(pageId) : undefined;
  const firstIncomplete = flipbookPages.find((item) => !session.flipbook.completedPages.includes(item.id));

  useEffect(() => {
    if (!page) {
      setInteractionComplete(false);
      return;
    }
    setInteractionComplete(session.flipbook.completedPages.includes(page.id));
  }, [page, session.flipbook.completedPages]);

  const nextPageId = useMemo(() => (page ? getNextFlipbookPageId(page.id) : null), [page]);
  const prevPageId = useMemo(() => (page ? getPrevFlipbookPageId(page.id) : null), [page]);
  const isLastPage = page ? page.id === String(totalFlipbookPages) : false;
  const canGoNext = interactionComplete;
  const canGoPrev = Boolean(prevPageId);

  const goNext = () => {
    if (!page || !canGoNext) {
      return;
    }

    markFlipbookPageCompleted(page.id, totalFlipbookPages);

    if (isLastPage) {
      navigate("/posttest");
      return;
    }

    if (nextPageId) {
      navigate(`/flipbook/${nextPageId}`);
    }
  };

  const goPrev = () => {
    if (!prevPageId) {
      return;
    }
    navigate(`/flipbook/${prevPageId}`);
  };

  const onTouchStart = (event: TouchEvent<HTMLElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null) {
      return;
    }

    const endX = event.changedTouches[0]?.clientX;
    if (typeof endX !== "number") {
      touchStartX.current = null;
      return;
    }

    const distance = touchStartX.current - endX;
    touchStartX.current = null;

    if (Math.abs(distance) < SWIPE_THRESHOLD) {
      return;
    }

    if (distance > 0) {
      goNext();
      return;
    }

    goPrev();
  };

  if (!session.pretest.completed) {
    return <Navigate to="/pretest" replace />;
  }

  if (!pageId || !page) {
    return <Navigate to="/404" replace />;
  }

  if (firstIncomplete && Number(pageId) > Number(firstIncomplete.id)) {
    return <Navigate to={`/flipbook/${firstIncomplete.id}`} replace />;
  }

  return (
    <main className="page-shell" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <section className="story-header card">
        <p className="eyebrow">Flipbook Halaman {page.id} dari 10</p>
        <h1>{page.title}</h1>
        <p className="subtitle">{page.objective}</p>
        <p className="muted">Geser layar kanan/kiri atau gunakan tombol navigasi di bawah.</p>
      </section>

      <ProgressTracker
        completedPages={session.flipbook.completedPages}
        currentPageId={page.id}
        totalPages={totalFlipbookPages}
      />
      <ArMarkerView page={page} />
      <VoiceNarration text={page.narration} title={page.title} />
      <InteractionCard page={page} isCompleted={interactionComplete} onComplete={() => setInteractionComplete(true)} />

      <section className="card sticky-action">
        <div className="button-row">
          <button type="button" className="btn btn-outline" onClick={goPrev} disabled={!canGoPrev}>
            Sebelumnya
          </button>
          <button type="button" className="btn btn-primary" onClick={goNext} disabled={!canGoNext}>
            {isLastPage ? "Lanjut Posttest" : "Berikutnya"}
          </button>
        </div>
      </section>
    </main>
  );
}
