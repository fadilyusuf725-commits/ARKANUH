import { Link } from "react-router-dom";

export function WelcomePage() {
  return (
    <main className="page-shell welcome-shell">
      <section className="welcome-stage">
        <div className="welcome-card">
          <p className="eyebrow">Selamat Datang</p>
          <h1>ARKANUH</h1>
          <p className="subtitle">
            Media ajar interaktif kisah Nabi Nuh untuk siswa kelas 2 SD. Sekarang cerita, model 3D, narasi suara, dan
            evaluasi hadir dalam pengalaman belajar yang lebih rapi dan mudah diikuti.
          </p>
          <div className="welcome-badges" aria-label="Fitur utama">
            <span className="welcome-badge">10 halaman cerita</span>
            <span className="welcome-badge">Viewer 3D</span>
            <span className="welcome-badge">Voice Over</span>
            <span className="welcome-badge">Pretest dan Posttest</span>
          </div>
          <div className="button-row welcome-actions">
            <Link to="/menu" className="btn btn-primary inline-btn-link">
              Masuk ke Menu Utama
            </Link>
            <Link to="/panduan-penggunaan" className="btn btn-outline inline-btn-link">
              Lihat Panduan
            </Link>
          </div>
        </div>

        <div className="welcome-storyboard" aria-label="Ringkasan pengalaman belajar">
          <article className="welcome-story-card">
            <span className="welcome-story-kicker">Alur Belajar</span>
            <strong>Pretest - Cerita - Posttest - Hasil</strong>
            <p>Semua langkah pembelajaran tersusun jelas dari awal sampai ringkasan nilai akhir.</p>
          </article>
          <article className="welcome-story-card">
            <span className="welcome-story-kicker">Kanvas Gabungan</span>
            <strong>3D utama, buku mini pendamping</strong>
            <p>Siswa tetap melihat konteks halaman asli sambil fokus pada objek 3D dan narasi.</p>
          </article>
          <article className="welcome-story-card">
            <span className="welcome-story-kicker">Siap Digunakan</span>
            <strong>Laptop, tablet, dan ponsel</strong>
            <p>Tampilan dibuat ringan dan responsif supaya tetap nyaman dipakai dalam kelas maupun di rumah.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
