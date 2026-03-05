import { Link } from "react-router-dom";

export function BiodataPage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Biodata Penulis</p>
        <h1>Profil Pengembang ARKANUH</h1>
        <p className="subtitle">Informasi lengkap tentang pengembang aplikasi ini.</p>
      </section>

      <section className="card">
        <h2>👤 Data Utama Pengembang</h2>
        <div className="biodata-grid">
          <div className="biodata-item">
            <label>Nama Lengkap:</label>
            <p className="biodata-value">[Silakan isi nama pengembang]</p>
          </div>
          <div className="biodata-item">
            <label>Institusi / Sekolah:</label>
            <p className="biodata-value">[Silakan isi nama institusi]</p>
          </div>
          <div className="biodata-item">
            <label>Program Studi / Kelas:</label>
            <p className="biodata-value">[Silakan isi program studi atau kelas]</p>
          </div>
          <div className="biodata-item">
            <label>Email Kontak:</label>
            <p className="biodata-value">[Silakan isi email]</p>
          </div>
          <div className="biodata-item">
            <label>Nomor HP / WhatsApp:</label>
            <p className="biodata-value">[Silakan isi nomor kontak]</p>
          </div>
          <div className="biodata-item">
            <label>Lokasi / Alamat:</label>
            <p className="biodata-value">[Silakan isi lokasi]</p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>📚 Tentang ARKANUH</h2>
        <p>
          <strong>ARKANUH</strong> adalah singkatan dari <strong>"Augmented Reality Kisah Arkha Nuh"</strong> - 
          sebuah aplikasi pembelajaran interaktif berbentuk <strong>pop-up book 3D</strong> yang menceritakan 
          kisah Nabi Nuh untuk siswa kelas 2 Sekolah Dasar.
        </p>
        <p>
          Aplikasi ini dirancang untuk memberikan pengalaman belajar yang:
        </p>
        <ul>
          <li>✅ <strong>Interaktif:</strong> Siswa dapat berinteraksi dengan model 3D secara langsung</li>
          <li>✅ <strong>Menyenangkan:</strong> Gambar, animasi, dan audio membuat pembelajaran lebih engaging</li>
          <li>✅ <strong>Mendidik:</strong> Mengajarkan nilai-nilai Islami (Iman, Taat, Sabar, Akhlak)</li>
          <li>✅ <strong>Terukur:</strong> Dilengkapi dengan evaluasi awal (pretest) dan akhir (posttest)</li>
        </ul>
      </section>

      <section className="card">
        <h2>🎯 Kompetensi yang Dikembangkan</h2>
        <ul>
          <li>
            <strong>Iman & Akidah:</strong> Mengenal keimanan Nabi Nuh kepada Allah dan monotheisme
          </li>
          <li>
            <strong>Akhlak & Karakter:</strong> Meniru sifat sabar, bijaksana, dan baik hati dari Nabi Nuh
          </li>
          <li>
            <strong>Ketaatan:</strong> Memahami pentingnya mematuhi perintah Allah
          </li>
          <li>
            <strong>Literasi Digital:</strong> Menggunakan teknologi interaktif untuk pembelajaran modern
          </li>
        </ul>
      </section>

      <section className="card">
        <h2>📋 Catatan Hak Cipta & Lisensi</h2>
        <p>
          Seluruh materi yang terdapat dalam aplikasi ARKANUH, termasuk:
        </p>
        <ul>
          <li>Teks cerita dan narasi</li>
          <li>Gambar, grafis, dan ilustrasi</li>
          <li>File audio dan musik</li>
          <li>Model 3D dan animasi</li>
          <li>Kode aplikasi</li>
        </ul>
        <p>
          Dikembangkan untuk keperluan <strong>media pembelajaran Islami</strong> bagi siswa kelas 2 SD 
          dan dapat disesuaikan sesuai kebutuhan institusi pendidikan.
        </p>
        <p className="legal-note">
          <strong>© 2026 [Nama Pengembang/Institusi].</strong> Semua hak dilindungi. Penggunaan tanpa izin 
          untuk keperluan komersial dilarang. Untuk keperluan pendidikan non-komersial, hubungi pengembang.
        </p>
      </section>

      <section className="card">
        <h2>📞 Hubungi Pengembang</h2>
        <p>
          Untuk pertanyaan, saran, atau feedback tentang aplikasi ARKANUH:
        </p>
        <ul>
          <li>📧 Email: [Silakan isi email]</li>
          <li>💬 WhatsApp: [Silakan isi nomor]</li>
          <li>🌐 Website/Blog: [Silakan isi link jika ada]</li>
        </ul>
      </section>

      <section className="card">
        <h2>🔗 Menu Terkait</h2>
        <div className="related-links">
          <Link to="/cp-tp-atp" className="btn btn-outline">
            Lihat CP/TP/ATP
          </Link>
          <Link to="/panduan-penggunaan" className="btn btn-outline">
            Baca Panduan Penggunaan
          </Link>
          <Link to="/" className="btn btn-outline">
            Kembali ke Home
          </Link>
        </div>
      </section>
    </main>
  );
}
