import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "page-flip";
import { flipbookPages } from "../data/flipbookPages";
import { withBasePath } from "../lib/assetPaths";
import "../styles/flipbook.css";

type FlipbookReaderProps = {
  onPageChange?: (pageId: string, pageIndex: number) => void;
  autoPlayAudio?: boolean;
};

export function FlipbookReader({
  onPageChange,
  autoPlayAudio = true,
}: FlipbookReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const flipBookRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Flipbook
  useEffect(() => {
    if (!containerRef.current || isInitialized) return;

    try {
      // Create canvas element for page-flip
      const canvas = document.createElement("div");
      canvas.id = "flipbook";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      containerRef.current.appendChild(canvas);

      // Initialize page-flip
      const flipBook = new HTMLFlipBook(canvas, {
        width: 500,
        height: 650,
        size: "fixed",
        minWidth: 300,
        maxWidth: 900,
        minHeight: 390,
        maxHeight: 1350,
        showCover: true,
        autoSize: true,
        maxShadowOpacity: 0.5,
        useMouseEvents: true,
        disableFlip: false,
        clickEventForward: true,
        usePortrait: true,
        startZIndex: 0,
        drawShadow: true,
        flips: (flipbookPages.length + 1) * 2,
        duration: 800,
        mobileScrollSupport: true,
      });

      flipBookRef.current = flipBook;

      let pageIndex = 0;

      // Create and add cover page
      const coverDiv = document.createElement("div");
      coverDiv.className = "flipbook-page cover-page";
      coverDiv.innerHTML = `
        <div class="flipbook-cover">
          <div class="cover-content">
            <h1>KISAH NABI NUH</h1>
            <p>Cerita Iman & Kesabaran</p>
            <div class="cover-decoration"></div>
          </div>
        </div>
      `;
      flipBook.addPage(coverDiv, pageIndex++);

      // Add all story pages
      flipbookPages.forEach((page) => {
        // Left page: text
        const leftDiv = document.createElement("div");
        leftDiv.className = "flipbook-page left-page";
        leftDiv.innerHTML = `
          <div class="page-text-content">
            <h2 class="page-title">${page.title}</h2>
            <div class="page-number">Halaman ${page.id}</div>
            <p class="page-objective">${page.objective}</p>
            <div class="page-narration">${page.narration.replace(/\n/g, "<br>")}</div>
          </div>
        `;
        flipBook.addPage(leftDiv, pageIndex++);

        // Right page: illustration
        const bgGradient = getPageGradient(page.id);
        const rightDiv = document.createElement("div");
        rightDiv.className = "flipbook-page right-page";
        rightDiv.innerHTML = `
          <div class="page-illustration" style="background: ${bgGradient}">
            <div class="illustration-placeholder">
              <div class="illustration-icon">${getPageIcon(page.id)}</div>
              <h3>${page.floatingText || "Ilustrasi"}</h3>
              <p>${page.objective}</p>
            </div>
          </div>
        `;
        flipBook.addPage(rightDiv, pageIndex++);
      });

      // Add back cover
      const backDiv = document.createElement("div");
      backDiv.className = "flipbook-page back-cover-page";
      backDiv.innerHTML = `
        <div class="flipbook-back-cover">
          <div class="back-cover-content">
            <p>"Kesabaran adalah kunci kesuksesan"</p>
            <p>- Kisah Nabi Nuh</p>
          </div>
        </div>
      `;
      flipBook.addPage(backDiv, pageIndex);

      // Event listeners
      flipBook.on("change", (object: any) => {
        try {
          const pageNum = object.data;
          setCurrentPageIndex(pageNum);

          // Determine which story page we're on (accounting for cover)
          if (pageNum >= 2 && pageNum <= flipbookPages.length * 2 + 1) {
            const storyPageIdx = Math.floor((pageNum - 2) / 2);
            if (storyPageIdx >= 0 && storyPageIdx < flipbookPages.length) {
              const page = flipbookPages[storyPageIdx];
              onPageChange?.(page.id, storyPageIdx);

              if (autoPlayAudio && audioRef.current && pageNum % 2 === 1) {
                // Play audio on left pages (odd page numbers)
                audioRef.current.src = withBasePath(page.voAudio);
                audioRef.current.play().catch(() => {
                  console.warn("Audio play failed");
                  setIsPlaying(false);
                });
                setIsPlaying(true);
              }
            }
          }
        } catch (err) {
          console.error("Error in flip change event:", err);
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
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to initialize flipbook:", error);
      setError(`Flipbook error: ${errorMsg}`);
    }

    return () => {
      try {
        if (flipBookRef.current && flipBookRef.current.destroy) {
          flipBookRef.current.destroy();
        }
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
      } catch (err) {
        console.error("Cleanup error:", err);
      }
    };
  }, [isInitialized, onPageChange, autoPlayAudio]);

  // Navigation controls
  const handlePrev = () => {
    try {
      if (flipBookRef.current && flipBookRef.current.prevPage) {
        flipBookRef.current.prevPage();
      }
    } catch (err) {
      console.error("Error going to prev page:", err);
    }
  };

  const handleNext = () => {
    try {
      if (flipBookRef.current && flipBookRef.current.nextPage) {
        flipBookRef.current.nextPage();
      }
    } catch (err) {
      console.error("Error going to next page:", err);
    }
  };

  const handleToggleAudio = () => {
    try {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play().catch(() => {
            console.warn("Audio play failed");
            setIsPlaying(false);
          });
          setIsPlaying(true);
        }
      }
    } catch (err) {
      console.error("Error toggling audio:", err);
    }
  };

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h3>Flipbook Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flipbook-reader">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Flipbook Canvas Container */}
      <div className="flipbook-canvas" ref={containerRef} />

      {/* Controls */}
      <div className="flipbook-controls">
        <button onClick={handlePrev} className="control-btn prev-btn" title="Halaman Sebelumnya">
          ← Sebelumnya
        </button>

        <button
          onClick={handleToggleAudio}
          className={`audio-btn ${isPlaying ? "playing" : ""}`}
          title={isPlaying ? "Hentikan Audio" : "Putar Audio"}
        >
          {isPlaying ? "🔊 Pause" : "🔇 Play"}
        </button>

        <button onClick={handleNext} className="control-btn next-btn" title="Halaman Berikutnya">
          Berikutnya →
        </button>
      </div>

      {/* Page Indicator */}
      <div className="page-indicator">
        Halaman {Math.max(0, Math.floor((currentPageIndex - 1) / 2))} / {flipbookPages.length}
      </div>
    </div>
  );
}

// Get gradient colors per page theme
function getPageGradient(pageId: string): string {
  const gradients: Record<string, string> = {
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
  return gradients[pageId] || "linear-gradient(135deg, #E0E0E0 0%, #F5F5F5 100%)";
}

// Get emoji icon per page
function getPageIcon(pageId: string): string {
  const icons: Record<string, string> = {
    "1": "🗿",
    "2": "📢",
    "3": "🙏",
    "4": "🔨",
    "5": "⛔",
    "6": "💧",
    "7": "⛰️",
    "8": "🌊",
    "9": "☀️",
    "10": "✨",
  };
  return icons[pageId] || "📖";
}
