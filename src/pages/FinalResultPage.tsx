import { Navigate, useNavigate } from "react-router-dom";
import { useSessionContext } from "../state/SessionContext";

export function FinalResultPage() {
  const navigate = useNavigate();
  const { session, history, restartSession } = useSessionContext();

  if (!session.posttest.completed) {
    return <Navigate to="/posttest" replace />;
  }

  const pretestScore = session.pretest.score ?? 0;
  const posttestScore = session.posttest.score ?? 0;
  const deltaScore = session.report?.deltaScore ?? posttestScore - pretestScore;
  const summary = session.report?.summary ?? "Sesi selesai.";
  const latestHistory = history.slice(0, 5);

  const onNewSession = () => {
    restartSession(session.profile.nickname);
    navigate("/");
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Hasil Akhir</p>
        <h1>Ringkasan Belajar {session.profile.nickname}</h1>
        <p className="subtitle">{summary}</p>
      </section>

      <section className="card">
        <h2>Perbandingan Nilai</h2>
        <ul>
          <li>Skor Pretest: {pretestScore}/10</li>
          <li>Skor Posttest: {posttestScore}/10</li>
          <li>Selisih Peningkatan: {deltaScore >= 0 ? `+${deltaScore}` : deltaScore}</li>
        </ul>
      </section>

      <section className="card">
        <h2>Riwayat Sesi Terbaru</h2>
        {latestHistory.length === 0 && <p>Belum ada riwayat sesi.</p>}
        {latestHistory.length > 0 && (
          <ol>
            {latestHistory.map((item) => {
              const pre = item.pretest.score ?? 0;
              const post = item.posttest.score ?? 0;
              const delta = item.report?.deltaScore ?? post - pre;
              return (
                <li key={item.sessionId}>
                  {new Date(item.startedAt).toLocaleString("id-ID")} | {item.profile.nickname} | pre {pre}/10 ke post{" "}
                  {post}/10 (delta {delta >= 0 ? `+${delta}` : delta})
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section className="card">
        <div className="button-row">
          <button type="button" className="btn btn-primary" onClick={onNewSession}>
            Mulai Sesi Baru
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate("/menu")}>
            Kembali ke Menu
          </button>
        </div>
      </section>
    </main>
  );
}
