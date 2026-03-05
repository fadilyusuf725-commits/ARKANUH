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
    if (Date.now() - startTime > 5000) throw new Error("PageFlip library timeout");
    await new Promise(r => setTimeout(r, 50));
  }
  PageFlip = window.St.PageFlip;
  console.log("✓✓✓ PageFlip library loaded from CDN");
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
        if (!PF) throw new Error("PageFlip library not loaded");

        // CRITICAL: Create container with EXPLICIT dimensions
        const flipContainer = document.createElement("div");
        flipContainer.id = "flipbook-container";
        flipContainer.style.width = "100%";
        flipContainer.style.maxWidth = "800px";
        flipContainer.style.height = "650px";
        flipContainer.style.margin = "0 auto";
        flipContainer.style.position = "relative";
        flipContainer.style.backgroundColor = "#fff";

        // Create flipbook div that will hold all pages
        const flipDiv = document.createElement("div");
        flipDiv.id = "flipbook";
        flipDiv.style.width = "100%";
        flipDiv.style.height = "100%";
        flipDiv.style.display = "block";

        // Array to collect pages
        const pages: HTMLElement[] = [];

        // Cover page
        const cover = document.createElement("div");
        cover.className = "page";
        cover.style.width = "100%";
        cover.style.height = "100%";
        cover.style.display = "flex";
        cover.style.flexDirection = "column";
        cover.style.alignItems = "center";
        cover.style.justifyContent = "center";
        cover.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
        cover.style.color = "white";
        cover.style.position = "relative";
        cover.innerHTML = `
          <div style="text-align: center; z-index: 1;">
            <h1 style="margin: 0; font-size: 2.5rem; font-weight: bold;">KISAH NABI NUH</h1>
            <p style="margin-top: 1rem; font-size: 1.2rem;">Cerita Iman & Kesabaran</p>
            <div style="margin-top: 2rem; font-size: 3rem;">📖</div>
          </div>
        `;
        pages.push(cover);

        // Story pages (left-right pairs)
        flipbookPages.forEach((page) => {
          // LEFT PAGE
          const left = document.createElement("div");
          left.className = "page";
          left.style.width = "100%";
          left.style.height = "100%";
          left.style.display = "flex";
          left.style.flexDirection = "column";
          left.style.background = "#f8f9fa";
          left.style.padding = "2rem";
          left.style.boxSizing = "border-box";
          left.style.overflowY = "auto";
          left.style.position = "relative";
          left.innerHTML = `
            <h2 style="margin: 0 0 0.5rem 0; color: #2c3e50; font-size: 1.3rem;">${page.title}</h2>
            <p style="margin: 0 0 1rem 0; color: #7f8c8d; font-size: 0.85rem;">Halaman ${page.id}</p>
            <div style="flex: 1; color: #34495e; line-height: 1.6; font-size: 0.95rem;">
              ${page.narration.split("\n").map(p => `<p style="margin: 0.5rem 0;">${p}</p>`).join("")}
            </div>
          `;
          pages.push(left);

          // RIGHT PAGE
          const right = document.createElement("div");
          right.className = "page";
          right.style.width = "100%";
          right.style.height = "100%";
          right.style.display = "flex";
          right.style.alignItems = "center";
          right.style.justifyContent = "center";
          right.style.background = getPageGradient(page.id);
          right.style.color = "white";
          right.style.position = "relative";
          right.innerHTML = `
            <div style="text-align: center;">
              <div style="font-size: 4rem; margin-bottom: 1rem;">${getPageIcon(page.id)}</div>
              <h3 style="margin: 0; font-size: 1.2rem;">${page.floatingText || "Ilustrasi"}</h3>
            </div>
          `;
          pages.push(right);
        });

        // Back cover
        const back = document.createElement("div");
        back.className = "page";
        back.style.width = "100%";
        back.style.height = "100%";
        back.style.display = "flex";
        back.style.flexDirection = "column";
        back.style.alignItems = "center";
        back.style.justifyContent = "center";
        back.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
        back.style.color = "white";
        back.style.position = "relative";
        back.innerHTML = `
          <div style="text-align: center;">
            <p style="margin: 0; font-size: 1.3rem; font-weight: 500;">"Kesabaran adalah kunci kesuksesan"</p>
            <p style="margin-top: 2rem;">- Kisah Nabi Nuh</p>
          </div>
        `;
        pages.push(back);

        console.log(`✓ Created ${pages.length} page elements`);

        // Append all pages to flipDiv
        pages.forEach((pageEl) => {
          flipDiv.appendChild(pageEl);
        });

        // Append flipDiv to container
        flipContainer.appendChild(flipDiv);

        // NOW append to DOM so browser can render
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          containerRef.current.appendChild(flipContainer);
        }

        console.log(`✓ All pages appended to DOM, container ready for PageFlip`);

        // WAIT for DOM to fully render before initializing library
        await new Promise(r => setTimeout(r, 200));

        // INITIALIZE PAGE FLIP with pages already in DOM
        console.log("Initializing PageFlip library with", pages.length, "pages...");
        
        const flipBook = new PF(flipDiv, {
          width: 500,
          height: 650,
          size: "fixed",
          minWidth: 300,
          maxWidth: 900,
          minHeight: 390,
          maxHeight: 1350,
          maxShadowOpacity: 0.5,
          showCover: true,
          autoSize: false,
          useMouseEvents: true,
          usePortrait: true,
          startZIndex: 0,
          drawShadow: true,
          flips: pages.length,
          duration: 800,
        });

        flipBookRef.current = flipBook;
        console.log("✓ PageFlip instance created");
        
        // Log available methods
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(flipBook));
        console.log("✓ Available methods:", methods.filter(m => !m.startsWith("_")).slice(0, 15));

        // Test method availability
        console.log("Method test - flip():", typeof flipBook.flip);
        console.log("Method test - nextPage():", typeof flipBook.nextPage);
        console.log("Method test - prevPage():", typeof flipBook.prevPage);
        console.log("Method test - turn():", typeof flipBook.turn);

        // Event listeners
        flipBook.on("change", (obj: any) => {
          const pageNum = obj?.data || 0;
          console.log("→ Page changed to:", pageNum);
          setCurrentPageIndex(pageNum);

          if (pageNum > 0 && pageNum < pages.length) {
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

        flipBook.on("flip", (obj: any) => {
          console.log("🔄 Flip event:", obj);
          if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
          }
        });

        flipBook.on("error", (err: any) => {
          console.error("✗ PageFlip error event:", err);
        });

        setIsInitialized(true);
        setError(null);
        console.log("✓✓✓ FLIPBOOK READY AND VISIBLE ON SCREEN");
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("✗✗✗ INITIALIZATION FAILED:", msg);
        setError(`Error: ${msg}`);
      }
    })();

    return () => {
      try {
        if (flipBookRef.current?.destroy) {
          flipBookRef.current.destroy();
          console.log("✓ Flipbook destroyed on cleanup");
        }
      } catch (e) {
        console.log("Cleanup error (ok):", e);
      }
    };
  }, [isInitialized, onPageChange, autoPlayAudio]);

  const handlePrev = () => {
    try {
      if (typeof flipBookRef.current?.prevPage === "function") {
        flipBookRef.current.prevPage();
      } else if (typeof flipBookRef.current?.flip === "function") {
        flipBookRef.current.flip(-1);
      } else {
        console.warn("⚠ prevPage method not available");
      }
    } catch (e) {
      console.error("✗ prevPage error:", e);
    }
  };

  const handleNext = () => {
    try {
      if (typeof flipBookRef.current?.nextPage === "function") {
        flipBookRef.current.nextPage();
      } else if (typeof flipBookRef.current?.flip === "function") {
        flipBookRef.current.flip(1);
      } else {
        console.warn("⚠ nextPage method not available");
      }
    } catch (e) {
      console.error("✗ nextPage error:", e);
    }
  };
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
      <div style={{ padding: "2rem", color: "red", textAlign: "center", whiteSpace: "pre-wrap" }}>
        <h3>⚠️ Error</h3>
        <p>{error}</p>
        <p style={{ fontSize: "0.85rem", marginTop: "1rem", color: "#666" }}>Check F12 console</p>
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

      <div className="flipbook-canvas" ref={containerRef} style={{ minHeight: "650px", position: "relative" }} />

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
