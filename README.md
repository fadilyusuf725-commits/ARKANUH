# ARKANUH v2 - Flipbook Pop-up 3D Kisah Nabi Nuh

Website mobile-first untuk pembelajaran interaktif PAI kelas 2 SD berbasis Kurikulum Merdeka.

## Alur Utama

1. Menu utama (`/`) menampilkan 4 menu:
   - Mulai
   - Biodata Penulis
   - CP/TP/ATP
   - Pretest
2. Pretest 10 soal (`/pretest`) wajib selesai sebelum akses flipbook.
3. Flipbook pop-up 3D 10 halaman (`/flipbook/:pageId`) dengan voice over dan aktivitas.
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

## Catatan Flipbook 3D

- Flipbook memakai efek page-turn ala buku digital (tanpa kamera).
- Pop-up 3D memakai Three.js dan dapat diputar 360 derajat.
- Teks mengambang tampil di samping pada desktop dan otomatis pindah ke bawah pada mobile.
