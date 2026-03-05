import { useEffect, useMemo, useState } from "react";

type InlineModelViewerProps = {
  title: string;
  modelSrc?: string;
  posterSrc?: string;
  assetPageUrl?: string;
};

export function InlineModelViewer({ title, modelSrc, posterSrc, assetPageUrl }: InlineModelViewerProps) {
  const [hasError, setHasError] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const canRender = Boolean(modelSrc) && !hasError && viewerReady;

  const ariaLabel = useMemo(() => `Model 3D untuk ${title}`, [title]);

  useEffect(() => {
    let isMounted = true;
    setHasError(false);
    setViewerReady(false);

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

  return (
    <section className="card asset-panel">
      <p className="eyebrow">Asset 3D</p>
      <h2>Pop-up 3D Halaman Ini</h2>
      {canRender ? (
        <div className="model-viewer-shell">
          <model-viewer
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
            onError={() => setHasError(true)}
          />
        </div>
      ) : modelSrc && !hasError ? (
        <p className="muted">Menyiapkan model 3D untuk halaman ini...</p>
      ) : (
        <p className="muted">
          Model 3D belum bisa dirender inline pada halaman ini. Gunakan tombol di bawah untuk membuka asset aslinya.
        </p>
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
