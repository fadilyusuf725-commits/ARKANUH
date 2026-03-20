import "@google/model-viewer";
import { useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";
import type { ModelManifestEntry } from "../data/modelManifest";

type StoryModelViewerProps = {
  pageId: string;
  title: string;
  modelEntry?: ModelManifestEntry;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
};

type ViewerState = "loading" | "ready" | "error" | "missing";

type ModelViewerElement = HTMLElement & {
  jumpCameraToGoal?: () => void;
  updateFraming?: () => Promise<void>;
};

const DEFAULT_CAMERA_ORBIT = "0deg 70deg 58%";
const DEFAULT_CAMERA_TARGET = "auto auto auto";
const DEFAULT_MIN_CAMERA_ORBIT = "auto auto 40%";
const DEFAULT_MAX_CAMERA_ORBIT = "auto auto 200%";
const DEFAULT_FIELD_OF_VIEW = "23deg";

export function StoryModelViewer({ pageId, title, modelEntry, onPrev, onNext, canPrev, canNext }: StoryModelViewerProps) {
  const modelViewerRef = useRef<ModelViewerElement | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const [viewerState, setViewerState] = useState<ViewerState>(() => {
    if (!modelEntry || modelEntry.status === "missing") {
      return "missing";
    }
    return "loading";
  });

  useEffect(() => {
    const node = modelViewerRef.current;
    if (!node || !modelEntry?.src || modelEntry.status !== "ready") {
      setViewerState("missing");
      return;
    }

    let cancelled = false;

    const onLoad = async () => {
      try {
        await node.updateFraming?.();
        if (cancelled) {
          return;
        }

        node.setAttribute("camera-target", DEFAULT_CAMERA_TARGET);
        node.setAttribute("camera-orbit", DEFAULT_CAMERA_ORBIT);
        node.setAttribute("min-camera-orbit", DEFAULT_MIN_CAMERA_ORBIT);
        node.setAttribute("max-camera-orbit", DEFAULT_MAX_CAMERA_ORBIT);
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
  }, [modelEntry?.src, modelEntry?.status, pageId]);

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

    node.setAttribute("camera-target", DEFAULT_CAMERA_TARGET);
    node.setAttribute("camera-orbit", DEFAULT_CAMERA_ORBIT);
    node.setAttribute("min-camera-orbit", DEFAULT_MIN_CAMERA_ORBIT);
    node.setAttribute("max-camera-orbit", DEFAULT_MAX_CAMERA_ORBIT);
    node.jumpCameraToGoal?.();
  };

  return (
    <section className="card story-model-card">
      <div className="story-model-topbar">
        <p className="eyebrow">Viewer 3D Halaman {pageId}</p>
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

      <div className="story-model-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {modelEntry?.src && modelEntry.status === "ready" ? (
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
            camera-orbit={DEFAULT_CAMERA_ORBIT}
            camera-target={DEFAULT_CAMERA_TARGET}
            min-camera-orbit={DEFAULT_MIN_CAMERA_ORBIT}
            max-camera-orbit={DEFAULT_MAX_CAMERA_ORBIT}
            field-of-view={DEFAULT_FIELD_OF_VIEW}
          />
        ) : (
          <div className="story-model-placeholder" role="status">
            <strong>Model 3D belum tersedia</strong>
            <p>Halaman ini tetap bisa dibaca. Lanjutkan ke halaman berikutnya.</p>
            {modelEntry?.sourcePageUrl ? (
              <a href={modelEntry.sourcePageUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline inline-btn-link">
                Buka Sumber Model
              </a>
            ) : null}
          </div>
        )}

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

      <p className="muted story-model-help">Geser kiri atau kanan di kanvas, lalu pakai tombol untuk pindah halaman.</p>
    </section>
  );
}
