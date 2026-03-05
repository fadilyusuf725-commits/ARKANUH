import { Link } from "react-router-dom";

export function UserGuidePage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Panduan Penggunaan</p>
        <h1>Tata Cara Menggunakan ARKANUH</h1>
        <p className="subtitle">Petunjuk lengkap untuk menggunakan aplikasi pembelajaran interaktif ini.</p>
      </section>

      <section className="card">
        <h2>📍 Apa itu ARKANUH?</h2>
        <p>
          ARKANUH adalah aplikasi pembelajaran interaktif berbentuk pop-up book 3D yang menceritakan kisah Nabi Nuh kepada siswa kelas 2 SD. 
          Aplikasi ini menggabungkan elemen narasi, visual 3D, pertanyaan evaluasi, dan mini game untuk menciptakan pengalaman belajar yang menyenangkan dan mendidik.
        </p>
      </section>

      <section className="card">
        <h2>🎯 Tujuan Pembelajaran</h2>
        <ul>
          <li><strong>Iman:</strong> Mengenal Nabi Nuh dan keimanan beliau kepada Allah</li>
          <li><strong>Taat:</strong> Memahami pentingnya ketaatan pada perintah Allah</li>
          <li><strong>Sabar:</strong> Belajar dari kesabaran Nabi Nuh dalam berdakwah</li>
          <li><strong>Akhlak Baik:</strong> Meniru akhlak mulia Nabi Nuh dalam kehidupan sehari-hari</li>
        </ul>
      </section>

      <section className="card">
        <h2>📋 Alur Penggunaan Aplikasi</h2>
        <div className="usage-flow">
          <div className="flow-step">
            <h3>1. Beranda (Home)</h3>
            <p>
              Halaman utama menampilkan berbagai menu pilihan. Anda bisa langsung memilih:
            </p>
            <ul>
              <li><strong>Mulai</strong> - Masuk ke alur pembelajaran utama</li>
              <li><strong>Pretest</strong> - Tes awal untuk mengetahui pemahaman sebelum belajar</li>
              <li><strong>Posttest</strong> - Tes akhir setelah menyelesaikan cerita</li>
              <li><strong>Mini Game</strong> - Permainan interaktif untuk mengasah pemahaman</li>
              <li><strong>CP/TP/ATP</strong> - Informasi kurikulum dan capaian pembelajaran</li>
              <li><strong>Biodata</strong> - Profil pengembang aplikasi</li>
              <li><strong>Hasil</strong> - Lihat skor dan hasil akhir pembelajaran</li>
            </ul>
          </div>

          <div className="flow-step">
            <h3>2. Pretest (Penting!)</h3>
            <p>
              Sebelum mulai membaca cerita, jawab pertanyaan pretest. Ini membantu:
            </p>
            <ul>
              <li>Mengukur pengetahuan awal Anda</li>
              <li>Membuka akses ke halaman pembelajaran utama</li>
              <li>Memberikan nilai evaluasi awal</li>
            </ul>
            <p><strong>Tips:</strong> Jawab dengan jujur berdasarkan pemahaman Anda saat ini.</p>
          </div>

          <div className="flow-step">
            <h3>3. Mulai / Membaca Buku</h3>
            <p>
              Masuk ke alur pembelajaran 10 halaman cerita Nabi Nuh:
            </p>
            <ul>
              <li>Setiap halaman memiliki <strong>pop-up 3D model interaktif</strong></li>
              <li><strong>Narasi audio</strong> yang bisa didengarkan atau di-skip</li>
              <li><strong>Interaksi</strong> seperti tap, drag, atau pilihan jawaban</li>
              <li>Tombol <strong>Reset View</strong> untuk me-reset sudut pandang 3D</li>
              <li>Tombol <strong>Sebelumnya/Berikutnya</strong> untuk navigasi halaman</li>
            </ul>
          </div>

          <div className="flow-step">
            <h3>4. Interaksi 3D</h3>
            <p>
              Model 3D di setiap halaman dapat diinteraksi:
            </p>
            <ul>
              <li><strong>Drag/Swipe kiri-kanan</strong> pada area 3D untuk memutar model</li>
              <li><strong>Scroll/Pinch</strong> (mobile) untuk zoom in/out</li>
              <li><strong>Auto-rotate:</strong> Model berputar otomatis saat tidak disentuh</li>
              <li><strong>Reset View:</strong> Kembalikan ke sudut pandang awal</li>
            </ul>
          </div>

          <div className="flow-step">
            <h3>5. Posttest (Tes Akhir)</h3>
            <p>
              Setelah menyelesaikan semua 10 halaman cerita:
            </p>
            <ul>
              <li>Buku akan menutup dengan animasi</li>
              <li>Anda akan diarahkan ke halaman Posttest</li>
              <li>Jawab pertanyaan posttest untuk mengukur pemahaman akhir</li>
              <li>Hasil akan dibandingkan dengan Pretest</li>
            </ul>
          </div>

          <div className="flow-step">
            <h3>6. Hasil & Skor</h3>
            <p>
              Lihat ringkasan hasil pembelajaran Anda:
            </p>
            <ul>
              <li>Skor Pretest dan Posttest</li>
              <li>Peningkatan pemahaman</li>
              <li>Daftar halaman yang sudah diselesaikan</li>
              <li>Opsi untuk memulai ulang pembelajaran</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>🎮 Tips & Trik</h2>
        <ul>
          <li>
            <strong>Dengarkan Audio Narasi:</strong> Dengarkan cerita lengkap dari awal untuk pemahaman 
            yang lebih baik. Jika ada masalah audio, teks akan tersedia sebagai fallback.
          </li>
          <li>
            <strong>Eksplorasi Model 3D:</strong> Putar dan lihat model dari berbagai sudut untuk memahami 
            visual cerita dengan lebih baik.
          </li>
          <li>
            <strong>Ikuti Instruksi Interaksi:</strong> Setiap halaman memiliki interaksi berbeda 
            (tap, drag, pilih). Ikuti petunjuk untuk menyelesaikan interaksi.
          </li>
          <li>
            <strong>Jangan Skip Pretest/Posttest:</strong> Hasil tes penting untuk mengukur efektivitas 
            pembelajaran Anda.
          </li>
          <li>
            <strong>Gunakan Perangkat Lebar:</strong> Aplikasi lebih nyaman digunakan di layar lebih besar 
            (tablet/desktop) untuk pengalaman 3D yang optimal.
          </li>
          <li>
            <strong>WebGL Support:</strong> Pastikan browser Anda mendukung WebGL 2 untuk rendering 3D 
            yang lancar. Chrome/Firefox/Safari terbaru disarankan.
          </li>
        </ul>
      </section>

      <section className="card">
        <h2>❓ Pertanyaan yang Sering Diajukan</h2>
        
        <div className="faq-item">
          <h3>Model 3D tidak muncul?</h3>
          <p>
            Coba: Refresh halaman (F5 atau Ctrl+R), bersihkan cache browser, gunakan browser terbaru 
            yang support WebGL 2. Jika masih tidak muncul, cek koneksi internet Anda.
          </p>
        </div>

        <div className="faq-item">
          <h3>Audio tidak terdengar?</h3>
          <p>
            Periksa volume perangkat Anda, izin audio browser, dan koneksi internet. Aplikasi akan 
            otomatis menggunakan text-to-speech sebagai fallback jika file audio tidak tersedia.
          </p>
        </div>

        <div className="faq-item">
          <h3>Bagaimana jika lupa password/login?</h3>
          <p>
            Aplikasi ini menggunakan penyimpanan lokal (local storage), jadi tidak perlu login. 
            Data tersimpan di perangkat Anda. Jika ingin reset, bersihkan cache browser.
          </p>
        </div>

        <div className="faq-item">
          <h3>Bisa digunakan di mobile?</h3>
          <p>
            Ya, aplikasi responsive dan bisa diakses dari smartphone/tablet. Namun pengalaman 
            3D lebih optimal di perangkat dengan layar lebih besar.
          </p>
        </div>

        <div className="faq-item">
          <h3>Data pembelajaran saya tersimpan di mana?</h3>
          <p>
            Data tersimpan secara lokal di perangkat Anda (browser local storage). Data tidak 
            dikirim ke server, jadi privasi Anda terjaga.
          </p>
        </div>

        <div className="faq-item">
          <h3>Bagaimana cara menghapus progress dan mulai ulang?</h3>
          <p>
            Buka halaman Hasil (Hasil) dan klik tombol untuk reset pembelajaran. Atau bersihkan 
            cache/cookies browser.
          </p>
        </div>
      </section>

      <section className="card">
        <h2>📱 Kompatibilitas & Requirement</h2>
        <ul>
          <li><strong>Browser:</strong> Chrome, Firefox, Safari, atau Edge terbaru</li>
          <li><strong>WebGL 2:</strong> Diperlukan untuk rendering 3D (kebanyakan browser modern mendukung)</li>
          <li><strong>Internet:</strong> Koneksi stabil untuk loading model 3D dan audio</li>
          <li><strong>Perangkat:</strong> Desktop, tablet, atau smartphone (landscape mode disarankan untuk mobile)</li>
          <li><strong>RAM:</strong> Minimal 2GB untuk performa optimal</li>
        </ul>
      </section>

      <section className="card">
        <h2>🆘 Bantuan & Dukungan</h2>
        <p>
          Jika mengalami masalah atau memiliki saran untuk improvement aplikasi, hubungi pengembang melalui:
        </p>
        <ul>
          <li>Halaman Biodata (tersedia di menu Beranda)</li>
          <li>Email yang tercantum di profil pengembang</li>
          <li>Gunakan browser dev tools (F12 → Console) untuk laporan error teknis</li>
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
