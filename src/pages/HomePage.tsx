import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { flipbookPages } from "../data/flipbookPages";
import { useSessionContext } from "../state/SessionContext";

type MenuIconCardProps = {
  icon: string;
  label: string;
  to?: string;
  href?: string;
  locked?: boolean;
  lockText?: string;
};

function MenuIconCard({ icon, label, to, href, locked, lockText }: MenuIconCardProps) {
  if (locked) {
    return (
      <button type="button" className="icon-menu-card is-locked" disabled aria-label={`${label} terkunci`}>
        <span className="icon-emoji" aria-hidden="true">
          {icon}
        </span>
        <span className="icon-label">{label}</span>
        <span className="icon-lock-text">{lockText ?? "Terkunci"}</span>
      </button>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className="icon-menu-card"
        aria-label={`Buka menu ${label}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="icon-emoji" aria-hidden="true">
          {icon}
        </span>
        <span className="icon-label">{label}</span>
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className="icon-menu-card" aria-label={`Buka menu ${label}`}>
        <span className="icon-emoji" aria-hidden="true">
          {icon}
        </span>
        <span className="icon-label">{label}</span>
      </Link>
    );
  }

  return (
    <button type="button" className="icon-menu-card is-locked" disabled aria-label={`${label} tidak tersedia`}>
      <span className="icon-emoji" aria-hidden="true">
        {icon}
      </span>
      <span className="icon-label">{label}</span>
      <span className="icon-lock-text">Belum tersedia</span>
    </button>
  );
}

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

  const menuCards = useMemo(
    () => [
      {
        icon: "📘",
        label: "Mulai",
        to: pretestDone ? "/mulai" : undefined,
        locked: !pretestDone,
        lockText: "Pretest dulu"
      },
      {
        icon: "🧠",
        label: "Pretest",
        to: "/pretest"
      },
      {
        icon: "🏁",
        label: "Posttest",
        to: flipbookDone ? "/posttest" : undefined,
        locked: !flipbookDone,
        lockText: "Selesaikan buku"
      },
      {
        icon: "🎮",
        label: "Mini Game",
        href: "https://quiz.zep.us/id/play/EgQEOp"
      },
      {
        icon: "📚",
        label: "CP TP ATP",
        to: "/cp-tp-atp"
      },
      {
        icon: "✍️",
        label: "Biodata",
        to: "/biodata-penulis"
      },
      {
        icon: "🏆",
        label: "Hasil",
        to: posttestDone ? "/hasil-akhir" : undefined,
        locked: !posttestDone,
        lockText: "Posttest dulu"
      }
    ],
    [flipbookDone, posttestDone, pretestDone]
  );

  return (
    <main className="home-shell">
      <section className="home-topbar">
        <div className="home-brand">
          <h1>ARKANUH</h1>
          <p>Flipbook Pop-up 3D</p>
        </div>
        <form className="mini-identity-form" onSubmit={onSaveIdentity}>
          <label htmlFor="nickname">Nama</label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            value={nicknameInput}
            onChange={(event) => setNicknameInput(event.target.value)}
            maxLength={24}
            placeholder="Nama panggilan"
          />
          <div className="button-row">
            <button type="submit" className="btn btn-primary">
              Simpan
            </button>
            <button type="button" className="btn btn-outline" onClick={onStartNewSession}>
              Sesi Baru
            </button>
          </div>
        </form>
      </section>

      <section className="icon-menu-grid" aria-label="Menu utama">
        {menuCards.map((menu) => (
          <MenuIconCard
            key={menu.label}
            icon={menu.icon}
            label={menu.label}
            to={menu.to}
            href={menu.href}
            locked={menu.locked}
            lockText={menu.lockText}
          />
        ))}
      </section>

      <section className="home-status-strip">
        <p>
          <strong>Pretest:</strong> {pretestDone ? `${session.pretest.score}/10` : "-"}
        </p>
        <p>
          <strong>Cerita:</strong> {session.flipbook.completedPages.length}/{flipbookPages.length}
        </p>
        <p>
          <strong>Posttest:</strong> {posttestDone ? `${session.posttest.score}/10` : "-"}
        </p>
      </section>
    </main>
  );
}
