import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="page-shell">
      <section className="card">
        <p className="eyebrow">404</p>
        <h1>Halaman Tidak Ditemukan</h1>
        <p>Rute yang kamu buka tidak tersedia di ARKANUH v4.</p>
        <Link to="/" className="btn btn-primary inline-btn-link">
          Kembali ke Beranda
        </Link>
      </section>
    </main>
  );
}
