import { Link } from "react-router-dom";

export function BiodataPage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Biodata Penulis</p>
        <h1>Tim Pengembang ARKANUH</h1>
        <p className="subtitle">Aplikasi pembelajaran pop-up book 3D kisah Nabi Nuh untuk kelas 2 SD.</p>
      </section>

      <section className="card">
        <h2>👨‍🏫 Pembimbing</h2>
        <div className="biodata-team-member">
          <h3>Dr. Ani Nur Aeni, M.Pd.</h3>
          <ul className="biodata-details">
            <li><strong>NIP:</strong> 197608222005022002</li>
            <li><strong>Email:</strong> <a href="mailto:aninuraeni@upi.edu">aninuraeni@upi.edu</a></li>
            <li><strong>Peran:</strong> Pembimbing / Dosen Pendidik</li>
            <li><strong>Institusi:</strong> Universitas Pendidikan Indonesia (UPI)</li>
          </ul>
        </div>
      </section>

      <section className="card">
        <h2>👩‍💻 Tim Pengembang</h2>
        <div className="biodata-team-grid">
          <div className="biodata-team-member">
            <h3>Mochamad Fadhilah Yusup Fauzan</h3>
            <ul className="biodata-details">
              <li><strong>NIM:</strong> 2403827</li>
              <li><strong>Email:</strong> <a href="mailto:fadhillah72@upi.edu">fadhillah72@upi.edu</a></li>
              <li><strong>Peran:</strong> Pengembang (Backend & Unity Engine)</li>
              <li><strong>Institusi:</strong> Universitas Pendidikan Indonesia (UPI)</li>
            </ul>
          </div>

          <div className="biodata-team-member">
            <h3>Pratiwi Tarida</h3>
            <ul className="biodata-details">
              <li><strong>NIM:</strong> 2403348</li>
              <li><strong>Email:</strong> <a href="mailto:Pratiwitarida@upi.edu">Pratiwitarida@upi.edu</a></li>
              <li><strong>Peran:</strong> Pengembang (Frontend & UI/UX Design)</li>
              <li><strong>Institusi:</strong> Universitas Pendidikan Indonesia (UPI)</li>
            </ul>
          </div>

          <div className="biodata-team-member">
            <h3>Dina Marlina Sudrajat</h3>
            <ul className="biodata-details">
              <li><strong>NIM:</strong> 2407769</li>
              <li><strong>Email:</strong> <a href="mailto:marlinas57@upi.edu">marlinas57@upi.edu</a></li>
              <li><strong>Peran:</strong> Pengembang (Content & Naratif)</li>
              <li><strong>Institusi:</strong> Universitas Pendidikan Indonesia (UPI)</li>
            </ul>
          </div>

          <div className="biodata-team-member">
            <h3>Rezki Cladesvina Adhi Putri</h3>
            <ul className="biodata-details">
              <li><strong>NIM:</strong> 2400282</li>
              <li><strong>Email:</strong> <a href="mailto:rezkivina@upi.edu">rezkivina@upi.edu</a></li>
              <li><strong>Peran:</strong> Pengembang (3D Model & Asset Optimization)</li>
              <li><strong>Institusi:</strong> Universitas Pendidikan Indonesia (UPI)</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>📚 Tentang ARKANUH</h2>
        <p>
          <strong>ARKANUH</strong> singkatan dari <strong>"Augmented Reality Kisah Arkha Nuh"</strong> adalah 
          aplikasi pembelajaran interaktif berbentuk <strong>pop-up book 3D</strong> yang menceritakan kisah 
          Nabi Nuh untuk siswa kelas 2 Sekolah Dasar.
        </p>
        <p>
          Proyek ini dikembangkan sebagai bagian dari program pendidikan di <strong>Universitas Pendidikan Indonesia (UPI)</strong> 
          dengan fokus pada:
        </p>
        <ul>
          <li>✅ <strong>Pembelajaran Interaktif:</strong> Menggunakan teknologi 3D dan animasi</li>
          <li>✅ <strong>Pedagogi Islami:</strong> Mengajarkan nilai-nilai Iman, Taat, Sabar, dan Akhlak</li>
          <li>✅ <strong>Engagement Tinggi:</strong> Pop-up book 3D yang menarik dan interaktif</li>
          <li>✅ <strong>Evaluasi Terukur:</strong> Pretest, Posttest, dan penilaian formatif</li>
        </ul>
      </section>

      <section className="card">
        <h2>🎯 Kompetensi yang Dikembangkan</h2>
        <ul>
          <li>
            <strong>Iman & Akidah:</strong> Mengenal keimanan Nabi Nuh kepada Allah SWT melalui cerita interaktif
          </li>
          <li>
            <strong>Akhlak & Karakter:</strong> Meniru sifat sabar, bijaksana, dan baik hati dari Nabi Nuh
          </li>
          <li>
            <strong>Ketaatan:</strong> Memahami pentingnya mematuhi perintah Allah melalui contoh teladan
          </li>
          <li>
            <strong>Literasi Digital:</strong> Menggunakan teknologi interaktif untuk pembelajaran modern yang menyenangkan
          </li>
        </ul>
      </section>

      <section className="card">
        <h2>📋 Catatan Hak Cipta & Lisensi</h2>
        <p>
          Seluruh materi yang terdapat dalam aplikasi ARKANUH, meliputi:
        </p>
        <ul>
          <li>Teks cerita, narasi, dan skenario pembelajaran</li>
          <li>Gambar, grafis, desain visual, dan ilustrasi</li>
          <li>File audio, musik latar, dan voice-over</li>
          <li>Model 3D, animasi, dan aset digital</li>
          <li>Kode aplikasi dan infrastruktur teknis</li>
        </ul>
        <p>
          Dikembangkan untuk keperluan <strong>media pembelajaran Islami</strong> bagi siswa kelas 2 SD 
          dan dapat disesuaikan sesuai kebutuhan institusi pendidikan.
        </p>
        <p className="legal-note">
          <strong>© 2026 Tim Pengembang ARKANUH, Universitas Pendidikan Indonesia (UPI).</strong> 
          Semua hak dilindungi. Penggunaan tanpa izin untuk keperluan komersial dilarang. 
          Untuk keperluan pendidikan non-komersial, hubungi tim pengembang atau pembimbing.
        </p>
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
