import { Link } from "react-router-dom";
import { withBasePath } from "../lib/assetPaths";

export function BiodataPage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Biodata Penulis</p>
        <h1>Tim Pengembang ARKANUH</h1>
        <p className="subtitle">Aplikasi pembelajaran flipbook interaktif kisah Nabi Nuh untuk kelas 2 SD.</p>
      </section>

      <section className="card">
        <h2>Pembimbing</h2>
        <div className="biodata-team-member team-with-photo">
          <div className="team-photo">
            <img src={withBasePath("assets/team-photos/aninuraeni.jpg")} alt="Dr. Ani Nur Aeni, M.Pd." />
          </div>
          <div className="team-info">
            <h3>Dr. Ani Nur Aeni, M.Pd.</h3>
            <ul className="biodata-details">
              <li>
                <strong>NIP:</strong> 197608222005022002
              </li>
              <li>
                <strong>Email:</strong> <a href="mailto:aninuraeni@upi.edu">aninuraeni@upi.edu</a>
              </li>
              <li>
                <strong>Peran:</strong> Pembimbing / Dosen Pendidik
              </li>
              <li>
                <strong>Institusi:</strong> Universitas Pendidikan Indonesia (UPI)
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Tim Pengembang</h2>
        <div className="biodata-team-grid">
          <div className="biodata-team-member team-card-with-photo">
            <div className="team-photo">
              <img src={withBasePath("assets/team-photos/fadhillah.jpg")} alt="Mochamad Fadhilah Yusup Fauzan" />
            </div>
            <h3>Mochamad Fadhilah Yusup Fauzan</h3>
            <ul className="biodata-details">
              <li>
                <strong>NIM:</strong> 2403827
              </li>
              <li>
                <strong>Email:</strong> <a href="mailto:fadhillah72@upi.edu">fadhillah72@upi.edu</a>
              </li>
              <li>
                <strong>Peran:</strong> Pengembang (Backend & Sistem)
              </li>
              <li>
                <strong>Institusi:</strong> Universitas Pendidikan Indonesia (UPI)
              </li>
            </ul>
          </div>

          <div className="biodata-team-member team-card-with-photo">
            <div className="team-photo">
              <img src={withBasePath("assets/team-photos/pratiwi.jpg")} alt="Pratiwi Tarida" />
            </div>
            <h3>Pratiwi Tarida</h3>
            <ul className="biodata-details">
              <li>
                <strong>NIM:</strong> 2403348
              </li>
              <li>
                <strong>Email:</strong> <a href="mailto:Pratiwitarida@upi.edu">Pratiwitarida@upi.edu</a>
              </li>
              <li>
                <strong>Peran:</strong> Pengembang (Frontend & UI/UX Design)
              </li>
              <li>
                <strong>Institusi:</strong> Universitas Pendidikan Indonesia (UPI)
              </li>
            </ul>
          </div>

          <div className="biodata-team-member team-card-with-photo">
            <div className="team-photo">
              <img src={withBasePath("assets/team-photos/dina.jpg")} alt="Dina Marlina Sudrajat" />
            </div>
            <h3>Dina Marlina Sudrajat</h3>
            <ul className="biodata-details">
              <li>
                <strong>NIM:</strong> 2407769
              </li>
              <li>
                <strong>Email:</strong> <a href="mailto:marlinas57@upi.edu">marlinas57@upi.edu</a>
              </li>
              <li>
                <strong>Peran:</strong> Pengembang (Content & Naratif)
              </li>
              <li>
                <strong>Institusi:</strong> Universitas Pendidikan Indonesia (UPI)
              </li>
            </ul>
          </div>

          <div className="biodata-team-member team-card-with-photo">
            <div className="team-photo">
              <img src={withBasePath("assets/team-photos/rezki.jpg")} alt="Rezki Cladesvina Adhi Putri" />
            </div>
            <h3>Rezki Cladesvina Adhi Putri</h3>
            <ul className="biodata-details">
              <li>
                <strong>NIM:</strong> 2400282
              </li>
              <li>
                <strong>Email:</strong> <a href="mailto:rezkivina@upi.edu">rezkivina@upi.edu</a>
              </li>
              <li>
                <strong>Peran:</strong> Pengembang (Asset Visual & Optimisasi Media)
              </li>
              <li>
                <strong>Institusi:</strong> Universitas Pendidikan Indonesia (UPI)
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Tentang ARKANUH</h2>
        <p>
          <strong>ARKANUH</strong> singkatan dari <strong>Augmented Reality Kisah Arkha Nuh</strong> yang kini
          dikembangkan sebagai aplikasi pembelajaran interaktif berbentuk <strong>flipbook digital</strong> tentang
          kisah Nabi Nuh untuk siswa kelas 2 Sekolah Dasar.
        </p>
        <p>Proyek ini dikembangkan sebagai bagian dari program pendidikan di Universitas Pendidikan Indonesia (UPI).</p>
        <ul>
          <li>
            <strong>Pembelajaran Interaktif:</strong> Menggunakan flipbook, audio, dan ilustrasi digital.
          </li>
          <li>
            <strong>Pedagogi Islami:</strong> Mengajarkan nilai iman, taat, sabar, dan akhlak.
          </li>
          <li>
            <strong>Engagement Tinggi:</strong> Flipbook yang menarik dan mudah diikuti anak.
          </li>
          <li>
            <strong>Evaluasi Terukur:</strong> Pretest, posttest, dan ringkasan hasil belajar.
          </li>
        </ul>
      </section>

      <section className="card">
        <h2>Kompetensi yang Dikembangkan</h2>
        <ul>
          <li>
            <strong>Iman & Akidah:</strong> Mengenal keimanan Nabi Nuh kepada Allah SWT melalui cerita interaktif.
          </li>
          <li>
            <strong>Akhlak & Karakter:</strong> Meniru sifat sabar, bijaksana, dan baik hati dari Nabi Nuh.
          </li>
          <li>
            <strong>Ketaatan:</strong> Memahami pentingnya mematuhi perintah Allah melalui contoh teladan.
          </li>
          <li>
            <strong>Literasi Digital:</strong> Menggunakan media belajar digital secara terarah dan menyenangkan.
          </li>
        </ul>
      </section>

      <section className="card">
        <h2>Catatan Hak Cipta & Lisensi</h2>
        <p>Seluruh materi dalam aplikasi ARKANUH meliputi:</p>
        <ul>
          <li>Teks cerita, narasi, dan skenario pembelajaran.</li>
          <li>Gambar, grafis, desain visual, dan ilustrasi.</li>
          <li>File audio, musik latar, dan voice-over.</li>
          <li>Aset visual, audio, dan media digital.</li>
          <li>Kode aplikasi dan infrastruktur teknis.</li>
        </ul>
        <p>
          Dikembangkan untuk keperluan media pembelajaran Islami bagi siswa kelas 2 SD dan dapat disesuaikan sesuai
          kebutuhan institusi pendidikan.
        </p>
        <p className="legal-note">
          <strong>© 2026 Tim Pengembang ARKANUH, Universitas Pendidikan Indonesia (UPI).</strong> Semua hak
          dilindungi. Penggunaan tanpa izin untuk keperluan komersial dilarang. Untuk keperluan pendidikan
          non-komersial, hubungi tim pengembang atau pembimbing.
        </p>
      </section>

      <section className="card">
        <h2>Menu Terkait</h2>
        <div className="related-links">
          <Link to="/cp-tp-atp" className="btn btn-outline">
            Lihat CP/TP/ATP
          </Link>
          <Link to="/panduan-penggunaan" className="btn btn-outline">
            Baca Panduan
          </Link>
          <Link to="/" className="btn btn-outline">
            Kembali ke Home
          </Link>
        </div>
      </section>
    </main>
  );
}
