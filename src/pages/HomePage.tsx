import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storyPages } from "../data/storyPages";
import { useSessionContext } from "../state/SessionContext";

export function HomePage() {
  const navigate = useNavigate();
  const { session, history, setNickname } = useSessionContext();
  const [nicknameInput, setNicknameInput] = useState(session.nickname);

  const continuePath = useMemo(() => {
    if (session.quizScore !== null) {
      return "/hasil";
    }
    const firstIncomplete = storyPages.find((page) => !session.completedPages.includes(page.id));
    return firstIncomplete ? `/buku/${firstIncomplete.id}` : "/kuis";
  }, [session.completedPages, session.quizScore]);

  const onStart = (event: FormEvent) => {
    event.preventDefault();
    setNickname(nicknameInput);
    navigate(continuePath);
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Media Pembelajaran Interaktif</p>
        <h1>ARKANUH</h1>
        <p className="subtitle">Augmented Reality Arka Nuh untuk siswa kelas 2 SD</p>
        <p>
          Petualangan pop-up book ini mengajakmu belajar kisah Nabi Nuh dengan AR marker-based, narasi suara, aktivitas
          sederhana, dan kuis pemahaman.
        </p>
      </section>

      <section className="card">
        <h2>Mulai Belajar</h2>
        <form className="stack-form" onSubmit={onStart}>
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
          <button type="submit" className="btn btn-primary">
            {session.completedPages.length > 0 ? "Lanjutkan Belajar" : "Mulai dari Halaman 1"}
          </button>
        </form>
        <div className="quick-stats">
          <span>Halaman selesai: {session.completedPages.length}/10</span>
          <span>Riwayat sesi: {history.length}</span>
        </div>
      </section>

      <section className="card">
        <h2>Petunjuk Singkat</h2>
        <ol>
          <li>Buka setiap halaman cerita dan aktifkan kamera AR.</li>
          <li>Selesaikan aktivitas halaman agar tombol Lanjut terbuka.</li>
          <li>Dengarkan narasi suara untuk memperkuat pemahaman.</li>
          <li>Setelah halaman 10, kerjakan kuis dan lihat hasilmu.</li>
        </ol>
      </section>
    </main>
  );
}
