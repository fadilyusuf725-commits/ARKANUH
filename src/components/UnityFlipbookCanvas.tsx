import { useEffect, useMemo, useRef, useState } from "react";
import { FlipbookPage, UnityPagePayload } from "../types/domain";
import { withBasePath } from "../lib/assetPaths";
import {
  buildUnityPagePayload,
  emitUnityEvent,
  getUnityLoader,
  sendUnityCommand,
  subscribeUnityEvents,
  UnityInstance
} from "../lib/unityBridge";

type UnityBuildVariant = {
  id: string;
  loaderSrc: string;
  config: {
    dataUrl: string;
    frameworkUrl: string;
    codeUrl: string;
    streamingAssetsUrl: string;
    companyName: string;
    productName: string;
    productVersion: string;
  };
};

const UNITY_BUILD_VARIANTS: UnityBuildVariant[] = [
  {
    id: "ARKANUHBook",
    loaderSrc: withBasePath("unity/Build/ARKANUHBook.loader.js"),
    config: {
      dataUrl: withBasePath("unity/Build/ARKANUHBook.data.unityweb"),
      frameworkUrl: withBasePath("unity/Build/ARKANUHBook.framework.js.unityweb"),
      codeUrl: withBasePath("unity/Build/ARKANUHBook.wasm.unityweb"),
      streamingAssetsUrl: withBasePath("unity/StreamingAssets"),
      companyName: "ARKANUH",
      productName: "ARKANUHBook",
      productVersion: "4.0.0"
    }
  },
  {
    id: "unity",
    loaderSrc: withBasePath("unity/Build/unity.loader.js"),
    config: {
      dataUrl: withBasePath("unity/Build/unity.data.unityweb"),
      frameworkUrl: withBasePath("unity/Build/unity.framework.js.unityweb"),
      codeUrl: withBasePath("unity/Build/unity.wasm.unityweb"),
      streamingAssetsUrl: withBasePath("unity/StreamingAssets"),
      companyName: "ARKANUH",
      productName: "ARKANUHBook",
      productVersion: "4.0.0"
    }
  }
];

type UnityFlipbookCanvasProps = {
  page: FlipbookPage;
  currentIndex: number;
  totalPages: number;
  canAdvance: boolean;
  triggerFinalClose: boolean;
  onRequestNext: () => void;
  onRequestPrev: () => void;
  onFinalCloseComplete: () => void;
};

function ensureLoaderScript(src: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window tidak tersedia."));
  }

  const existing = document.querySelector<HTMLScriptElement>(`script[data-unity-loader='${src}']`);
  if (existing?.dataset.loaded === "true") {
    return Promise.resolve();
  }

  if (existing && existing.dataset.loaded !== "true") {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Loader Unity gagal dimuat.")), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.unityLoader = src;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error("Loader Unity gagal dimuat."));
    document.body.appendChild(script);
  });
}

