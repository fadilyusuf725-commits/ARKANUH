# ARKANUH v4

ARKANUH adalah web pembelajaran kisah Nabi Nuh untuk kelas 2 SD dengan arsitektur hybrid:

- React untuk alur belajar (menu, pretest, posttest, hasil, penyimpanan lokal)
- Unity WebGL untuk visual buku 3D dalam satu kanvas

## Alur Belajar

1. Beranda (`/`) menampilkan menu ikon:
   - Mulai
   - Pretest
   - Posttest (locked sebelum flipbook selesai)
   - Mini Game (link eksternal ZEP)
   - CP TP ATP
   - Biodata
   - Hasil
2. Pretest wajib selesai sebelum masuk flipbook.
3. Flipbook 10 halaman berjalan di `/flipbook/:pageId`.
4. Setelah halaman 10 selesai, lanjut ke posttest.
5. Hasil akhir menampilkan perbandingan skor pretest dan posttest.

## Mini Game

Menu Mini Game membuka:

- `https://quiz.zep.us/id/play/EgQEOp`

Mode mini game saat ini bersifat mandiri (tidak sinkron nilai ke session ARKANUH).

## Routing GitHub Pages

Project memakai:

- `base: /ARKANUH/` di Vite
- `BrowserRouter basename={import.meta.env.BASE_URL}`
- fallback SPA `dist/404.html` otomatis dibuat saat build (`postbuild`)

Tujuan: URL langsung/reload seperti `/ARKANUH/pretest` atau `/ARKANUH/flipbook/1` tetap dapat dibuka.

## Unity WebGL

Build Unity berada di:

- `public/unity/Build/*`

Script build:

```bash
npm run unity:build:dev
npm run unity:build:release
npm run unity:build:all
```

## Integrasi Model Meshy

`BookVisualBuilder` mendukung prefab template:

- `arkPrefab`
- `rainPrefab`
- `mountainPrefab`
- `wavePrefab`
- `lightPrefab`

Jika prefab diisi, Unity memakai prefab. Jika kosong, Unity fallback ke geometri procedural.

Prompt Meshy tersedia di:

- `docs/MESHY_PROMPTS_ARKANUH.md`

## Voice Over

Audio halaman:

- `public/assets/voice/page-01.mp3` s.d `page-10.mp3`

Player memprioritaskan MP3, lalu fallback ke browser TTS jika audio tidak tersedia.

## Penyimpanan Lokal

- `localStorage["arkanuh_v2_session_current"]`
- `localStorage["arkanuh_v2_session_history"]`

Riwayat disimpan maksimal 25 sesi terbaru.

## Menjalankan Proyek

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
```

## Troubleshooting

1. Jika halaman live tidak update, lakukan hard refresh atau mode samaran.
2. Jika Unity gagal memuat, pastikan file `public/unity/Build/*` tersedia dan jalankan `npm run unity:build:release`.
3. Jika route tertentu menjadi 404, pastikan output build memiliki `dist/404.html`.
