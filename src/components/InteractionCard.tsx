import { useEffect, useMemo, useRef, useState } from "react";
import { FlipbookPage } from "../types/domain";

type InteractionCardProps = {
  page: FlipbookPage;
  isCompleted: boolean;
  onComplete: () => void;
};

export function InteractionCard({ page, isCompleted, onComplete }: InteractionCardProps) {
  const [tapDone, setTapDone] = useState(false);
  const [placedItems, setPlacedItems] = useState<string[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [choiceMessage, setChoiceMessage] = useState("");
  const notifiedRef = useRef(false);

  useEffect(() => {
    setTapDone(false);
    setPlacedItems([]);
    setSelectedChoice(null);
    setChoiceMessage("");
    notifiedRef.current = false;
  }, [page.id]);

  const dragItems = useMemo(() => page.interactionItems ?? ["Kayu", "Tali", "Paku"], [page.interactionItems]);
  const isDragComplete = dragItems.every((item) => placedItems.includes(item));
  const isChoiceComplete = selectedChoice !== null && selectedChoice === page.correctChoiceIndex;
  const completed = isCompleted || tapDone || isDragComplete || isChoiceComplete;

  useEffect(() => {
    if (completed && !notifiedRef.current) {
      onComplete();
      notifiedRef.current = true;
    }
  }, [completed, onComplete]);

  const placeItem = (item: string) => {
    setPlacedItems((prev) => (prev.includes(item) ? prev : [...prev, item]));
  };

  const chooseOption = (index: number) => {
    setSelectedChoice(index);
    if (page.correctChoiceIndex === index) {
      setChoiceMessage("Pilihan tepat. Kerja bagus!");
      return;
    }
    setChoiceMessage("Jawaban belum tepat. Coba lagi ya.");
  };

  return (
    <section className="card">
      <p className="eyebrow">Aktivitas Interaktif</p>
      <h3>{page.interactionPrompt}</h3>
      <p className="muted">Aturan selesai: {page.completionRule}</p>

      {page.interactionType === "tap" && (
        <button type="button" className="btn btn-primary" onClick={() => setTapDone(true)} disabled={completed}>
          Ketuk Objek Pop-up
        </button>
      )}

      {page.interactionType === "drag" && (
        <div className="drag-grid">
          <div>
            <p className="muted">Bagian yang perlu dipindahkan:</p>
            <div className="chip-row">
              {dragItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="chip-button"
                  disabled={placedItems.includes(item) || completed}
                  onClick={() => placeItem(item)}
                >
                  {placedItems.includes(item) ? `[OK] ${item}` : `Pindahkan ${item}`}
                </button>
              ))}
            </div>
          </div>
          <div className="drop-zone">
            <p className="muted">Bahtera:</p>
            <div className="chip-row">
              {placedItems.length === 0 && <span className="chip chip-empty">Belum ada bagian</span>}
              {placedItems.map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {page.interactionType === "choice" && (
        <div className="choice-list">
          {(page.interactionChoices ?? []).map((option, index) => (
            <button
              key={option}
              type="button"
              className={`choice-button ${selectedChoice === index ? "is-selected" : ""}`}
              onClick={() => chooseOption(index)}
              disabled={completed}
            >
              {option}
            </button>
          ))}
          {choiceMessage && <p className="muted">{choiceMessage}</p>}
        </div>
      )}

      <p className={`completion-note ${completed ? "is-done" : ""}`}>
        {completed ? "Aktivitas selesai. Lanjut ke halaman berikutnya." : "Selesaikan aktivitas dulu untuk membuka tombol Lanjut."}
      </p>
    </section>
  );
}
