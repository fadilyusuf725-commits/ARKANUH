import { Link } from "react-router-dom";

export function BiodataPage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Biodata Penulis</p>
        <h1>Profil Pengembang ARKANUH</h1>
        <p className="subtitle">Template placeholder, isi final dapat diperbarui nanti.</p>
      </section>

      <section className="card">
        <h2>Data Utama</h2>
        <ul>
          <li>Nama: [Isi nama penulis]</li>
          <li>Institusi: [Isi institusi]</li>
          <li>Program Studi: [Isi program studi]</li>
          <li>Email: [Isi kontak email]</li>
          <li>Lokasi: [Isi lokasi]</li>
        </ul>
      </section>

      <section className="card">
        <h2>Catatan Hak Cipta</h2>
        <p>
          Seluruh materi teks, gambar, audio, dan kode pada ARKANUH digunakan untuk media pembelajaran. Ganti bagian
          ini dengan lisensi final yang Anda inginkan.
        </p>
      </section>

      <section className="card">
        <Link to="/" className="btn btn-outline inline-btn-link">
          Kembali ke Menu
        </Link>
      </section>
    </main>
  );
}
