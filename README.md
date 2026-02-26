# ARKANUH v3 - Single-Canvas Flipbook Pop-up 3D

Website mobile-first untuk pembelajaran PAI kelas 2 SD (Kurikulum Merdeka) dengan alur:
Pretest wajib -> Flipbook 10 halaman -> Posttest -> Hasil akhir.

## Alur Utama

1. Beranda (`/`) menampilkan dashboard ikon 2x3:
   - Mulai
   - Pretest
   - Posttest (locked sampai flipbook selesai)
   - CP TP ATP
   - Biodata
   - Hasil
2. Pretest 10 soal (`/pretest`) wajib selesai sebelum membuka menu Mulai.
3. Flipbook (`/flipbook/:pageId`) memakai satu kanvas 3D:
   - cover intro
   - animasi buku turun
   - 1 flip = 1 halaman
   - halaman terakhir animasi buku berdiri dan menutup (back cover kesimpulan)
4. Posttest 10 soal (`/posttest`) hanya terbuka setelah 10 halaman selesai.
5. Hasil akhir (`/hasil-akhir`) menampilkan perbandingan pretest vs posttest.

## Fitur Flipbook v3

- Tanpa kamera/marker.
- Semua elemen buku + popup berada dalam satu WebGL canvas (`three` + `@react-three/fiber` + `@react-three/drei`).
- Popup 3D dapat dilihat 360 derajat (drag + auto rotate + reset view).
- Narasi per halaman 40-55 kata.
- Voice over prioritas file audio prerender, fallback ke browser TTS jika file belum tersedia.

## Voice Over Gratis (Edge-TTS)

Generate file audio ke `public/assets/voice/page-01.mp3` s.d `page-10.mp3`:

```bash
npm run voice:edge
```

Prasyarat:

1. Python 3.10+ terpasang.
2. Paket `edge-tts` terpasang:

```bash
pip install edge-tts
```

Script generator: `scripts/generate-voice-edge.ps1`.

## Routes

- `/`
- `/pretest`
- `/biodata-penulis`
- `/cp-tp-atp`
- `/mulai`
- `/flipbook/:pageId`
- `/posttest`
- `/hasil-akhir`
- `/404`

## Kontrak Penyimpanan Lokal

- `localStorage["arkanuh_v2_session_current"]`
- `localStorage["arkanuh_v2_session_history"]`

Riwayat disimpan maksimal 25 sesi terbaru.

## Jalankan Proyek

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
```

Konfigurasi deploy GitHub Pages tetap kompatibel dengan `base: /ARKANUH/`.
