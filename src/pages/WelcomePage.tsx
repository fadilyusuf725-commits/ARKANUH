import { Link } from "react-router-dom";

export function WelcomePage() {
  return (
    <main className="page-shell welcome-shell">
      <section className="hero-card welcome-card">
        <p className="eyebrow">Selamat Datang</p>
        <h1>ARKANUH</h1>
        <p className="subtitle">
          Media ajar interaktif kisah Nabi Nuh untuk siswa kelas 2 SD. Masuk ke menu utama untuk memulai pretest,
          membaca flipbook, mendengar voice over, dan melihat hasil belajar.
        </p>
        <div className="welcome-badges" aria-label="Fitur utama">
          <span className="welcome-badge">Flipbook</span>
          <span className="welcome-badge">Voice Over</span>
          <span className="welcome-badge">Pretest</span>
          <span className="welcome-badge">Posttest</span>
        </div>
        <div className="button-row welcome-actions">
          <Link to="/menu" className="btn btn-primary inline-btn-link">
            Masuk ke Menu Utama
          </Link>
          <Link to="/panduan-penggunaan" className="btn btn-outline inline-btn-link">
            Lihat Panduan
          </Link>
        </div>
      </section>
    </main>
  );
}
