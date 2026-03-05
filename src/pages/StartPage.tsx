import { Navigate, useNavigate } from "react-router-dom";
import { flipbookPages } from "../data/flipbookPages";
import { useSessionContext } from "../state/SessionContext";

export function StartPage() {
  const navigate = useNavigate();
  const { session, restartSession } = useSessionContext();

  if (!session.pretest.completed) {
    return <Navigate to="/pretest" replace />;
  }

  const onSelectPage = (pageId: string) => {
    navigate(`/flipbook/${pageId}`);
  };

  const onRestart = () => {
    restartSession(session.profile.nickname);
    navigate("/");
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Menu Cerita</p>
        <h1>Pilih Cerita yang Ingin Dibaca</h1>
        <p className="subtitle">Pilih halaman cerita untuk melanjutkan perjalanan Nabi Nuh</p>
      </section>

      <section className="card">
        <h2>Halaman Cerita</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
          {flipbookPages.map((page) => {
            const isCompleted = session.flipbook.completedPages.includes(page.id);
            return (
              <button
                key={page.id}
                type="button"
                onClick={() => onSelectPage(page.id)}
                style={{
                  padding: "1rem",
                  border: "2px solid var(--color-primary)",
                  borderRadius: "8px",
                  background: isCompleted ? "var(--color-success-light)" : "white",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 200ms ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <strong>{page.title}</strong>
                {isCompleted && (
                  <p style={{ color: "var(--color-success)", marginTop: "0.5rem", fontSize: "0.9em" }}>
                    ✓ Sudah dibaca
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="card">
        <div className="button-row">
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
