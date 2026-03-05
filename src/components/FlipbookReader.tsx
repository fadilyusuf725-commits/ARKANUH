import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { flipbookPages } from "../data/flipbookPages";
import "../styles/flipbook.css";

declare global {
  interface Window {
    St: { PageFlip: any };
  }
}

let PageFlip: any = null;

const loadPageFlip = async () => {
  if (PageFlip) return PageFlip;
  const startTime = Date.now();
  while (!window.St?.PageFlip) {
    if (Date.now() - startTime > 5000) throw new Error("PageFlip timeout");
    await new Promise(r => setTimeout(r, 100));
  }
  PageFlip = window.St.PageFlip;
  console.log("✓ PageFlip loaded");
  return PageFlip;
};

type Props = {
  onPageChange?: (pageId: string, pageIndex: number) => void;
  autoPlayAudio?: boolean;
};

export function FlipbookReader({ onPageChange, autoPlayAudio = true }: Props) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const flipBookRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || isInitialized) return;

    (async () => {
      try {
        const PF = await loadPageFlip();
        if (!PF) throw new Error("PageFlip not available");

        const flipDiv = document.createElement("div");
        flipDiv.id = "flipbook";
        flipDiv.style.width = "100%";
        flipDiv.style.height = "100%";

        const pages: HTMLElement[] = [];

        // Cover
        const cover = document.createElement("div");
        cover.className = "flipbook-page cover-page";
        cover.innerHTML = `
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 100%; height: 100%; 
                      display: flex; flex-direction: column; align-items: center; justify-content: center; 
                      color: white; text-align: center; padding: 2rem;">
            <h1 style="font-size: 2.5rem; margin: 0; font-weight: bold;">KISAH NABI NUH</h1>
            <p style="font-size: 1.2rem; margin-top: 1rem;">Cerita Iman & Kesabaran</p>
            <div style="margin-top: 2rem; font-size: 4rem;">📖</div>
          </div>
        `;
        pages.push(cover);

        // Story pages
        flipbookPages.forEach((page) => {
          // Left
          const left = document.createElement("div");
          left.className = "flipbook-page left-page";
          left.style.background = "linear-gradient(to right, #f8f9fa 0%, #ffffff 100%)";
          left.style.padding = "2rem";
          left.style.overflowY = "auto";
          left.innerHTML = `
            <div style="height: 100%; display: flex; flex-direction: column;">
              <h2 style="color: #2c3e50; margin: 0 0 0.5rem 0; font-size: 1.3rem;">${page.title}</h2>
              <p style="color: #7f8c8d; font-size: 0.85rem; margin: 0 0 1rem 0;">Halaman ${page.id}</p>
              <div style="flex: 1; color: #34495e; line-height: 1.6; font-size: 0.95rem;">
                ${page.narration.split("\n").map(p => `<p>${p}</p>`).join("")}
              </div>
            </div>
          `;
          pages.push(left);

          // Right
          const right = document.createElement("div");
          right.className = "flipbook-page right-page";
          right.style.background = getPageGradient(page.id);
          right.style.display = "flex";
          right.style.alignItems = "center";
          right.style.justifyContent = "center";
          right.style.cursor = "pointer";
          right.innerHTML = `
            <div style="text-align: center; color: white; cursor: pointer; transition: transform 0.3s ease;">
              <div style="font-size: 5rem; margin-bottom: 1rem;">${getPageIcon(page.id)}</div>
              <h3 style="margin: 0; font-size: 1.3rem;">${page.floatingText || "Ilustrasi"}</h3>
              <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">${page.objective}</p>
            </div>
          `;
          pages.push(right);
        });

        // Back cover
        const back = document.createElement("div");
        back.className = "flipbook-page back-cover-page";
        back.innerHTML = `
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 100%; height: 100%; 
                      display: flex; flex-direction: column; align-items: center; justify-content: center; 
                      color: white; text-align: center; padding: 2rem;">
            <p style="font-size: 1.5rem; margin: 0; font-weight: 500;">"Kesabaran adalah kunci kesuksesan"</p>
            <p style="margin-top: 2rem; font-size: 1.1rem;">- Kisah Nabi Nuh</p>
          </div>
        `;
        pages.push(back);

        pages.forEach(p => flipDiv.appendChild(p));
        containerRef.current?.appendChild(flipDiv);
        console.log(`✓ Created ${pages.length} pages`);

        const flipBook = new PF(flipDiv, {
          width: 500,
          height: 650,
          size: "fixed",
          showCover: true,
          autoSize: false,
          maxShadowOpacity: 0.5,
          useMouseEvents: true,
          drawShadow: true,
          flips: pages.length,
          duration: 800,
          pages,
        });

        flipBookRef.current = flipBook;
        console.log("✓ PageFlip ready!");

        flipBook.on("change", (obj: any) => {
          const pageNum = obj.data;
          setCurrentPageIndex(pageNum);
          if (pageNum > 0) {
            const idx = Math.floor((pageNum - 1) / 2);
            if (idx >= 0 && idx < flipbookPages.length) {
              const pg = flipbookPages[idx];
              onPageChange?.(pg.id, idx);
              if (autoPlayAudio && audioRef.current && pageNum % 2 === 1) {
                audioRef.current.src = pg.voAudio;
                audioRef.current.play().catch(() => setIsPlaying(false));
                setIsPlaying(true);
              }
            }
          }
        });

        flipBook.on("flip", () => {
          if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
          }
        });

        setIsInitialized(true);
        setError(null);
        console.log("✓✓✓ ALL SET - Flipbook ready!");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error("✗ Flipbook error:", err);
        setError(`Error: ${msg}`);
      }
    })();

    return () => {
      try {
        flipBookRef.current?.destroy?.();
      } catch {}
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [isInitialized, onPageChange, autoPlayAudio]);

  const handlePrev = () => flipBookRef.current?.prevPage?.();
  const handleNext = () => flipBookRef.current?.nextPage?.();
  const handleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  };
  const handleBack = () => {
    audioRef.current?.pause();
    navigate("/", { replace: true });
  };

  if (error) {
    return (
      <div style={{ padding: "2rem", color: "red", textAlign: "center" }}>
        <h3>⚠️ Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flipbook-reader">
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="flipbook-canvas" ref={containerRef} />

      <div className="flipbook-controls">
        <button onClick={handlePrev} className="control-btn prev-btn">← Sebelumnya</button>
        <button onClick={handleAudio} className={`audio-btn ${isPlaying ? "playing" : ""}`}>
          {isPlaying ? "🔊 Pause" : "🔇 Play"}
        </button>
        <button onClick={handleNext} className="control-btn next-btn">Berikutnya →</button>
        <button onClick={handleBack} className="control-btn back-btn">🏠 Kembali</button>
      </div>

      <div className="page-indicator">
        {currentPageIndex === 0 ? "Cover" : `Halaman ${Math.floor((currentPageIndex - 1) / 2) + 1} / ${flipbookPages.length}`}
      </div>
    </div>
  );
}

function getPageGradient(id: string): string {
  const g: Record<string, string> = {
    "1": "linear-gradient(135deg, #8B7355 0%, #A67C52 100%)",
    "2": "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)",
    "3": "linear-gradient(135deg, #DAA520 0%, #FFD700 100%)",
    "4": "linear-gradient(135deg, #696969 0%, #808080 100%)",
    "5": "linear-gradient(135deg, #A0522D 0%, #CD853F 100%)",
    "6": "linear-gradient(135deg, #4169E1 0%, #6495ED 100%)",
    "7": "linear-gradient(135deg, #696969 0%, #A9A9A9 100%)",
    "8": "linear-gradient(135deg, #1E90FF 0%, #4169E1 100%)",
    "9": "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
    "10": "linear-gradient(135deg, #20B2AA 0%, #3CB371 100%)",
  };
  return g[id] || "linear-gradient(135deg, #E0E0E0 0%, #F5F5F5 100%)";
}

function getPageIcon(id: string): string {
  const i: Record<string, string> = {
    "1": "🗿", "2": "📢", "3": "🙏", "4": "🔨", "5": "⛔",
    "6": "💧", "7": "⛰️", "8": "🌊", "9": "☀️", "10": "✨",
  };
  return i[id] || "📖";
}
