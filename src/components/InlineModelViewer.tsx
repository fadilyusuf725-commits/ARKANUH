import { useEffect, useMemo, useRef, useState } from "react";

type InlineModelViewerProps = {
  title: string;
  modelSrc?: string;
  posterSrc?: string;
  assetPageUrl?: string;
};

export function InlineModelViewer({ title, modelSrc, posterSrc, assetPageUrl }: InlineModelViewerProps) {
  const [hasError, setHasError] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const viewerRef = useRef<HTMLElement | null>(null);
  const canRender = Boolean(modelSrc) && viewerReady;

  const ariaLabel = useMemo(() => `Model 3D untuk ${title}`, [title]);

  useEffect(() => {
    let isMounted = true;
    setHasError(false);
    setViewerReady(false);
    setModelLoaded(false);

    if (!modelSrc) {
      return () => {
        isMounted = false;
      };
    }

    import("@google/model-viewer")
      .then(() => {
        if (isMounted) {
          setViewerReady(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setHasError(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [modelSrc]);

  useEffect(() => {
    if (!viewerReady || !viewerRef.current || !modelSrc) {
      return;
    }

    const element = viewerRef.current;

    const onLoad = () => {
      setModelLoaded(true);
      setHasError(false);
    };

    const onError = () => {
      setModelLoaded(false);
      setHasError(true);
    };

    element.addEventListener("load", onLoad);
    element.addEventListener("error", onError);

    return () => {
      element.removeEventListener("load", onLoad);
      element.removeEventListener("error", onError);
    };
  }, [viewerReady, modelSrc]);

  return (
    <section className="card asset-panel">
      <p className="eyebrow">Asset 3D</p>
      <h2>Pop-up 3D Halaman Ini</h2>
      {canRender && !hasError ? (
        <div className="model-viewer-shell">
          {!modelLoaded && posterSrc ? (
            <div className="model-viewer-overlay">
              <img src={posterSrc} alt="" className="model-viewer-poster" />
              <p className="model-viewer-status">Memuat model 3D halaman ini...</p>
            </div>
          ) : null}
          <model-viewer
            ref={viewerRef}
            src={modelSrc}
            poster={posterSrc}
            camera-controls
            auto-rotate
            rotation-per-second="18deg"
            shadow-intensity="0.9"
            environment-image="neutral"
            exposure="1"
            interaction-prompt="none"
            loading="eager"
            className="model-viewer-canvas"
            alt={ariaLabel}
          />
        </div>
      ) : modelSrc && !hasError ? (
        <div className="model-viewer-loading">
          {posterSrc ? <img src={posterSrc} alt="" className="model-viewer-loading-thumb" /> : null}
          <p className="muted">Menyiapkan viewer 3D untuk halaman ini...</p>
        </div>
      ) : (
        <div className="model-viewer-fallback">
          {posterSrc ? <img src={posterSrc} alt="" className="model-viewer-loading-thumb" /> : null}
          <p className="muted">
            Model 3D belum bisa ditampilkan di perangkat ini. Gunakan tombol di bawah untuk membuka asset aslinya.
          </p>
        </div>
      )}

      <div className="button-row">
        {assetPageUrl ? (
          <a href={assetPageUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline inline-btn-link">
            Buka Asset 3D
          </a>
        ) : null}
      </div>
    </section>
  );
}
