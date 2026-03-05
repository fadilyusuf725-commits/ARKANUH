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

const UNITY_ASSET_VERSION = "20260305b";
const withUnityAssetVersion = (path: string) => `${withBasePath(path)}?v=${UNITY_ASSET_VERSION}`;

const UNITY_BUILD_VARIANTS: UnityBuildVariant[] = [
  {
    id: "unity",
    loaderSrc: withUnityAssetVersion("unity/Build/unity.loader.js"),
    config: {
      dataUrl: withUnityAssetVersion("unity/Build/unity.data.unityweb"),
      frameworkUrl: withUnityAssetVersion("unity/Build/unity.framework.js.unityweb"),
      codeUrl: withUnityAssetVersion("unity/Build/unity.wasm.unityweb"),
      streamingAssetsUrl: withUnityAssetVersion("unity/StreamingAssets"),
      companyName: "ARKANUH",
      productName: "ARKANUHBook",
      productVersion: "4.0.0"
    }
  }
];

function formatUnityError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }
  if (typeof error === "object" && error !== null) {
    try {
      const asRecord = error as Record<string, unknown>;
      if (typeof asRecord.message === "string" && asRecord.message.trim().length > 0) {
        return asRecord.message;
      }
      return JSON.stringify(error);
    } catch {
      return "Gagal memuat Unity (error object tidak terbaca).";
    }
  }
  return "Gagal memuat Unity.";
}

function detectWebGL2SupportIssue() {
  if (typeof document === "undefined") {
    return null;
  }
  const canvas = document.createElement("canvas");
  const gl2 = canvas.getContext("webgl2");
  if (!gl2) {
    return "Perangkat/browser belum mendukung WebGL 2. Gunakan Chrome Android terbaru atau perangkat lain.";
  }
  return null;
}

type UnityFlipbookCanvasProps = {
  page: FlipbookPage;
  currentIndex: number;
  totalPages: number;
  canAdvance: boolean;
  triggerFinalClose: boolean;
  onRequestNext: () => void;
  onRequestPrev: () => void;
  onFinalCloseComplete: () => void;
  compact?: boolean;
};

function ensureLoaderScript(src: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window tidak tersedia."));
  }

  // Check if script is already loaded and ready
  const existing = document.querySelector<HTMLScriptElement>(`script[data-unity-loader='${src}']`);
  if (existing) {
    if (existing.dataset.loaded === "true") {
      // Already loaded successfully
      return Promise.resolve();
    }
    if (existing.dataset.loaded === "loading") {
      // Currently loading - wait for it
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (existing.dataset.loaded === "true") {
            clearInterval(checkInterval);
            resolve();
          } else if (existing.dataset.loaded === "error") {
            clearInterval(checkInterval);
            reject(new Error("Unity loader gagal dimuat."));
          }
        }, 50);
        // Timeout after 30 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error("Unity loader timeout."));
        }, 30000);
      });
    }
  }

  // Create new script
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.unityLoader = src;
    script.dataset.loaded = "loading";

    const timeoutId = setTimeout(() => {
      script.dataset.loaded = "error";
      reject(new Error("Unity loader timeout."));
    }, 30000);

    script.onload = () => {
      clearTimeout(timeoutId);
      script.dataset.loaded = "true";
      resolve();
    };

    script.onerror = () => {
      clearTimeout(timeoutId);
      script.dataset.loaded = "error";
      reject(new Error("Unity loader gagal dimuat."));
    };

    document.body.appendChild(script);
  });
}

// Unity loader sometimes tries to query with empty/invalid selectors
// This is handled gracefully by browsers, no need for custom patching
function installUnitySelectorGuard() {
  // No longer needed - browsers handle invalid selectors correctly
}

