import { useEffect, useRef, useState } from "react";
import { flipbookPages } from "../data/flipbookPages";
import { withBasePath } from "../lib/assetPaths";
import "../styles/flipbook.css";

// Page-flip library is loaded via CDN in index.html as window.St.PageFlip
let PageFlip: any = null;

const loadPageFlip = async () => {
  if (PageFlip) return PageFlip;
  
  // Page-flip from CDN is already loaded as window.St.PageFlip
  if ((window as any).St && (window as any).St.PageFlip) {
    PageFlip = (window as any).St.PageFlip;
    console.log("PageFlip loaded from window.St.PageFlip (CDN)", PageFlip);
    return PageFlip;
  }
  
  // Fallback: try to load from npm if CDN fails
  try {
    const mod = await import("page-flip");
    console.log("page-flip module fallback loaded:", mod);
    console.log("mod.PageFlip:", mod.PageFlip);
    console.log("mod.default:", mod.default);
    
    if (mod.PageFlip && typeof mod.PageFlip === "function") {
      PageFlip = mod.PageFlip;
    } else if (mod.default && typeof mod.default === "function") {
      PageFlip = mod.default;
    } else {
      PageFlip = mod;
    }
    
    console.log("Selected PageFlip (fallback):", PageFlip);
    return PageFlip;
  } catch (e) {
    console.error("Failed to load page-flip:", e);
    return null;
  }
};

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

    (async () => {
      try {
        const PF = PageFlip || (await loadPageFlip());

        if (!PF || typeof PF !== "function") {
          throw new Error(`PageFlip invalid: ${typeof PF}`);
        }

        // Create container div for pages
        const flipbookContainer = document.createElement("div");
        flipbookContainer.id = "flipbook";
        flipbookContainer.style.width = "100%";
        flipbookContainer.style.height = "100%";
        
        // Create all page elements first
        const pages: HTMLElement[] = [];
        
        // Add cover page
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
        pages.push(coverDiv);

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
          pages.push(leftDiv);

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
          pages.push(rightDiv);
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
        pages.push(backDiv);

        // Append all pages to container
        for (const page of pages) {
          flipbookContainer.appendChild(page);
        }
        
        // Append container to the ref
        containerRef.current?.appendChild(flipbookContainer);

        // Create PageFlip instance with loadFromHTML
        console.log("Creating PageFlip instance with", pages.length, "pages");
        const flipBook = new PF(flipbookContainer, {
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
          flips: pages.length * 2,
          duration: 800,
          mobileScrollSupport: true,
        });

        flipBookRef.current = flipBook;
        console.log("PageFlip instance created:", flipBook);
        console.log("Calling loadFromHTML with", pages.length, "pages");
        
        // Load pages using loadFromHTML API
        flipBook.loadFromHTML(pages);

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
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Failed to initialize flipbook:", err);
      setError(`Flipbook error: ${errorMsg}`);
    }
    })();

    return () => {
      try {
        if (flipBookRef.current && typeof flipBookRef.current.destroy === "function") {
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
      if (flipBookRef.current && typeof flipBookRef.current.prevPage === "function") {
        flipBookRef.current.prevPage();
      }
    } catch (err) {
      console.error("Error going to prev page:", err);
    }
  };

  const handleNext = () => {
    try {
      if (flipBookRef.current && typeof flipBookRef.current.nextPage === "function") {
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
      <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
        <h3>⚠️ Flipbook Error</h3>
        <p>{error}</p>
        <p style={{ fontSize: "0.9em", marginTop: "10px" }}>
          Trying to reload... Please refresh the page if this persists.
        </p>
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
