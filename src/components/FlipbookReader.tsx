import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "page-flip";
import { FlipbookPage } from "../types/domain";
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
  const flipBookRef = useRef<HTMLFlipBook | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize Flipbook
  useEffect(() => {
    if (!containerRef.current || isInitialized) return;

    try {
      const flipBook = new HTMLFlipBook(containerRef.current, {
        width: 550,
        height: 733,
        size: "fixed",
        minWidth: 315,
        maxWidth: 1000,
        minHeight: 420,
        maxHeight: 1533,
        showCover: true,
        autoSize: true,
        maxShadowOpacity: 0.5,
        useMouseEvents: true,
        disableFlip: false,
        clickEventForward: true,
        usePortrait: true,
        startZIndex: 0,
        drawShadow: true,
        flips: flipbookPages.length * 2, // Each page = 2 sides
        duration: 800,
        mobileScrollSupport: true,
      });

      flipBookRef.current = flipBook;

      // Add cover page
      const coverPage = document.createElement("div");
      coverPage.className = "flipbook-cover";
      coverPage.innerHTML = `
        <div class="cover-content">
          <h1>KISAH NABI NUH</h1>
          <p>Cerita Iman & Kesabaran</p>
          <div class="cover-decoration"></div>
        </div>
      `;
      flipBook.addPage(coverPage, 0);

      // Add content pages
      flipbookPages.forEach((page, index) => {
        const leftPage = createPageContent(page, "left");
        const rightPage = createPageContent(page, "right");

        flipBook.addPage(leftPage, index * 2 + 1);
        flipBook.addPage(rightPage, index * 2 + 2);
      });

      // Add back cover
      const backCover = document.createElement("div");
      backCover.className = "flipbook-back-cover";
      backCover.innerHTML = `
        <div class="back-cover-content">
          <p>"Kesabaran adalah kunci kesuksesan"</p>
          <p>- Kisah Nabi Nuh</p>
        </div>
      `;
      flipBook.addPage(backCover, flipbookPages.length * 2 + 1);

      // Event listeners
      flipBook.on("change", (object: any) => {
        const pageNum = object.data;
        setCurrentPageIndex(pageNum);
        
        if (pageNum > 0 && pageNum <= flipbookPages.length) {
          const actualPageIndex = Math.floor((pageNum - 1) / 2);
          const page = flipbookPages[actualPageIndex];
          onPageChange?.(page.id, actualPageIndex);
          
          if (autoPlayAudio && audioRef.current) {
            audioRef.current.src = withBasePath(page.voAudio);
            audioRef.current.play();
            setIsPlaying(true);
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
    } catch (error) {
      console.error("Failed to initialize flipbook:", error);
    }

    return () => {
      if (flipBookRef.current) {
        flipBookRef.current = null;
      }
    };
  }, [isInitialized, onPageChange, autoPlayAudio]);

  // Navigation controls
  const handlePrev = () => {
    if (flipBookRef.current) {
      flipBookRef.current.prevPage();
    }
  };

  const handleNext = () => {
    if (flipBookRef.current) {
      flipBookRef.current.nextPage();
    }
  };

  const handleToggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="flipbook-reader">
      {/* Flipbook Container */}
      <div className="flipbook-container">
        <div ref={containerRef} className="flipbook" />
      </div>

      {/* Controls */}
      <div className="flipbook-controls">
        <button onClick={handlePrev} className="control-btn prev-btn" title="Halaman Sebelumnya">
          ← Sebelumnya
        </button>

        <div className="audio-controls">
          <audio
            ref={audioRef}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          <button
            onClick={handleToggleAudio}
            className={`audio-btn ${isPlaying ? "playing" : ""}`}
            title={isPlaying ? "Hentikan Audio" : "Putar Audio"}
          >
            {isPlaying ? "🔊 Pause" : "🔇 Play"}
          </button>
        </div>

        <button onClick={handleNext} className="control-btn next-btn" title="Halaman Berikutnya">
          Berikutnya →
        </button>
      </div>

      {/* Page Indicator */}
      <div className="page-indicator">
        Halaman {Math.floor((currentPageIndex - 1) / 2) + 1} / {flipbookPages.length}
      </div>
    </div>
  );
}

// Helper function to create page content with text and illustration
function createPageContent(
  page: FlipbookPage,
  side: "left" | "right"
): HTMLDivElement {
  const pageDiv = document.createElement("div");
  pageDiv.className = `flipbook-page ${side}-page`;

  if (side === "left") {
    // Left page: Text content
    pageDiv.innerHTML = `
      <div class="page-text-content">
        <h2 class="page-title">${page.title}</h2>
        <div class="page-number">Halaman ${page.id}</div>
        <p class="page-objective">${page.objective}</p>
        <div class="page-narration">${page.narration.replace(/\n/g, "<br>")}</div>
      </div>
    `;
  } else {
    // Right page: Illustration/Background
    const bgGradient = getPageGradient(page.id);
    
    pageDiv.innerHTML = `
      <div class="page-illustration" style="background: ${bgGradient}">
        <div class="illustration-placeholder">
          <div class="illustration-icon">${getPageIcon(page.id)}</div>
          <h3>${page.floatingText || "Ilustrasi"}</h3>
          <p>${page.objective}</p>
        </div>
      </div>
    `;
  }

  return pageDiv;
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
