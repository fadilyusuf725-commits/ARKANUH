# ARKANUH v4 (React + Unity WebGL Hybrid)

ARKANUH adalah web pembelajaran kisah Nabi Nuh untuk kelas 2 SD.

- React mengelola alur belajar (`pretest -> flipbook -> posttest -> hasil`) dan session lokal.
- Unity WebGL merender pop-up book 3D di modul flipbook.

## Alur Pembelajaran

1. Beranda (`/`) berisi menu ikon: Mulai, Pretest, Posttest, Mini Game, CP TP ATP, Biodata, Hasil.
2. Pretest wajib selesai sebelum masuk `/mulai` dan `/flipbook/:pageId`.
3. Flipbook berjalan 10 halaman (`/flipbook/1` s.d `/flipbook/10`).
4. Halaman terakhir memicu final close lalu lanjut `/posttest`.
5. Hasil akhir tampil di `/hasil-akhir`.

## Routing GitHub Pages

Konfigurasi agar aman saat reload/deep-link:

- Vite `base: /ARKANUH/`
- `BrowserRouter basename={import.meta.env.BASE_URL}`
- `postbuild` otomatis membuat `dist/404.html` sebagai fallback SPA

## Pipeline Flipbook dari PPTX

1. Simpan file sumber di folder:
   - `assets/flipbook/source/`
   - default yang dipakai saat ini: `KISAH NABI NUH (1).pptx`
2. Jalankan:
   - `npm run flipbook:prepare`
3. Output:
   - gambar: `public/assets/flipbook/pages/page-01.webp` s.d `page-10.webp`
   - voice: `public/assets/voice/page-01.wav` s.d `page-09.wav`

Catatan:

- Script menggunakan PowerPoint COM untuk export slide.
- Mapping slide dikunci: `slide 3..12` -> `page 01..10`.
- Halaman 10 tidak punya file voice dari PPT sehingga akan otomatis fallback ke TTS browser.
- Optimasi gambar menggunakan `sharp` (resize longest side 1600 px, WebP quality default 80).

## Pipeline Model 3D dari Link Publik

1. Isi mapping URL model:
   - `assets/model-links/page-model-links.json`
   - format: 10 entri, `pageId` 1-10, `sourceType` (`tripo_page` / `direct_file` / `none`)
2. Unduh model ke folder Unity Incoming:
   - `npm run models:fetch`
3. Hasil resolve URL disimpan ke:
   - `assets/model-links/.resolved-model-links.json`
4. Di Unity, jalankan menu:
   - `ARKANUH > Models > Rebuild Page Model Registry`

Output Unity pipeline:

- model mentah: `unity/ARKANUHBook/Assets/Models/Incoming/page-XX.glb|fbx`
- prefab final: `unity/ARKANUHBook/Assets/Prefabs/PageModels/page-01..page-09.prefab`
- registry: `unity/ARKANUHBook/Assets/Resources/PageModelRegistry.asset`
- halaman 10 (`sourceType: none`) sengaja tidak punya model dan dirender sebagai back-cover scene.

Catatan penting:

- Package Unity `com.unity.meshopt.decompress@0.1.0-preview.7` wajib terpasang agar GLB Tripo (meshopt) bisa diimport.
- URL Tripo bertipe signed URL dan bisa kedaluwarsa, jadi jalankan ulang `npm run models:fetch` saat model gagal dibaca.

## Integrasi React -> Unity Payload

Setiap halaman mengirim payload:

- `id`
- `title`
- `popupTemplate`
- `popupAccent`
- `floatingText`
- `modelKey` (contoh `page-01`)
- `pageTexture` (contoh `/assets/flipbook/pages/page-01.webp`)

Jika prefab model tidak ditemukan di registry, Unity fallback ke template procedural.

## Build dan Deploy

Jalankan lokal:

```bash
npm install
npm run dev
```

Build web:

```bash
npm run build
```

Build Unity release:

```bash
npm run unity:build:release
```

Siapkan semua aset sekali jalan:

```bash
npm run assets:prepare
```

## Voice Over

- Prioritas audio file: `public/assets/voice/page-01.wav` s.d `page-09.wav`
- Jika audio tidak tersedia, player fallback ke browser TTS

## Session Storage

- `localStorage["arkanuh_v2_session_current"]`
- `localStorage["arkanuh_v2_session_history"]`

Riwayat disimpan maksimum 25 sesi.

## QA Checklist Sebelum Deploy

1. `npm run flipbook:prepare` menghasilkan 10 halaman WebP + 9 file WAV.
2. `npm run models:fetch` berhasil unduh model halaman 1-9 dan skip halaman 10.
3. `assets/model-links/.resolved-model-links.json` terisi hasil resolve terbaru.
4. Unity menu `Rebuild Page Model Registry` sukses tanpa error.
4. `npm run unity:build:release` selesai dan file `public/unity/Build/*` ada.
5. `npm run build` sukses.
6. Deep-link `/ARKANUH/pretest` dan `/ARKANUH/flipbook/1` aman saat refresh.
7. Flipbook halaman 1-9 menampilkan model sesuai page dan halaman 10 tampil sebagai back-cover tanpa error.
