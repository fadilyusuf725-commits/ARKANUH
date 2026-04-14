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
  const performanceLabel =
    deltaScore >= 4 ? "Peningkatan sangat baik" : deltaScore >= 1 ? "Pemahaman bertambah" : deltaScore === 0 ? "Skor stabil" : "Perlu penguatan";

  const onNewSession = () => {
    restartSession(session.profile.nickname);
    navigate("/");
  };

  return (
    <main className="page-shell result-shell">
      <section className="hero-card result-hero">
        <p className="eyebrow">Hasil Akhir</p>
        <h1>{session.profile.nickname}, sesi belajarmu selesai</h1>
        <p className="subtitle">{summary}</p>
        <div className="result-highlight-row">
          <span className="result-pill">Pretest {pretestScore}/10</span>
          <span className="result-pill">Posttest {posttestScore}/10</span>
          <span className="result-pill">{performanceLabel}</span>
        </div>
      </section>

      <section className="result-metric-grid" aria-label="Ringkasan nilai">
        <article className="card result-metric-card">
          <span className="result-metric-label">Skor Pretest</span>
          <strong>{pretestScore}/10</strong>
          <p>Nilai awal sebelum membaca cerita.</p>
        </article>
        <article className="card result-metric-card">
          <span className="result-metric-label">Skor Posttest</span>
          <strong>{posttestScore}/10</strong>
          <p>Nilai setelah menuntaskan seluruh materi.</p>
        </article>
        <article className="card result-metric-card">
          <span className="result-metric-label">Delta Peningkatan</span>
          <strong>{deltaScore >= 0 ? `+${deltaScore}` : deltaScore}</strong>
          <p>{performanceLabel} berdasarkan perbandingan skor awal dan akhir.</p>
        </article>
      </section>

      <section className="card result-history-card">
        <h2>Riwayat Sesi Terbaru</h2>
        {latestHistory.length === 0 && <p>Belum ada riwayat sesi.</p>}
        {latestHistory.length > 0 && (
          <ol className="result-history-list">
            {latestHistory.map((item) => {
              const pre = item.pretest.score ?? 0;
              const post = item.posttest.score ?? 0;
              const delta = item.report?.deltaScore ?? post - pre;
              return (
                <li key={item.sessionId} className="result-history-item">
                  <strong>{item.profile.nickname}</strong>
                  <span>{new Date(item.startedAt).toLocaleString("id-ID")}</span>
                  <span>
                    pre {pre}/10 {"->"} post {post}/10 ({delta >= 0 ? `+${delta}` : delta})
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section className="card result-action-card">
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