export function UnityFlipbookCanvas({
  page,
  currentIndex,
  totalPages,
  canAdvance,
  triggerFinalClose,
  onRequestNext,
  onRequestPrev,
  onFinalCloseComplete,
  compact = false
}: UnityFlipbookCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const unityInstanceRef = useRef<UnityInstance | null>(null);
  const onRequestNextRef = useRef(onRequestNext);
  const onRequestPrevRef = useRef(onRequestPrev);
  const onFinalCloseCompleteRef = useRef(onFinalCloseComplete);
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
      modelKey: page.modelKey,
      pageTexture: page.pageTexture,
      coverTitle: page.coverTitle,
      backCoverSummary: page.backCoverSummary
    }),
    [page]
  );

  useEffect(() => {
    onRequestNextRef.current = onRequestNext;
    onRequestPrevRef.current = onRequestPrev;
    onFinalCloseCompleteRef.current = onFinalCloseComplete;
  }, [onFinalCloseComplete, onRequestNext, onRequestPrev]);

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
      const webglIssue = detectWebGL2SupportIssue();
      if (webglIssue) {
        initErrors.push(`[webgl2] ${webglIssue}`);
      }

      installUnitySelectorGuard();

      for (const variant of UNITY_BUILD_VARIANTS) {
        try {
          setStatusMessage(`Memuat renderer Unity (${variant.id})...`);
          
          try {
            await ensureLoaderScript(variant.loaderSrc);
          } catch (scriptError) {
            initErrors.push(`[${variant.id}] ${formatUnityError(scriptError)}`);
            continue;
          }

          if (isCancelled) {
            return;
          }

          const loader = getUnityLoader();
          if (!loader) {
            initErrors.push(`[${variant.id}] createUnityInstance tidak ditemukan.`);
            continue;
          }

          let unityInstance: UnityInstance | null = null;
          try {
            unityInstance = await loader(
              canvasRef.current,
              {
                ...variant.config,
                keyboardListeningElement: canvasRef.current
              },
              (nextProgress) => {
                if (isCancelled) {
                  return;
                }
                setProgress(nextProgress);
                setStatusMessage(`Memuat renderer Unity (${variant.id})... ${Math.round(nextProgress * 100)}%`);
              }
            );
          } catch (loaderError) {
            initErrors.push(`[${variant.id}] ${formatUnityError(loaderError)}`);
            continue;
          }

          if (isCancelled) {
            if (unityInstance?.Quit) {
              try {
                await unityInstance.Quit();
              } catch {
                // Cleanup error, ignore
              }
            }
            return;
          }

          if (!unityInstance) {
            initErrors.push(`[${variant.id}] Unity instance tidak valid.`);
            continue;
          }

          unityInstanceRef.current = unityInstance;
          setStatus("ready");
          setStatusMessage(`Unity siap (${variant.id}).`);
          emitUnityEvent({ type: "UNITY_READY" });

          unsubscribe = subscribeUnityEvents((event) => {
            if (event.type === "REQUEST_NEXT_PAGE") {
              onRequestNextRef.current();
              return;
            }
            if (event.type === "REQUEST_PREV_PAGE") {
              onRequestPrevRef.current();
              return;
            }
            if (event.type === "FINAL_CLOSE_DONE") {
              onFinalCloseCompleteRef.current();
            }
          });
          return;
        } catch (error) {
          initErrors.push(`[${variant.id}] ${formatUnityError(error)}`);
        }
      }

      // All variants failed
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
        currentInstance.Quit().catch(() => {
          // Cleanup error, ignore silently
        });
      }
    };
  }, []);

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
    <section className={`card unity-stage-card ${compact ? "is-compact" : ""}`}>
      <div className="unity-stage-toolbar">
        <div>
          <p className="eyebrow">Pop-up 3D</p>
          <p className="muted">
            Halaman {currentIndex + 1}/{totalPages}
          </p>
        </div>
        <button type="button" className="btn btn-outline" onClick={onResetView} disabled={status !== "ready"}>
          Reset View
        </button>
      </div>

      <div className="unity-canvas-wrap">
        <canvas id="unity-canvas" ref={canvasRef} className="unity-canvas" tabIndex={-1} />
        {status !== "ready" && (
          <div className={`unity-status ${status === "error" ? "is-error" : ""}`}>
            <p>{statusMessage}</p>
            {status === "loading" && <p className="muted">Progress: {Math.round(progress * 100)}%</p>}
            {status === "error" && (
              <>
                <p className="muted">
                  Build Unity WebGL belum terbaca atau cache lama masih dipakai. Coba refresh paksa / mode samaran.
                </p>
                <p className="muted">Jika masih gagal, kirim teks error di atas persis apa adanya.</p>
              </>
            )}
          </div>
        )}
      </div>

      <p className="muted">
        Geser kiri atau kanan di area 3D untuk membalik halaman, atau gunakan tombol navigasi di bawah.
      </p>
    </section>
  );
}
