import { Navigate, useNavigate } from "react-router-dom";
import { AssessmentFlow } from "../components/AssessmentFlow";
import { getFirstIncompleteFlipbookPageId } from "../data/flipbookPages";
import { posttestQuestions } from "../data/posttestQuestions";
import { useSessionContext } from "../state/SessionContext";

export function PosttestPage() {
  const navigate = useNavigate();
  const { session } = useSessionContext();

  if (!session.pretest.completed) {
    return <Navigate to="/pretest" replace />;
  }

  if (!session.flipbook.completed) {
    return <Navigate to={`/mulai?page=${getFirstIncompleteFlipbookPageId(session.flipbook.completedPages)}`} replace />;
  }

  if (session.posttest.completed) {
    return <Navigate to="/hasil-akhir" replace />;
  }

  return (
    <AssessmentFlow
      phase="posttest"
      title="Posttest Cerita Nabi Nuh"
      intro="Sekarang cek kembali pemahamanmu setelah menuntaskan seluruh cerita dan narasinya."
      questions={posttestQuestions}
      submitLabel="Selesai Posttest"
      onSubmitted={() => navigate("/hasil-akhir")}
    />
  );
}
