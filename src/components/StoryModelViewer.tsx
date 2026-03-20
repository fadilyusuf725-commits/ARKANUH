import "@google/model-viewer";
import { useEffect, useMemo, useRef, useState } from "react";
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

const DEFAULT_CAMERA_ORBIT = "0deg 75deg 2.6m";
const DEFAULT_CAMERA_TARGET = "0m 0.7m 0m";

export function StoryModelViewer({ pageId, title, modelEntry, onPrev, onNext, canPrev, canNext }: StoryModelViewerProps) {
  const modelViewerRef = useRef<HTMLElement | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const [viewerState, setViewerState] = useState<ViewerState>(() => {
    if (!modelEntry || modelEntry.status === "missing") {
      return "missing";
    }
    return "loading";
  });

  const modelSrc = useMemo(() => {
    if (!modelEntry || modelEntry.status !== "ready" || !modelEntry.src) {
      return undefined;
    }
    return modelEntry.src;
  }, [modelEntry]);

  useEffect(() => {
    if (!modelSrc) {
      setViewerState("missing");
      return;
    }
    setViewerState("loading");
  }, [modelSrc, pageId]);

  useEffect(() => {
    const node = modelViewerRef.current;
    if (!node || !modelSrc) {
      return;
    }

    const onLoad = () => setViewerState("ready");
    const onError = () => setViewerState("error");

    node.addEventListener("load", onLoad);
    node.addEventListener("error", onError);

    return () => {
      node.removeEventListener("load", onLoad);
      node.removeEventListener("error", onError);
    };
  }, [modelSrc, pageId]);

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
    const node = modelViewerRef.current as (HTMLElement & { jumpCameraToGoal?: () => void }) | null;
    if (!node) {
      return;
    }

    node.setAttribute("camera-orbit", DEFAULT_CAMERA_ORBIT);
    node.setAttribute("camera-target", DEFAULT_CAMERA_TARGET);
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
        {modelSrc ? (
          <model-viewer
            ref={modelViewerRef}
            className="story-model-viewer"
            src={modelSrc}
            alt={`Model 3D ${title}`}
            camera-controls=""
            auto-rotate=""
            auto-rotate-delay="1000"
            rotation-per-second="20deg"
            shadow-intensity="0.95"
            environment-image="neutral"
            exposure="1"
            interaction-prompt="none"
            loading="eager"
            reveal="auto"
            camera-orbit={DEFAULT_CAMERA_ORBIT}
            camera-target={DEFAULT_CAMERA_TARGET}
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

        {viewerState === "loading" && modelSrc ? <p className="story-model-overlay">Memuat model 3D...</p> : null}
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

      <p className="muted story-model-help">Geser kiri/kanan di kanvas atau gunakan tombol untuk pindah halaman.</p>
    </section>
  );
}
