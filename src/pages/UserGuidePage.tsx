import { Link } from "react-router-dom";

export function UserGuidePage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Panduan Penggunaan</p>
        <h1>Tata Cara Menggunakan ARKANUH</h1>
        <p className="subtitle">Panduan singkat untuk membaca flipbook, mendengar audio, dan menyelesaikan evaluasi.</p>
      </section>

      <section className="card">
        <h2>Apa itu ARKANUH?</h2>
        <p>
          ARKANUH adalah media pembelajaran interaktif tentang kisah Nabi Nuh untuk siswa kelas 2 SD. Alur utamanya
          terdiri dari pretest, membaca flipbook, posttest, lalu melihat hasil belajar.
        </p>
      </section>

      <section className="card">
        <h2>Tujuan Pembelajaran</h2>
        <ul>
          <li>
            <strong>Iman:</strong> Mengenal Nabi Nuh dan keimanan beliau kepada Allah.
          </li>
          <li>
            <strong>Taat:</strong> Memahami pentingnya taat kepada perintah Allah.
          </li>
          <li>
            <strong>Sabar:</strong> Meneladani kesabaran Nabi Nuh saat berdakwah.
          </li>
          <li>
            <strong>Akhlak:</strong> Membiasakan sikap jujur, rendah hati, dan bertanggung jawab.
          </li>
        </ul>
      </section>

      <section className="card">
        <h2>Alur Penggunaan Aplikasi</h2>
        <div className="usage-flow">
          <div className="flow-step">
            <h3>1. Beranda</h3>
            <p>Beranda menampilkan menu utama yang dibutuhkan siswa.</p>
            <ul>
              <li>Mulai untuk membaca flipbook.</li>
              <li>Pretest untuk tes awal.</li>
              <li>Posttest untuk tes akhir setelah buku selesai.</li>
              <li>Mini Game untuk latihan tambahan.</li>
            </ul>
          </div>

          <div className="flow-step">
            <h3>2. Kerjakan Pretest</h3>
            <p>Pretest wajib diselesaikan sebelum menu Mulai terbuka.</p>
            <ul>
              <li>Mengukur pengetahuan awal siswa.</li>
              <li>Membuka akses ke menu Mulai.</li>
              <li>Menjadi nilai pembanding dengan posttest.</li>
            </ul>
          </div>

          <div className="flow-step">
            <h3>3. Baca Flipbook</h3>
            <p>Menu Mulai menampilkan buku Heyzine di bagian atas layar.</p>
            <ul>
              <li>Balik halaman buku langsung di dalam iframe.</li>
              <li>Pilih Hal 1-10 di bawah buku agar teks dan audio sesuai.</li>
              <li>Teks cerita tampil di panel bawah.</li>
              <li>Audio narasi bisa diputar, dijeda, dilanjutkan, dan diulang.</li>
            </ul>
          </div>

          <div className="flow-step">
            <h3>4. Selesaikan Semua Halaman</h3>
            <p>Halaman dianggap selesai saat siswa memilih halaman itu di panel bawah.</p>
            <ul>
              <li>Progress akan bertambah setiap halaman dipilih.</li>
              <li>Posttest baru terbuka setelah 10 halaman selesai.</li>
            </ul>
          </div>

          <div className="flow-step">
            <h3>5. Kerjakan Posttest</h3>
            <p>Setelah membaca semua halaman, siswa melanjutkan ke posttest.</p>
            <ul>
              <li>Jawaban posttest tersimpan dalam sesi yang sama.</li>
              <li>Nilai posttest dibandingkan dengan nilai pretest.</li>
            </ul>
          </div>

          <div className="flow-step">
            <h3>6. Lihat Hasil</h3>
            <p>Halaman hasil menampilkan ringkasan pencapaian belajar.</p>
            <ul>
              <li>Skor pretest dan posttest.</li>
              <li>Selisih peningkatan hasil belajar.</li>
              <li>Riwayat sesi terbaru.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Tips Penggunaan</h2>
        <ul>
          <li>Dengarkan narasi sambil melihat halaman yang sama pada buku.</li>
          <li>Pilih nomor halaman di bawah buku setiap kali pindah halaman.</li>
          <li>Gunakan tombol ulang jika ingin mendengar cerita sekali lagi.</li>
          <li>Selesaikan pretest dan posttest dalam sesi yang sama agar hasil tersimpan rapi.</li>
        </ul>
      </section>

      <section className="card">
        <h2>Pertanyaan yang Sering Diajukan</h2>

        <div className="faq-item">
          <h3>Buku tidak tampil?</h3>
          <p>
            Coba refresh halaman, lalu pastikan koneksi internet stabil. Jika iframe tetap kosong, buka buku melalui
            tombol <strong>Buka Buku di Tab Baru</strong>.
          </p>
        </div>

        <div className="faq-item">
          <h3>Audio tidak terdengar?</h3>
          <p>
            Periksa volume perangkat dan tombol audio di browser. Jika file audio tidak tersedia, aplikasi akan mencoba
            memakai suara TTS browser sebagai cadangan.
          </p>
        </div>

        <div className="faq-item">
          <h3>Apakah perlu login?</h3>
          <p>Tidak. Aplikasi menyimpan data sesi di browser perangkat melalui local storage.</p>
        </div>

        <div className="faq-item">
          <h3>Bisa digunakan di mobile?</h3>
          <p>Ya. Tampilan dibuat mobile-first dan tetap bisa dibuka di desktop atau tablet.</p>
        </div>

        <div className="faq-item">
          <h3>Data pembelajaran saya tersimpan di mana?</h3>
          <p>Data tersimpan lokal di browser perangkat dan tidak memerlukan server tambahan.</p>
        </div>

        <div className="faq-item">
          <h3>Bagaimana cara mulai ulang?</h3>
          <p>Gunakan tombol <strong>Sesi Baru</strong> di beranda atau di halaman Mulai.</p>
        </div>
      </section>

      <section className="card">
        <h2>Kompatibilitas</h2>
        <ul>
          <li>
            <strong>Browser:</strong> Chrome, Firefox, Safari, atau Edge terbaru
          </li>
          <li>
            <strong>Internet:</strong> Dibutuhkan untuk membuka flipbook Heyzine dan memuat audio
          </li>
          <li>
            <strong>Perangkat:</strong> Desktop, tablet, atau smartphone
          </li>
        </ul>
      </section>

      <section className="card">
        <h2>Bantuan & Dukungan</h2>
        <p>
          Jika mengalami masalah atau memiliki saran pengembangan, gunakan halaman biodata untuk melihat informasi tim
          pengembang.
        </p>
        <ul>
          <li>Halaman Biodata Penulis</li>
          <li>Email yang tercantum di profil pengembang</li>
        </ul>
      </section>

      <section className="card">
        <Link to="/" className="btn btn-outline inline-btn-link">
          Kembali ke Menu
        </Link>
      </section>
    </main>
  );
}
