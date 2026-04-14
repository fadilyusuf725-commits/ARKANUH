import { useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";
import type { ModelManifestEntry } from "../data/modelManifest";
import { withBasePath } from "../lib/assetPaths";

type StoryModelViewerProps = {
  pageId: string;
  title: string;
  modelEntry?: ModelManifestEntry;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  isPreferred?: boolean;
  compact?: boolean;
};

type ViewerState = "booting" | "loading" | "ready" | "error" | "missing";

type ModelViewerElement = HTMLElement & {
  jumpCameraToGoal?: () => void;
  updateFraming?: () => Promise<void>;
};

const DEFAULT_FIELD_OF_VIEW = "22deg";
const DEFAULT_MODEL_SCALE = "1.42 1.42 1.42";
const MODEL_VIEWER_SCRIPT_ID = "arkanuh-model-viewer-script";
const MODEL_VIEWER_SCRIPT_SRC = withBasePath("vendor/model-viewer.min.js");

export function StoryModelViewer({
  pageId,
  title,
  modelEntry,
  onPrev,
  onNext,
  canPrev,
  canNext,
  isPreferred = false,
  compact = false
}: StoryModelViewerProps) {
  const modelViewerRef = useRef<ModelViewerElement | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const [viewerModuleState, setViewerModuleState] = useState<"loading" | "ready" | "error">("loading");
  const [viewerState, setViewerState] = useState<ViewerState>(() => {
    if (!modelEntry || modelEntry.status === "missing") {
      return "missing";
    }
    return "booting";
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.customElements.get("model-viewer")) {
      setViewerModuleState("ready");
      return;
    }

    const existingScript = document.getElementById(MODEL_VIEWER_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript?.dataset.loaded === "true") {
      setViewerModuleState("ready");
      return;
    }

    if (existingScript?.dataset.error === "true") {
      setViewerModuleState("error");
      return;
    }

    const script = existingScript ?? document.createElement("script");
    script.id = MODEL_VIEWER_SCRIPT_ID;
    script.type = "module";
    script.src = MODEL_VIEWER_SCRIPT_SRC;
    script.async = true;

    const onLoad = () => {
      script.dataset.loaded = "true";
      setViewerModuleState("ready");
    };

    const onError = () => {
      script.dataset.error = "true";
      setViewerModuleState("error");
    };

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);

    if (!existingScript) {
      document.head.appendChild(script);
    }

    return () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };
  }, []);

  useEffect(() => {
    const node = modelViewerRef.current;
    if (!modelEntry || modelEntry.status === "missing") {
      setViewerState("missing");
      return;
    }

    if (viewerModuleState === "error") {
      setViewerState("error");
      return;
    }

    if (viewerModuleState !== "ready" || !node || !modelEntry.src || modelEntry.status !== "ready") {
      setViewerState("booting");
      return;
    }

    let cancelled = false;

    const onLoad = async () => {
      try {
        node.setAttribute("scale", DEFAULT_MODEL_SCALE);
        await node.updateFraming?.();
        if (cancelled) {
          return;
        }
        node.jumpCameraToGoal?.();
        setViewerState("ready");
      } catch {
        if (!cancelled) {
          setViewerState("error");
        }
      }
    };

    const onError = () => {
      if (!cancelled) {
        setViewerState("error");
      }
    };

    setViewerState("loading");
    node.addEventListener("load", onLoad);
    node.addEventListener("error", onError);

    return () => {
      cancelled = true;
      node.removeEventListener("load", onLoad);
      node.removeEventListener("error", onError);
    };
  }, [modelEntry, pageId, viewerModuleState]);

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    if (!start) {
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15) {
      if (deltaX < 0 && canNext) {
        onNext();
      } else if (deltaX > 0 && canPrev) {
        onPrev();
      }
    }
  };

  const resetView = () => {
    const node = modelViewerRef.current;
    if (!node) {
      return;
    }

    node.setAttribute("scale", DEFAULT_MODEL_SCALE);
    void node
      .updateFraming?.()
      ?.then(() => {
        node.jumpCameraToGoal?.();
      })
      .catch(() => undefined);
  };

  return (
    <section
      className={`card story-model-card story-model-card-3d ${isPreferred ? "is-preferred" : ""} ${compact ? "is-compact" : ""}`}
    >
      <div className="story-model-topbar">
        <div className="story-model-heading">
          <p className="eyebrow">Viewer 3D Halaman {pageId}</p>
          <h2>{title}</h2>
        </div>
        <div className="button-row story-model-nav">
          <button type="button" className="btn btn-outline" onClick={onPrev} disabled={!canPrev}>
            Sebelumnya
          </button>
          <button type="button" className="btn btn-outline" onClick={onNext} disabled={!canNext}>
            Berikutnya
          </button>
          <button type="button" className="btn btn-outline" onClick={resetView}>
            Reset View
          </button>
        </div>
      </div>

      <div className="story-model-stage story-model-stage-3d" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="story-model-stage-label">Panggung 3D</div>
        {viewerModuleState === "ready" && modelEntry?.src && modelEntry.status === "ready" ? (
          <model-viewer
            ref={modelViewerRef}
            className="story-model-viewer"
            src={modelEntry.src}
            alt={`Model 3D ${title}`}
            camera-controls=""
            disable-pan=""
            auto-rotate=""
            auto-rotate-delay="1000"
            rotation-per-second="20deg"
            shadow-intensity="0.95"
            environment-image="neutral"
            exposure="1"
            interaction-prompt="none"
            loading="eager"
            reveal="auto"
            bounds="tight"
            scale={DEFAULT_MODEL_SCALE}
            field-of-view={DEFAULT_FIELD_OF_VIEW}
          />
        ) : (
          <div className="story-model-placeholder" role="status">
            <strong>
              {viewerModuleState === "loading"
                ? "Menyiapkan viewer 3D"
                : viewerModuleState === "error"
                  ? "Viewer 3D belum bisa dimuat"
                  : "Model 3D belum tersedia"}
            </strong>
            <p>
              {viewerModuleState === "loading"
                ? "Komponen 3D sedang disiapkan. Kamu tetap bisa membaca narasi sambil menunggu."
                : "Halaman ini tetap bisa dibaca. Lanjutkan ke halaman berikutnya atau buka sumber model bila tersedia."}
            </p>
            {modelEntry?.sourcePageUrl ? (
              <a href={modelEntry.sourcePageUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline inline-btn-link">
                Buka Sumber Model
              </a>
            ) : null}
          </div>
        )}

        {viewerState === "booting" && modelEntry?.src ? <p className="story-model-overlay">Menyiapkan viewer 3D...</p> : null}
        {viewerState === "loading" && modelEntry?.src ? <p className="story-model-overlay">Memuat model 3D...</p> : null}
        {viewerState === "error" ? (
          <div className="story-model-overlay is-error">
            Gagal memuat model 3D untuk halaman ini.
            {modelEntry?.sourcePageUrl ? (
              <a href={modelEntry.sourcePageUrl} target="_blank" rel="noopener noreferrer" className="story-model-overlay-link">
                Buka sumber model
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="story-model-meta">
        <p className="muted story-model-help">
          Geser kiri atau kanan di kanvas, lalu pakai tombol Sebelumnya/Berikutnya agar halaman tetap sinkron dengan buku mini.
        </p>
        <div className="story-model-tips" aria-label="Petunjuk viewer 3D">
          <span className="story-model-tip">Putar dengan sentuhan</span>
          <span className="story-model-tip">Reset bila arah berubah</span>
        </div>
      </div>
    </section>
  );
}
