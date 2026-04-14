import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { flipbookPages, getFirstIncompleteFlipbookPageId } from "../data/flipbookPages";
import { useSessionContext } from "../state/SessionContext";

type MenuIconCardProps = {
  icon: string;
  label: string;
  description: string;
  to?: string;
  href?: string;
  onClick?: () => void;
  locked?: boolean;
  lockText?: string;
  featured?: boolean;
};

function MenuIconCard({ icon, label, description, to, href, onClick, locked, lockText, featured }: MenuIconCardProps) {
  const className = ["icon-menu-card", locked ? "is-locked" : "", featured ? "is-featured" : ""]
    .filter(Boolean)
    .join(" ");

  if (locked) {
    return (
      <button type="button" className={className} disabled aria-label={`${label} terkunci`}>
        <span className="icon-emoji" aria-hidden="true">
          {icon}
        </span>
        <span className="icon-kicker">{description}</span>
        <span className="icon-label">{label}</span>
        <span className="icon-lock-text">{lockText ?? "Terkunci"}</span>
      </button>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={className}
        aria-label={`Buka menu ${label}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="icon-emoji" aria-hidden="true">
          {icon}
        </span>
        <span className="icon-kicker">{description}</span>
        <span className="icon-label">{label}</span>
      </a>
    );
  }

  if (onClick) {
    return (
      <button type="button" className={className} aria-label={`Buka ${label}`} onClick={onClick}>
        <span className="icon-emoji" aria-hidden="true">
          {icon}
        </span>
        <span className="icon-kicker">{description}</span>
        <span className="icon-label">{label}</span>
      </button>
    );
  }

  if (to) {
    return (
      <Link to={to} className={className} aria-label={`Buka menu ${label}`}>
        <span className="icon-emoji" aria-hidden="true">
          {icon}
        </span>
        <span className="icon-kicker">{description}</span>
        <span className="icon-label">{label}</span>
      </Link>
    );
  }

  return (
    <button type="button" className={className} disabled aria-label={`${label} tidak tersedia`}>
      <span className="icon-emoji" aria-hidden="true">
        {icon}
      </span>
      <span className="icon-kicker">{description}</span>
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
  const firstIncompletePageId = getFirstIncompleteFlipbookPageId(session.flipbook.completedPages);

  const onSaveIdentity = (event: FormEvent) => {
    event.preventDefault();
    setNickname(nicknameInput);
  };

  const onStartNewSession = () => {
    restartSession(nicknameInput);
    navigate("/menu");
  };

  const onOpenFlipbook = () => {
    navigate(`/mulai?page=${firstIncompletePageId}`, { replace: true });
  };

  const primaryAction = !pretestDone
    ? {
        label: "Kerjakan Pretest",
        supporting: "Mulai dengan tes awal singkat untuk membuka akses ke cerita.",
        to: "/pretest"
      }
    : !flipbookDone
      ? {
          label: `Lanjutkan Halaman ${firstIncompletePageId}`,
          supporting: "Baca cerita dengan viewer 3D utama dan buku mini yang tetap sinkron.",
          to: `/mulai?page=${firstIncompletePageId}`
        }
      : !posttestDone
        ? {
            label: "Kerjakan Posttest",
            supporting: "Semua halaman selesai dibaca. Saatnya cek pemahaman akhir.",
            to: "/posttest"
          }
        : {
            label: "Lihat Hasil Belajar",
            supporting: "Bandingkan skor awal dan akhir untuk melihat peningkatan belajar.",
            to: "/hasil-akhir"
          };

  const menuCards = [
    {
      icon: "\u{1F4D8}",
      label: "Mulai",
      description: "Cerita & 3D",
      onClick: pretestDone ? onOpenFlipbook : undefined,
      locked: !pretestDone,
      lockText: pretestDone ? undefined : "Pretest dulu",
      featured: pretestDone && !flipbookDone
    },
    {
      icon: "\u{1F9E0}",
      label: "Pretest",
      description: "Tes awal",
      to: "/pretest",
      featured: !pretestDone
    },
    {
      icon: "\u{1F3C1}",
      label: "Posttest",
      description: "Tes akhir",
      to: flipbookDone ? "/posttest" : undefined,
      locked: !flipbookDone,
      lockText: "Selesaikan buku",
      featured: flipbookDone && !posttestDone
    },
    {
      icon: "\u{1F3AE}",
      label: "Mini Game",
      description: "Latihan bonus",
      href: "https://quiz.zep.us/id/play/EgQEOp"
    },
    {
      icon: "\u{1F4DA}",
      label: "CP TP ATP",
      description: "Acuan guru",
      to: "/cp-tp-atp"
    },
    {
      icon: "\u{1F4D6}",
      label: "Panduan",
      description: "Cara pakai",
      to: "/panduan-penggunaan"
    },
    {
      icon: "\u{270D}\u{FE0F}",
      label: "Biodata",
      description: "Tim pengembang",
      to: "/biodata-penulis"
    },
    {
      icon: "\u{1F3C6}",
      label: "Hasil",
      description: "Ringkasan nilai",
      to: posttestDone ? "/hasil-akhir" : undefined,
      locked: !posttestDone,
      lockText: "Posttest dulu"
    }
  ];

  return (
    <main className="home-shell">
      <section className="home-topbar home-hero-panel">
        <div className="home-brand">
          <p className="eyebrow">Menu Utama</p>
          <h1>ARKANUH</h1>
          <p>Flipbook Kisah Nabi Nuh dengan viewer 3D utama, buku mini, dan evaluasi belajar.</p>
          <div className="home-primary-panel">
            <p className="eyebrow">Langkah Berikutnya</p>
            <h2>{primaryAction.label}</h2>
            <p>{primaryAction.supporting}</p>
            <div className="button-row">
              <Link to={primaryAction.to} className="btn btn-primary inline-btn-link">
                {primaryAction.label}
              </Link>
              <Link to="/panduan-penggunaan" className="btn btn-outline inline-btn-link">
                Lihat Panduan
              </Link>
            </div>
          </div>
        </div>
        <form className="mini-identity-form home-identity-card" onSubmit={onSaveIdentity}>
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

      <section className="home-status-strip">
        <article className="home-stat">
          <span className="home-stat-label">Pretest</span>
          <strong>{pretestDone ? `${session.pretest.score}/10` : "-"}</strong>
          <p>{pretestDone ? "Tes awal sudah selesai." : "Kerjakan lebih dulu untuk membuka cerita."}</p>
        </article>
        <article className="home-stat">
          <span className="home-stat-label">Cerita</span>
          <strong>{session.flipbook.completedPages.length}/{flipbookPages.length}</strong>
          <p>{flipbookDone ? "Semua halaman telah dibaca." : `Halaman berikutnya: ${firstIncompletePageId}.`}</p>
        </article>
        <article className="home-stat">
          <span className="home-stat-label">Posttest</span>
          <strong>{posttestDone ? `${session.posttest.score}/10` : "-"}</strong>
          <p>{posttestDone ? "Ringkasan hasil sudah bisa dibuka." : "Aktif setelah seluruh cerita selesai."}</p>
        </article>
      </section>

      <section className="icon-menu-grid" aria-label="Menu utama">
        {menuCards.map((menu) => (
          <MenuIconCard
            key={menu.label}
            icon={menu.icon}
            label={menu.label}
            description={menu.description}
            to={menu.to}
            href={menu.href}
            onClick={menu.onClick}
            locked={menu.locked}
            lockText={menu.lockText}
            featured={menu.featured}
          />
        ))}
      </section>
    </main>
  );
}
