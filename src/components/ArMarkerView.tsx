import { useEffect, useMemo, useRef, useState } from "react";
import { StoryPage } from "../types/domain";

type ArMarkerViewProps = {
  page: StoryPage;
};

const scriptPromises = new Map<string, Promise<void>>();

function escapeHtml(input: string): string {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function loadScript(id: string, src: string): Promise<void> {
  if (scriptPromises.has(id)) {
    return scriptPromises.get(id)!;
  }

  const promise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
      } else {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error(`Gagal memuat ${src}`)), { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Gagal memuat ${src}`));
    document.body.appendChild(script);
  });

  scriptPromises.set(id, promise);
  return promise;
}

async function ensureArLibraries() {
  await loadScript("aframe-lib", "https://aframe.io/releases/1.4.2/aframe.min.js");
  await loadScript("arjs-lib", "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js");
}

function buildArEntity(page: StoryPage): string {
  if (page.interactionType === "drag") {
    return `<a-cylinder color="#4A90E2" radius="0.35" height="0.55" position="0 0.6 0">
      <a-animation attribute="rotation" to="0 360 0" dur="4500" repeat="indefinite"></a-animation>
    </a-cylinder>`;
  }

  if (page.interactionType === "choice") {
    return `<a-cone color="#F5A623" radius-bottom="0.36" radius-top="0.08" height="0.7" position="0 0.6 0">
      <a-animation attribute="rotation" to="0 360 0" dur="5000" repeat="indefinite"></a-animation>
    </a-cone>`;
  }

  return `<a-box color="#50E3C2" depth="0.45" height="0.45" width="0.45" position="0 0.55 0">
    <a-animation attribute="rotation" to="360 360 0" dur="4200" repeat="indefinite"></a-animation>
  </a-box>`;
}

function buildSceneMarkup(page: StoryPage): string {
  return `
    <a-scene
      embedded
      vr-mode-ui="enabled: false"
      renderer="logarithmicDepthBuffer: true;"
      arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
    >
      <a-marker preset="hiro">
        ${buildArEntity(page)}
        <a-text
          value="${escapeHtml(page.title)}"
          align="center"
          color="#1A365D"
          width="2.5"
          position="0 1.1 0"
          look-at="[camera]"
        ></a-text>
      </a-marker>
      <a-entity camera></a-entity>
    </a-scene>
  `;
}

export function ArMarkerView({ page }: ArMarkerViewProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneMarkup = useMemo(() => buildSceneMarkup(page), [page]);

  useEffect(() => {
    if (!cameraEnabled || !mountRef.current) {
      return;
    }

    let isMounted = true;
    setStatus("loading");
    setErrorMessage("");

    ensureArLibraries()
      .then(() => {
        if (!isMounted || !mountRef.current) {
          return;
        }
        mountRef.current.innerHTML = sceneMarkup;
        setStatus("ready");
      })
      .catch((error: Error) => {
        if (!isMounted) {
          return;
        }
        setStatus("error");
        setErrorMessage(error.message);
      });

    return () => {
      isMounted = false;
      if (mountRef.current) {
        mountRef.current.innerHTML = "";
      }
    };
  }, [cameraEnabled, sceneMarkup]);

  useEffect(() => {
    setCameraEnabled(false);
    setStatus("idle");
    setErrorMessage("");
  }, [page.id]);

  return (
    <section className="card">
      <p className="eyebrow">AR Marker-Based</p>
      <p>
        Gunakan marker cetak halaman ini. Untuk demo cepat, Anda bisa memakai marker standar <strong>HIRO</strong>.
      </p>
      <div className="marker-preview-wrap">
        <img src={page.markerImage} alt={`Marker halaman ${page.id}`} className="marker-preview" loading="lazy" />
      </div>
      {!cameraEnabled && (
        <button type="button" className="btn btn-primary" onClick={() => setCameraEnabled(true)}>
          Aktifkan Kamera AR
        </button>
      )}
      {status === "loading" && <p className="muted">Menyiapkan kamera dan engine AR...</p>}
      {status === "error" && (
        <p className="error-text">
          Gagal memuat AR. {errorMessage}. Pastikan izin kamera aktif dan koneksi internet tersedia.
        </p>
      )}
      <div className="ar-scene-host" ref={mountRef} />
      <p className="muted">Tip: arahkan kamera ke marker pada jarak 20-40 cm dengan cahaya ruangan yang cukup.</p>
    </section>
  );
}
