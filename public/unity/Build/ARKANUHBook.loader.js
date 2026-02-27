/* eslint-disable no-console */
(function unityMockLoaderBootstrap() {
  "use strict";

  const COMMAND_EVENT_NAME = "arkanuh:unity:command";
  const EVENT_EVENT_NAME = "arkanuh:unity:event";

  function emitUnityEvent(eventPayload) {
    window.dispatchEvent(
      new CustomEvent(EVENT_EVENT_NAME, {
        detail: eventPayload
      })
    );
  }

  function createUnityInstance(canvas, _config, onProgress) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      return Promise.reject(new Error("Unity canvas tidak valid."));
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return Promise.reject(new Error("Canvas 2D context tidak tersedia."));
    }

    const runtimeState = {
      pageId: "1",
      title: "Memuat...",
      floatingText: "Menyiapkan scene.",
      accent: "#2f9bff",
      canAdvance: false,
      isFinalClosing: false,
      tilt: 0
    };

    let pointerDownX = 0;
    let rafId = 0;
    let mounted = true;

    const setProgress = (value) => {
      if (typeof onProgress === "function") {
        onProgress(value);
      }
    };

    setProgress(0.15);

    const resizeCanvas = () => {
      const targetWidth = Math.max(300, canvas.clientWidth || 0);
      const targetHeight = Math.max(220, canvas.clientHeight || 0);
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }
    };

    const onPointerDown = (event) => {
      pointerDownX = event.clientX;
    };

    const onPointerUp = (event) => {
      const deltaX = event.clientX - pointerDownX;
      if (Math.abs(deltaX) < 42) {
        return;
      }
      emitUnityEvent({
        type: deltaX < 0 ? "REQUEST_NEXT_PAGE" : "REQUEST_PREV_PAGE"
      });
    };

    const onTouchStart = (event) => {
      pointerDownX = event.changedTouches[0]?.clientX ?? 0;
    };

    const onTouchEnd = (event) => {
      const nextX = event.changedTouches[0]?.clientX ?? 0;
      const deltaX = nextX - pointerDownX;
      if (Math.abs(deltaX) < 42) {
        return;
      }
      emitUnityEvent({
        type: deltaX < 0 ? "REQUEST_NEXT_PAGE" : "REQUEST_PREV_PAGE"
      });
    };

    const commandListener = (event) => {
      const detail = event && event.detail ? event.detail : null;
      if (!detail || typeof detail !== "object") {
        return;
      }

      if (detail.type === "LOAD_PAGE") {
        runtimeState.pageId = String(detail.pageId || runtimeState.pageId);
        try {
          const payload = JSON.parse(detail.payload || "{}");
          runtimeState.title = payload.title || runtimeState.title;
          runtimeState.floatingText = payload.floatingText || runtimeState.floatingText;
          runtimeState.accent = payload.popupAccent || runtimeState.accent;
        } catch {
          runtimeState.title = "Halaman " + runtimeState.pageId;
        }
        runtimeState.isFinalClosing = false;
      } else if (detail.type === "SET_CAN_ADVANCE") {
        runtimeState.canAdvance = Boolean(detail.canAdvance);
      } else if (detail.type === "RESET_VIEW") {
        runtimeState.tilt = 0;
      } else if (detail.type === "PLAY_FINAL_CLOSE") {
        runtimeState.isFinalClosing = true;
        window.setTimeout(() => {
          emitUnityEvent({ type: "FINAL_CLOSE_DONE" });
        }, 1200);
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener(COMMAND_EVENT_NAME, commandListener);

    const renderLoop = (time) => {
      if (!mounted) {
        return;
      }

      resizeCanvas();
      const width = canvas.width;
      const height = canvas.height;
      const midX = width / 2;
      const midY = height / 2;
      const swing = Math.sin(time / 800) * 0.08;
      runtimeState.tilt += (swing - runtimeState.tilt) * 0.06;

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#dff3ff";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#c6e8ff";
      ctx.fillRect(0, height * 0.64, width, height * 0.36);

      ctx.save();
      ctx.translate(midX, midY + 8);
      ctx.rotate(runtimeState.tilt);

      ctx.fillStyle = "#1a7fd4";
      ctx.fillRect(-170, -72, 340, 172);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-156, -54, 312, 136);

      ctx.fillStyle = runtimeState.accent;
      ctx.fillRect(-70, -22, 140, 96);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillRect(-32, -6, 64, 62);

      ctx.fillStyle = "#0f2f4d";
      ctx.font = "700 19px 'Baloo 2', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(runtimeState.title, 0, -82);

      ctx.fillStyle = "#335f88";
      ctx.font = "600 13px 'Nunito', sans-serif";
      const statusText = runtimeState.isFinalClosing
        ? "Animasi penutupan buku..."
        : runtimeState.canAdvance
          ? "Siap lanjut ke halaman berikutnya"
          : "Selesaikan aktivitas dulu";
      ctx.fillText(statusText, 0, 112);

      ctx.restore();

      ctx.fillStyle = "#2a6daa";
      ctx.font = "600 13px 'Nunito', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Swipe kiri/kanan untuk flip halaman", width / 2, height - 16);

      rafId = window.requestAnimationFrame(renderLoop);
    };

    rafId = window.requestAnimationFrame(renderLoop);

    setProgress(0.7);
    window.setTimeout(() => {
      setProgress(1);
      emitUnityEvent({ type: "UNITY_READY" });
    }, 220);

    return Promise.resolve({
      SendMessage: function SendMessage() {
        // Bridge object untuk kompatibilitas API Unity resmi.
      },
      Quit: function Quit() {
        mounted = false;
        if (rafId) {
          window.cancelAnimationFrame(rafId);
        }
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("touchstart", onTouchStart);
        canvas.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("resize", resizeCanvas);
        window.removeEventListener(COMMAND_EVENT_NAME, commandListener);
        return Promise.resolve();
      }
    });
  }

  window.createUnityInstance = createUnityInstance;
})();
