# ARKANUH

ARKANUH adalah web pembelajaran kisah Nabi Nuh untuk kelas 2 SD dengan alur:

`Pretest -> Mulai -> Posttest -> Hasil`

## Arsitektur Aktif

- Frontend: React + TypeScript + Vite
- Routing: `BrowserRouter` dengan `basename={import.meta.env.BASE_URL}`
- Reader: iframe Heyzine di route `/mulai`
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

- Buku dibuka melalui iframe Heyzine:
  - `https://heyzine.com/flip-book/88f0fa4179.html#page/20`
- Pengguna membalik buku langsung di iframe.
- Teks cerita dan audio ada di panel bawah.
- Sinkronisasi halaman dilakukan manual dengan memilih `Hal 1-10`.
- Halaman dianggap selesai saat dipilih di panel bawah.
- Posttest terbuka setelah 10 halaman selesai.
- Link referensi aset 3D tetap tersedia per halaman, tetapi viewer 3D inline dinonaktifkan sementara demi stabilitas.

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
npm run dev
```

## Build Produksi

```bash
npm run build
```

`postbuild` otomatis membuat `dist/404.html` untuk fallback SPA di GitHub Pages.

## Catatan Authoring

Tool authoring yang masih dipertahankan:

- `scripts/create-nabi-nuh-presentation.py`
- `scripts/create-spa-fallback.mjs`

Sumber materi presentasi disimpan di:

- `assets/flipbook/source/`
