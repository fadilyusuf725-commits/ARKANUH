# ARKANUH

ARKANUH adalah web pembelajaran kisah Nabi Nuh untuk kelas 2 SD dengan alur:

`Pretest -> Mulai -> Posttest -> Hasil`

## Arsitektur Aktif

- Frontend: React + TypeScript + Vite
- Routing: `BrowserRouter` dengan `basename={import.meta.env.BASE_URL}`
- Reader: viewer asset 3D lokal di route `/mulai`
- Penyimpanan: `localStorage`
- Hosting: GitHub Pages

## Route Utama

- `/` halaman sambutan
- `/menu`
- `/pretest`
- `/mulai?page=1` sampai `/mulai?page=10`
- `/posttest`
- `/hasil-akhir`
- `/cp-tp-atp`
- `/biodata-penulis`
- `/panduan-penggunaan`

Route lama tetap diarahkan ke flow baru:

- `/flipbook/:pageId` -> `/mulai?page=:pageId`
- `/powerpoint` -> `/mulai`
- `/cerita-nabi-nuh` -> `/mulai`

## Cara Kerja Menu Mulai

- Viewer 3D menampilkan model per halaman cerita (1-10).
- Pengguna berpindah halaman dengan swipe atau tombol `Sebelumnya/Berikutnya`.
- Model bersumber dari file lokal `.glb` di `public/assets/models/`.
- Manifest model berada di `public/assets/models/model-manifest.json`.
- Teks cerita dan audio ada di panel bawah.
- Halaman cerita aktif mengikuti `?page=1..10`.
- Posttest terbuka setelah 10 halaman selesai.

## Audio

Audio narasi aktif berada di:

- `public/assets/voice/page-01.wav`
- `public/assets/voice/page-02.wav`
- `public/assets/voice/page-03.wav`
- `public/assets/voice/page-04.wav`
- `public/assets/voice/page-05.wav`
- `public/assets/voice/page-06.wav`
- `public/assets/voice/page-07.wav`
- `public/assets/voice/page-08.wav`
- `public/assets/voice/page-09.wav`
- `public/assets/voice/page-10.wav`

Jika file audio gagal dimuat, komponen voice over akan mencoba fallback ke TTS browser.

## Session Storage

- `localStorage["arkanuh_v2_session_current"]`
- `localStorage["arkanuh_v2_session_history"]`

Riwayat disimpan maksimal 25 sesi.

## Menjalankan Proyek

```bash
npm install
npm run dev:local
```

Script yang tersedia:

- `npm run dev` untuk menjalankan Vite dan langsung membuka route `/ARKANUH/`
- `npm run dev:local` untuk uji lokal di komputer sendiri
- `npm run dev:network` untuk uji dari HP pada jaringan Wi-Fi yang sama
- `npm run preview:local` untuk melihat hasil build produksi secara lokal
- `npm run models:prepare` untuk mengambil model dari link Tripo dan membuat manifest lokal

## Penting Saat Menjalankan Lokal

- Jangan membuka [index.html](d:/ARKANUH/index.html) langsung dengan `Live Preview`.
- Aplikasi ini adalah `React + Vite + BrowserRouter`, jadi harus dijalankan lewat server Vite.
- Jika `index.html` dibuka langsung, halaman bisa tampak putih karena script module dan route app tidak diproses seperti saat runtime normal.

## Build Produksi

```bash
npm run build
```

`postbuild` otomatis membuat `dist/404.html` untuk fallback SPA di GitHub Pages.

## Catatan Workspace

Folder asset runtime yang dipakai aplikasi:

- `public/assets/voice/`
- `public/assets/team-photos/`
- `public/assets/models/`