export function UnityFlipbookCanvas({
  page,
  currentIndex,
  totalPages,
  canAdvance,
  triggerFinalClose,
  onRequestNext,
  onRequestPrev,
  onFinalCloseComplete
}: UnityFlipbookCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const unityInstanceRef = useRef<UnityInstance | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Memuat renderer Unity...");

  const pagePayload = useMemo<UnityPagePayload>(
    () => ({
      id: page.id,
      title: page.title,
      popupTemplate: page.popupTemplate,
      popupAccent: page.popupAccent,
      floatingText: page.floatingText,
      coverTitle: page.coverTitle,
      backCoverSummary: page.backCoverSummary
    }),
    [page]
  );

  useEffect(() => {
    let isCancelled = false;
    let unsubscribe: () => void = () => undefined;

    const init = async () => {
      if (!canvasRef.current) {
        setStatus("error");
        setStatusMessage("Canvas Unity tidak tersedia.");
        return;
      }

      const initErrors: string[] = [];

      for (const variant of UNITY_BUILD_VARIANTS) {
        try {
          setStatusMessage(`Memuat renderer Unity (${variant.id})...`);
          await ensureLoaderScript(variant.loaderSrc);
          if (isCancelled) {
            return;
          }

          const loader = getUnityLoader();
          if (!loader) {
            initErrors.push(`[${variant.id}] createUnityInstance tidak ditemukan.`);
            continue;
          }

          const unityInstance = await loader(canvasRef.current, variant.config, (nextProgress) => {
            if (isCancelled) {
              return;
            }
            setProgress(nextProgress);
            setStatusMessage(`Memuat renderer Unity (${variant.id})... ${Math.round(nextProgress * 100)}%`);
          });

          if (isCancelled) {
            if (unityInstance?.Quit) {
              await unityInstance.Quit().catch(() => undefined);
            }
            return;
          }

          unityInstanceRef.current = unityInstance;
          setStatus("ready");
          setStatusMessage(`Unity siap (${variant.id}).`);
          emitUnityEvent({ type: "UNITY_READY" });

          unsubscribe = subscribeUnityEvents((event) => {
            if (event.type === "REQUEST_NEXT_PAGE") {
              onRequestNext();
              return;
            }
            if (event.type === "REQUEST_PREV_PAGE") {
              onRequestPrev();
              return;
            }
            if (event.type === "FINAL_CLOSE_DONE") {
              onFinalCloseComplete();
            }
          });
          return;
        } catch (error) {
          initErrors.push(`[${variant.id}] ${error instanceof Error ? error.message : "Gagal memuat."}`);
        }
      }

      setStatus("error");
      setStatusMessage(initErrors.length > 0 ? initErrors[initErrors.length - 1] : "Gagal memuat Unity.");
    };

    init();

    return () => {
      isCancelled = true;
      unsubscribe();
      const currentInstance = unityInstanceRef.current;
      unityInstanceRef.current = null;
      if (currentInstance?.Quit) {
        currentInstance.Quit().catch(() => undefined);
      }
    };
  }, [onFinalCloseComplete, onRequestNext, onRequestPrev]);

  useEffect(() => {
    if (status !== "ready") {
      return;
    }

    sendUnityCommand(unityInstanceRef.current, {
      type: "LOAD_PAGE",
      pageId: page.id,
      payload: buildUnityPagePayload(pagePayload)
    });
  }, [page.id, pagePayload, status]);

  useEffect(() => {
    if (status !== "ready") {
      return;
    }

    sendUnityCommand(unityInstanceRef.current, {
      type: "SET_CAN_ADVANCE",
      canAdvance
    });
  }, [canAdvance, status]);

  useEffect(() => {
    if (status !== "ready" || !triggerFinalClose) {
      return;
    }

    setStatusMessage("Menjalankan animasi akhir...");
    sendUnityCommand(unityInstanceRef.current, { type: "PLAY_FINAL_CLOSE" });
  }, [status, triggerFinalClose]);

  const onResetView = () => {
    if (status !== "ready") {
      return;
    }
    sendUnityCommand(unityInstanceRef.current, { type: "RESET_VIEW" });
  };

  return (
    <section className="card unity-stage-card">
      <div className="unity-stage-toolbar">
        <div>
          <p className="eyebrow">Unity Flipbook</p>
          <p className="muted">
            Halaman {currentIndex + 1}/{totalPages}
          </p>
        </div>
        <button type="button" className="btn btn-outline" onClick={onResetView} disabled={status !== "ready"}>
          Reset View
        </button>
      </div>

      <div className="unity-canvas-wrap">
        <canvas ref={canvasRef} className="unity-canvas" />
        {status !== "ready" && (
          <div className={`unity-status ${status === "error" ? "is-error" : ""}`}>
            <p>{statusMessage}</p>
            {status === "loading" && <p className="muted">Progress: {Math.round(progress * 100)}%</p>}
            {status === "error" && (
              <p className="muted">
                Build Unity WebGL belum terbaca atau cache lama masih dipakai. Coba refresh paksa / mode samaran.
              </p>
            )}
          </div>
        )}
      </div>

      <p className="muted">
        Swipe di area buku untuk berpindah halaman. React tetap mengunci halaman berikutnya sampai aktivitas selesai.
      </p>
    </section>
  );
}
