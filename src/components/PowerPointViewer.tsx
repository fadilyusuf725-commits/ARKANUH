import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/powerpoint.css";
import JSZip from "jszip";

type Slide = {
  index: number;
  title: string;
  content: string;
  rawXML: string;
};

type Props = {
  fileUrl: string;
  onSlideChange?: (slideIndex: number) => void;
};

export function PowerPointViewer({ fileUrl, onSlideChange }: Props) {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);

  // Load and parse PPTX
  useEffect(() => {
    const loadPresentation = async () => {
      try {
        setIsLoading(true);
        console.log("Loading PPTX from:", fileUrl);

        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

        const arrayBuffer = await response.arrayBuffer();
        console.log("✓ PPTX file loaded, size:", (arrayBuffer.byteLength / 1024 / 1024).toFixed(2), "MB");

        // Parse ZIP
        const zip = new JSZip();
        const unzipped = await zip.loadAsync(arrayBuffer);
        console.log("✓ PPTX unzipped successfully");

        // Debug: List all files
        const allFiles: string[] = [];
        unzipped.forEach((relativePath) => {
          allFiles.push(relativePath);
        });
        console.log("Total files in PPTX:", allFiles.length);
        console.log("Sample files:", allFiles.slice(0, 20));

        // Find slide files - more robust approach
        const slideFiles: string[] = [];
        unzipped.forEach((relativePath) => {
          if (relativePath.includes("ppt/slides/slide") && relativePath.endsWith(".xml")) {
            slideFiles.push(relativePath);
          }
        });

        console.log("Found slide files:", slideFiles);

        slideFiles.sort((a, b) => {
          const numA = parseInt(a.match(/\d+/)![0]);
          const numB = parseInt(b.match(/\d+/)![0]);
          return numA - numB;
        });

        if (slideFiles.length === 0) {
          throw new Error("No slides found in PPTX. ZIP structure: " + allFiles.slice(0, 30).join(", "));
        }

        console.log("✓ Found", slideFiles.length, "slides:", slideFiles);

        // Parse slide content
        const parsedSlides: Slide[] = [];
        for (let i = 0; i < slideFiles.length; i++) {
          const slideFile = unzipped.file(slideFiles[i]);
          if (slideFile) {
            const xmlContent = await slideFile.async("text");
            const title = `Slide ${i + 1}`;
            const content = extractTextFromXML(xmlContent);

            parsedSlides.push({
              index: i,
              title,
              content: content || "(No text content)",
              rawXML: xmlContent,
            });
            console.log(`✓ Parsed slide ${i + 1}: "${title}"`);
          }
        }

        setSlides(parsedSlides);
        setTotalSlides(parsedSlides.length);
        setCurrentSlide(0);
        setError(null);
        console.log("✓ Presentation loaded with", parsedSlides.length, "slides");
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("✗ Error loading PPTX:", msg);
        setError(`Failed to load presentation: ${msg}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (fileUrl) {
      loadPresentation();
    }
  }, [fileUrl]);

  // Extract text from XML
  const extractTextFromXML = (xml: string): string => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, "text/xml");
      const textElements = doc.querySelectorAll("a\\:t, a|t");
      const texts: string[] = [];
      textElements.forEach((el) => {
        if (el.textContent) texts.push(el.textContent);
      });
      return texts.join(" ");
    } catch {
      return "";
    }
  };

  // Render slide to canvas
  useEffect(() => {
    if (!canvasRef.current || slides.length === 0 || !slides[currentSlide]) return;

    const renderSlide = () => {
      try {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size (16:9 aspect ratio)
        const slideWidth = 1280;
        const slideHeight = 720;
        const scaleFactor = (zoom / 100) * window.devicePixelRatio;

        canvas.width = slideWidth * scaleFactor;
        canvas.height = slideHeight * scaleFactor;
        canvas.style.width = `${(slideWidth * zoom) / 100}px`;
        canvas.style.height = `${(slideHeight * zoom) / 100}px`;

        ctx.scale(scaleFactor, scaleFactor);

        // Fill background with gradient
        const gradient = ctx.createLinearGradient(0, 0, slideWidth, slideHeight);
        gradient.addColorStop(0, "#f8f9fa");
        gradient.addColorStop(1, "#e9ecef");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, slideWidth, slideHeight);

        // Render slide content
        const slide = slides[currentSlide];

        // Title
        ctx.font = "bold 48px Arial";
        ctx.fillStyle = "#2c3e50";
        ctx.textAlign = "center";
        ctx.fillText(slide.title, slideWidth / 2, 100);

        // Content
        ctx.font = "18px Arial";
        ctx.fillStyle = "#34495e";
        ctx.textAlign = "left";
        const lines = slide.content.substring(0, 500).split(" ");
        let line = "";
        let y = 200;

        lines.forEach((word) => {
          const testLine = line + word + " ";
          const metrics = ctx.measureText(testLine);
          if (metrics.width > slideWidth - 100) {
            ctx.fillText(line, 50, y);
            line = word + " ";
            y += 30;
          } else {
            line = testLine;
          }
        });
        if (line) ctx.fillText(line, 50, y);

        // Slide number
        ctx.font = "14px Arial";
        ctx.fillStyle = "#7f8c8d";
        ctx.textAlign = "right";
        ctx.fillText(`${currentSlide + 1} / ${slides.length}`, slideWidth - 20, slideHeight - 20);

        console.log("✓ Rendered slide", currentSlide + 1);
      } catch (err) {
        console.error("Error rendering slide:", err);
      }
    };

    renderSlide();
  }, [currentSlide, slides, zoom]);

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setIsFlipping(true);
      setFlipDirection("next");
      setTimeout(() => {
        const newSlide = currentSlide + 1;
        setCurrentSlide(newSlide);
        onSlideChange?.(newSlide);
        setIsFlipping(false);
      }, 450);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setIsFlipping(true);
      setFlipDirection("prev");
      setTimeout(() => {
        const newSlide = currentSlide - 1;
        setCurrentSlide(newSlide);
        onSlideChange?.(newSlide);
        setIsFlipping(false);
      }, 450);
    }
  };

  // Handle mouse drag for flip gesture
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).closest(".ppt-canvas-container")) {
      dragStartX.current = e.clientX;
      dragStartY.current = e.clientY;
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const dragEndX = e.clientX;
    const dragEndY = e.clientY;
    const dragDistanceX = dragStartX.current - dragEndX;
    const dragDistanceY = dragStartY.current - dragEndY;

    // Require significant horizontal drag (at least 50px) and more horizontal than vertical
    if (Math.abs(dragDistanceX) > 50 && Math.abs(dragDistanceX) > Math.abs(dragDistanceY)) {
      if (dragDistanceX > 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNextSlide();
      if (e.key === "ArrowLeft") handlePrevSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, slides.length]);

  const handleZoomIn = () => setZoom(Math.min(zoom + 10, 200));
  const handleZoomOut = () => setZoom(Math.max(zoom - 10, 50));
  const handleZoomFit = () => setZoom(100);

  const handleBack = () => navigate("/", { replace: true });

  if (error) {
    return (
      <div className="ppt-error">
        <h3>⚠️ Error Loading Presentation</h3>
        <p>{error}</p>
        <button onClick={handleBack} className="ppt-btn-back">
          🏠 Kembali
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="ppt-loading">
        <div className="ppt-spinner"></div>
        <p>Loading presentation...</p>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="ppt-error">
        <h3>No slides found</h3>
        <button onClick={handleBack} className="ppt-btn-back">
          🏠 Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="ppt-viewer">
      <div className="ppt-toolbar">
        <button onClick={handlePrevSlide} disabled={currentSlide === 0} className="ppt-btn">
          ← Sebelumnya
        </button>

        <div className="ppt-slide-info">
          Slide {currentSlide + 1} / {totalSlides}
        </div>

        <div className="ppt-zoom-controls">
          <button onClick={handleZoomOut} className="ppt-btn-zoom">
            −
          </button>
          <span className="ppt-zoom-value">{zoom}%</span>
          <button onClick={handleZoomIn} className="ppt-btn-zoom">
            +
          </button>
          <button onClick={handleZoomFit} className="ppt-btn-zoom">
            Fit
          </button>
        </div>

        <button onClick={handleNextSlide} disabled={currentSlide === slides.length - 1} className="ppt-btn">
          Berikutnya →
        </button>

        <button onClick={handleBack} className="ppt-btn ppt-btn-back">
          🏠 Kembali
        </button>
      </div>

      <div 
        className="ppt-canvas-container" 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div className={`ppt-flipbook-wrapper ${isFlipping ? `ppt-flip-${flipDirection}` : ""}`}>
          <canvas ref={canvasRef} className="ppt-canvas" />
        </div>
      </div>

      <div className="ppt-footer">
        <p>PowerPoint Presentation Viewer - {totalSlides} slides</p>
      </div>
    </div>
  );
}
