import { useState } from "react";
import { Link } from "react-router-dom";

type CurriculumTab = "cp" | "tp" | "atp";

export function CurriculumPage() {
  const [activeTab, setActiveTab] = useState<CurriculumTab>("cp");

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Kurikulum Merdeka</p>
        <h1>CP, TP, dan ATP</h1>
        <p className="subtitle">PAI Kelas 2 (Fase A) untuk materi kisah Nabi Nuh.</p>
      </section>

      <section className="card">
        <div className="tab-row" role="tablist" aria-label="Tab CP TP ATP">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "cp"}
            className={`tab-button ${activeTab === "cp" ? "is-active" : ""}`}
            onClick={() => setActiveTab("cp")}
          >
            CP
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "tp"}
            className={`tab-button ${activeTab === "tp" ? "is-active" : ""}`}
            onClick={() => setActiveTab("tp")}
          >
            TP
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "atp"}
            className={`tab-button ${activeTab === "atp" ? "is-active" : ""}`}
            onClick={() => setActiveTab("atp")}
          >
            ATP
          </button>
        </div>

        {activeTab === "cp" && (
          <div className="tab-panel" role="tabpanel">
            <h2>Capaian Pembelajaran (CP)</h2>
            <p>
              Peserta didik mengenal kisah nabi dan meneladani nilai keimanan, ketaatan, kesabaran, serta akhlak baik
              dalam kehidupan sehari-hari.
            </p>
          </div>
        )}

        {activeTab === "tp" && (
          <div className="tab-panel" role="tabpanel">
            <h2>Tujuan Pembelajaran (TP)</h2>
            <ol>
              <li>Siswa menceritakan kembali inti kisah Nabi Nuh secara sederhana.</li>
              <li>Siswa mengidentifikasi sikap taat, sabar, dan jujur dari kisah.</li>
              <li>Siswa menunjukkan perilaku teladan dalam situasi sederhana di sekolah/rumah.</li>
            </ol>
          </div>
        )}

        {activeTab === "atp" && (
          <div className="tab-panel" role="tabpanel">
            <h2>Alur Tujuan Pembelajaran (ATP)</h2>
            <ol>
              <li>Aktivasi pengetahuan awal melalui pretest.</li>
              <li>Eksplorasi cerita Nabi Nuh lewat flipbook pop-up 3D 10 halaman.</li>
              <li>Penguatan pemahaman dengan aktivitas interaktif dan voice over.</li>
              <li>Evaluasi akhir melalui posttest dan refleksi hasil belajar.</li>
            </ol>
          </div>
        )}
      </section>

      <section className="card">
        <Link to="/" className="btn btn-outline inline-btn-link">
          Kembali ke Menu
        </Link>
      </section>
    </main>
  );
}
