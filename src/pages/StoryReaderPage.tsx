import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArMarkerView } from "../components/ArMarkerView";
import { InteractionCard } from "../components/InteractionCard";
import { ProgressTracker } from "../components/ProgressTracker";
import { VoiceNarration } from "../components/VoiceNarration";
import { getNextPageId, storyPageMap, storyPages, totalStoryPages } from "../data/storyPages";
import { useSessionContext } from "../state/SessionContext";

export function StoryReaderPage() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { session, markPageCompleted } = useSessionContext();
  const [interactionComplete, setInteractionComplete] = useState(false);

  const page = pageId ? storyPageMap.get(pageId) : undefined;

  useEffect(() => {
    if (!pageId || !page) {
      navigate("/404", { replace: true });
      return;
    }

    const firstIncomplete = storyPages.find((item) => !session.completedPages.includes(item.id));
    if (!firstIncomplete) {
      return;
    }
    if (Number(pageId) > Number(firstIncomplete.id)) {
      navigate(`/buku/${firstIncomplete.id}`, { replace: true });
    }
  }, [navigate, page, pageId, session.completedPages]);

  useEffect(() => {
    if (!page) {
      return;
    }
    setInteractionComplete(session.completedPages.includes(page.id));
  }, [page, session.completedPages]);

  const isLastPage = page ? page.id === String(totalStoryPages) : false;
  const nextPagePath = useMemo(() => {
    if (!page) {
      return null;
    }
    const nextId = getNextPageId(page.id);
    if (!nextId) {
      return "/kuis";
    }
    return `/buku/${nextId}`;
  }, [page]);

  if (!page || !pageId) {
    return null;
  }

  const onContinue = () => {
    markPageCompleted(page.id);
    if (isLastPage) {
      navigate("/kuis");
      return;
    }
    if (nextPagePath) {
      navigate(nextPagePath);
    }
  };

  return (
    <main className="page-shell">
      <section className="story-header card">
        <p className="eyebrow">Halaman {page.id} dari 10</p>
        <h1>{page.title}</h1>
        <p className="subtitle">{page.objective}</p>
      </section>

      <ProgressTracker completedPages={session.completedPages} currentPageId={page.id} totalPages={totalStoryPages} />
      <ArMarkerView page={page} />
      <VoiceNarration text={page.narration} title={page.title} />
      <InteractionCard page={page} isCompleted={interactionComplete} onComplete={() => setInteractionComplete(true)} />

      <section className="card sticky-action">
        <button type="button" className="btn btn-primary btn-full" onClick={onContinue} disabled={!interactionComplete}>
          {isLastPage ? "Selesai Cerita, Lanjut Kuis" : "Lanjut ke Halaman Berikutnya"}
        </button>
      </section>
    </main>
  );
}
