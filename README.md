# ARKANUH - Augmented Reality Arka Nuh

Website mobile-first untuk pembelajaran interaktif kisah Nabi Nuh (PAI Kelas 2, Kurikulum Merdeka) dengan:

- 10 halaman cerita interaktif
- AR marker-based di setiap halaman
- Voice over berbasis browser TTS (Bahasa Indonesia)
- Kuis formatif 10 soal
- Penyimpanan sesi lokal (`localStorage`)

## Rute Utama

- `/` beranda dan petunjuk singkat
- `/buku/:pageId` halaman cerita 1-10
- `/kuis` kuis formatif
- `/hasil` skor akhir dan ringkasan sesi

## Kontrak Penyimpanan Lokal

- `localStorage["arkanuh_session_current"]`
- `localStorage["arkanuh_session_history"]`

## Jalankan Proyek

1. Install Node.js (versi 18+ direkomendasikan).
2. Install dependency:

```bash
npm install
```

3. Jalankan mode development:

```bash
npm run dev
```

4. Build production:

```bash
npm run build
```

## Catatan AR Marker

- Aplikasi memakai mode marker-based melalui A-Frame + AR.js.
- Untuk pengujian, gunakan marker HIRO yang sudah disediakan di `public/assets/markers/hiro.png`.
- File marker `page-01.svg` s.d. `page-10.svg` disediakan sebagai placeholder visual per halaman dan dapat diganti marker final.
