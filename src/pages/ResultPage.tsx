import { Navigate, useNavigate } from "react-router-dom";
import { quizQuestions } from "../data/quizQuestions";
import { useSessionContext } from "../state/SessionContext";

function feedbackByScore(score: number, total: number): string {
  const percentage = (score / total) * 100;
  if (percentage >= 90) {
    return "Luar biasa. Kamu sangat memahami kisah dan teladan Nabi Nuh.";
  }
  if (percentage >= 75) {
    return "Bagus sekali. Kamu sudah memahami inti kisah Nabi Nuh.";
  }
  if (percentage >= 60) {
    return "Kerja baik. Ulangi beberapa halaman agar pemahamanmu makin kuat.";
  }
  return "Semangat. Coba ulangi cerita dan dengarkan narasi sekali lagi.";
}

export function ResultPage() {
  const navigate = useNavigate();
  const { session, history, clearQuizResult, restartSession } = useSessionContext();

  if (session.quizScore === null) {
    return <Navigate to="/kuis" replace />;
  }

  const total = quizQuestions.length;
  const score = session.quizScore;
  const percentage = Math.round((score / total) * 100);
  const feedback = feedbackByScore(score, total);

  const latestSessions = history.slice(0, 5);

  const retryQuiz = () => {
    clearQuizResult();
    navigate("/kuis");
  };

  const startNewSession = () => {
    restartSession(session.nickname);
    navigate("/buku/1");
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Hasil Belajar</p>
        <h1>Selamat, {session.nickname}</h1>
        <p className="subtitle">
          Skor: {score}/{total} ({percentage}%)
        </p>
        <p>{feedback}</p>
      </section>

      <section className="card">
        <h2>Ringkasan Sesi</h2>
        <ul>
          <li>ID sesi: {session.sessionId}</li>
          <li>Halaman cerita selesai: {session.completedPages.length}/10</li>
          <li>Waktu mulai: {new Date(session.startedAt).toLocaleString("id-ID")}</li>
          <li>Waktu submit kuis: {session.finalizedAt ? new Date(session.finalizedAt).toLocaleString("id-ID") : "-"}</li>
        </ul>
      </section>

      <section className="card">
        <h2>Riwayat Sesi Terbaru (Lokal)</h2>
        {latestSessions.length === 0 && <p>Belum ada riwayat.</p>}
        {latestSessions.length > 0 && (
          <ol>
            {latestSessions.map((item) => (
              <li key={item.sessionId}>
                {new Date(item.startedAt).toLocaleDateString("id-ID")} • {item.nickname} • skor {item.quizScore ?? 0}/
                {total}
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="card">
        <div className="button-row">
          <button type="button" className="btn btn-outline" onClick={retryQuiz}>
            Ulangi Kuis
          </button>
          <button type="button" className="btn btn-primary" onClick={startNewSession}>
            Mulai Sesi Baru
          </button>
        </div>
      </section>
    </main>
  );
}
