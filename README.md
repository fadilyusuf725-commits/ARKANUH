# ARKANUH v4 - Unity WebGL Hybrid + React Learning Flow

ARKANUH v4 memakai arsitektur **hybrid**:

- React tetap memegang alur pembelajaran (menu, pretest, posttest, hasil, guard, storage).
- Unity WebGL menjadi renderer utama untuk flipbook 3D.

Target utama: kualitas visual lebih baik di HP Android dengan performa stabil (30-45 FPS).

## Alur Utama

1. Beranda (`/`) menampilkan menu ikon:
   - Mulai
   - Pretest
   - Posttest (locked)
   - CP TP ATP
   - Biodata
   - Hasil
2. Pretest wajib selesai sebelum masuk flipbook.
3. Flipbook 10 halaman di `/flipbook/:pageId` memakai Unity WebGL canvas.
4. Aktivitas halaman tetap di React (`InteractionCard`) sebagai pengunci lanjut.
5. Halaman 10 menutup buku (final close), lalu lanjut ke posttest.
6. Hasil akhir membandingkan skor pretest vs posttest.

## Struktur Unity WebGL

Build Unity diletakkan di:

- `public/unity/Build/*`
- `public/unity/StreamingAssets/*` (opsional)

File default yang dipakai loader:

- `ARKANUHBook.loader.js`
- `ARKANUHBook.data.unityweb`
- `ARKANUHBook.framework.js.unityweb`
- `ARKANUHBook.wasm.unityweb`

Saat ini repo menyediakan placeholder/mock loader agar integrasi React-Unity bisa diuji. Ganti file tersebut dengan hasil export Unity final.

## Bridge React-Unity

Kontrak command (React -> Unity):

- `LOAD_PAGE`
- `SET_CAN_ADVANCE`
- `RESET_VIEW`
- `PLAY_FINAL_CLOSE`

Kontrak event (Unity -> React):

- `UNITY_READY`
- `REQUEST_NEXT_PAGE`
- `REQUEST_PREV_PAGE`
- `FINAL_CLOSE_DONE`

Implementasi bridge ada di:

- `src/lib/unityBridge.ts`
- `src/components/UnityFlipbookCanvas.tsx`

## Voice Over Rekaman Pribadi

Format target:

- `public/assets/voice/page-01.mp3` sampai `page-10.mp3`

Player:

- Prioritas audio file MP3
- Fallback ke browser TTS jika file tidak ada/rusak

### Proses Audio Rekaman (Normalisasi + Noise Reduction Ringan)

Siapkan rekaman mentah di folder `voice-raw` lalu jalankan:

```bash
npm run voice:process
```

Script:

- `scripts/process-voice.ps1`

Butuh `ffmpeg` terpasang.

## Kontrak Penyimpanan Lokal

- `localStorage["arkanuh_v2_session_current"]`
- `localStorage["arkanuh_v2_session_history"]`

Riwayat maksimal 25 sesi terbaru.

## Jalankan Proyek

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
```

Deploy GitHub Pages tetap menggunakan `base: /ARKANUH/`.
