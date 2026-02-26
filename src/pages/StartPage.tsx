import { Navigate, useNavigate } from "react-router-dom";
import { flipbookPages } from "../data/flipbookPages";
import { useSessionContext } from "../state/SessionContext";

export function StartPage() {
  const navigate = useNavigate();
  const { session, restartSession } = useSessionContext();

  if (!session.pretest.completed) {
    return <Navigate to="/pretest" replace />;
  }

  const firstIncomplete = flipbookPages.find((page) => !session.flipbook.completedPages.includes(page.id));
  const startPath = firstIncomplete ? `/flipbook/${firstIncomplete.id}` : "/posttest";

  const onEnter = () => {
    if (session.posttest.completed) {
      navigate("/hasil-akhir");
      return;
    }
    navigate(startPath);
  };

  const onRestart = () => {
    restartSession(session.profile.nickname);
    navigate("/");
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Mulai Flipbook</p>
        <h1>Perjalanan Nabi Nuh</h1>
        <p className="subtitle">Halaman pop-up 3D tampil seperti flipbook interaktif tanpa kamera.</p>
      </section>

      <section className="card">
        <h2>Checklist Sesi</h2>
        <ul>
          <li>Nama siswa: {session.profile.nickname}</li>
          <li>Pretest: selesai ({session.pretest.score}/10)</li>
          <li>
            Progres flipbook: {session.flipbook.completedPages.length}/{flipbookPages.length}
          </li>
          <li>Posttest: {session.posttest.completed ? "selesai" : "belum dikerjakan"}</li>
        </ul>
      </section>

      <section className="card">
        <div className="button-row">
          <button type="button" className="btn btn-primary" onClick={onEnter}>
            {session.posttest.completed ? "Lihat Hasil Akhir" : "Masuk Flipbook"}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate("/")}>
            Kembali ke Menu
          </button>
          <button type="button" className="btn btn-outline" onClick={onRestart}>
            Mulai Sesi Baru
          </button>
        </div>
      </section>
    </main>
  );
}
