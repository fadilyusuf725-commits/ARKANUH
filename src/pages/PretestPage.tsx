import { useNavigate } from "react-router-dom";
import { AssessmentFlow } from "../components/AssessmentFlow";
import { getFirstIncompleteFlipbookPageId } from "../data/flipbookPages";
import { pretestQuestions } from "../data/pretestQuestions";
import { useSessionContext } from "../state/SessionContext";

export function PretestPage() {
  const navigate = useNavigate();
  const { session } = useSessionContext();

  return (
    <AssessmentFlow
      phase="pretest"
      title="Pretest Cerita Nabi Nuh"
      intro="Jawab semua soal singkat ini untuk melihat pengetahuan awal sebelum mulai membaca."
      questions={pretestQuestions}
      submitLabel="Selesai Pretest"
      onSubmitted={() => {
        window.setTimeout(() => {
          navigate(`/mulai?page=${getFirstIncompleteFlipbookPageId(session.flipbook.completedPages)}`);
        }, 300);
      }}
      completedScreen={{
        eyebrow: "Pretest Selesai",
        getTitle: (score) => `Skor Pretest: ${score ?? 0}/10`,
        description: "Pretest tidak perlu diulang pada sesi yang sama. Lanjutkan ke cerita untuk membuka pengalaman belajar utama.",
        actions: (
          <div className="button-row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate(`/mulai?page=${getFirstIncompleteFlipbookPageId(session.flipbook.completedPages)}`)}
            >
              Mulai Baca Cerita
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/menu")}>
              Kembali ke Menu
            </button>
          </div>
        )
      }}
    />
  );
}
