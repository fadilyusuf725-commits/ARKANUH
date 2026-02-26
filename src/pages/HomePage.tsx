import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { flipbookPages } from "../data/flipbookPages";
import { useSessionContext } from "../state/SessionContext";

export function HomePage() {
  const navigate = useNavigate();
  const { session, setNickname, restartSession } = useSessionContext();
  const [nicknameInput, setNicknameInput] = useState(session.profile.nickname);

  const pretestDone = session.pretest.completed;
  const flipbookDone = session.flipbook.completed;
  const posttestDone = session.posttest.completed;

  const onSaveIdentity = (event: FormEvent) => {
    event.preventDefault();
    setNickname(nicknameInput);
  };

  const onStartNewSession = () => {
    restartSession(nicknameInput);
    navigate("/");
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">ARKANUH v2</p>
        <h1>Flipbook Pop-up 3D Kisah Nabi Nuh</h1>
        <p className="subtitle">Menu utama pembelajaran interaktif PAI kelas 2 SD</p>
        <p>
          Pilih menu belajar yang tersedia. Pretest wajib selesai sebelum menu Mulai membuka flipbook 10 halaman.
        </p>
      </section>

      <section className="card">
        <h2>Identitas Sesi</h2>
        <form className="stack-form" onSubmit={onSaveIdentity}>
          <label htmlFor="nickname">Nama panggilan siswa</label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            value={nicknameInput}
            onChange={(event) => setNicknameInput(event.target.value)}
            placeholder="Contoh: Aisyah"
            maxLength={24}
          />
          <div className="button-row">
            <button type="submit" className="btn btn-primary">
              Simpan Nama
            </button>
            <button type="button" className="btn btn-outline" onClick={onStartNewSession}>
              Sesi Baru
            </button>
          </div>
        </form>
      </section>

      <section className="menu-grid">
        <article className="menu-card">
          <p className="eyebrow">Menu</p>
          <h3>Mulai Flipbook</h3>
          <p>Masuk ke halaman cerita 1-10 dengan pop-up 3D. Terkunci jika pretest belum selesai.</p>
          <div className="menu-card-foot">
            {!pretestDone && <span className="lock-badge">Terkunci</span>}
            <Link to={pretestDone ? "/mulai" : "/pretest"} className="btn btn-primary inline-btn-link">
              {pretestDone ? "Masuk" : "Kerjakan Pretest"}
            </Link>
          </div>
        </article>

        <article className="menu-card">
          <p className="eyebrow">Menu</p>
          <h3>Biodata Penulis</h3>
          <p>Lihat profil penulis dan informasi hak cipta aset pembelajaran.</p>
          <div className="menu-card-foot">
            <Link to="/biodata-penulis" className="btn btn-outline inline-btn-link">
              Buka
            </Link>
          </div>
        </article>

        <article className="menu-card">
          <p className="eyebrow">Menu</p>
          <h3>CP / TP / ATP</h3>
          <p>Ringkasan kurikulum merdeka PAI kelas 2 terkait materi kisah Nabi Nuh.</p>
          <div className="menu-card-foot">
            <Link to="/cp-tp-atp" className="btn btn-outline inline-btn-link">
              Buka
            </Link>
          </div>
        </article>

        <article className="menu-card">
          <p className="eyebrow">Menu</p>
          <h3>Pretest 10 Soal</h3>
          <p>Evaluasi awal sebelum memulai flipbook. Urutan soal diacak setiap sesi baru.</p>
          <div className="menu-card-foot">
            <Link to="/pretest" className="btn btn-primary inline-btn-link">
              {pretestDone ? "Lihat Hasil Pretest" : "Mulai Pretest"}
            </Link>
          </div>
        </article>
      </section>

      <section className="card">
        <h2>Status Belajar</h2>
        <ul>
          <li>Pretest: {pretestDone ? `Selesai (${session.pretest.score}/10)` : "Belum selesai"}</li>
          <li>
            Flipbook: {session.flipbook.completedPages.length}/{flipbookPages.length} halaman{" "}
            {flipbookDone ? "(Selesai)" : ""}
          </li>
          <li>Posttest: {posttestDone ? `Selesai (${session.posttest.score}/10)` : "Belum selesai"}</li>
        </ul>
      </section>
    </main>
  );
}
