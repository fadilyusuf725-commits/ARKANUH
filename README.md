# ARKANUH v2 - Flipbook AR Kisah Nabi Nuh

Website mobile-first untuk pembelajaran interaktif PAI kelas 2 SD berbasis Kurikulum Merdeka.

## Alur Utama

1. Menu utama (`/`) menampilkan 4 menu:
   - Mulai
   - Biodata Penulis
   - CP/TP/ATP
   - Pretest
2. Pretest 10 soal (`/pretest`) wajib selesai sebelum akses flipbook.
3. Flipbook AR 10 halaman (`/flipbook/:pageId`) dengan voice over dan aktivitas.
4. Setelah halaman 10, siswa lanjut posttest 10 soal (`/posttest`).
5. Hasil akhir (`/hasil-akhir`) menampilkan perbandingan pretest vs posttest.

## Routes

- `/` menu hub
- `/pretest`
- `/biodata-penulis`
- `/cp-tp-atp`
- `/mulai`
- `/flipbook/:pageId`
- `/posttest`
- `/hasil-akhir`
- `/404`

## Kontrak Penyimpanan Lokal v2

- `localStorage["arkanuh_v2_session_current"]`
- `localStorage["arkanuh_v2_session_history"]`

## Jalankan Proyek

1. Install Node.js 18+.
2. Install dependency:

```bash
npm install
```

3. Development:

```bash
npm run dev
```

4. Build production:

```bash
npm run build
```

## Catatan AR

- Mode AR: marker-based (A-Frame + AR.js).
- Marker demo: `public/assets/markers/hiro.png`.
- Buka di Chrome Android dan izinkan kamera.
