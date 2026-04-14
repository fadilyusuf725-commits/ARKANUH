import { useEffect, useMemo, useRef, useState } from "react";

type VoiceNarrationProps = {
  text: string;
  title: string;
  audioSrc?: string;
  fallbackAudioSrc?: string;
  nextAudioSrc?: string;
  nextFallbackAudioSrc?: string;
  showText?: boolean;
  variant?: "card" | "compact";
};

type VoiceStatus = "idle" | "loading" | "playing" | "paused";
type PlaybackEngine = "audio_file" | "browser_tts";

function pickIndonesianVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  const exact = voices.find((voice) => voice.lang.toLowerCase() === "id-id");
  if (exact) {
    return exact;
  }

  return voices.find((voice) => voice.lang.toLowerCase().startsWith("id")) ?? null;
}

export function VoiceNarration({
  text,
  title,
  audioSrc,
  fallbackAudioSrc,
  nextAudioSrc,
  nextFallbackAudioSrc,
  showText = true,
  variant = "card"
}: VoiceNarrationProps) {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [engine, setEngine] = useState<PlaybackEngine>("browser_tts");
  const [audioReady, setAudioReady] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const narrationLabel = useMemo(() => `Narasi: ${title}`, [title]);
  const engineLabel = useMemo(() => (engine === "audio_file" ? "Audio File" : "TTS Browser"), [engine]);
  const canUseVoice = audioReady || ttsSupported;
  const statusLabel = useMemo(() => {
    switch (status) {
      case "loading":
        return "Memuat suara";
      case "playing":
        return "Sedang diputar";
      case "paused":
        return "Dijeda";
      default:
        return "Siap diputar";
    }
  }, [status]);

  useEffect(() => {
    if (typeof window === "undefined") {
      setTtsSupported(false);
      return;
    }

    if (!("speechSynthesis" in window)) {
      setTtsSupported(false);
      return;
    }

    const onVoicesChanged = () => {
      pickIndonesianVoice();
    };

    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = 0.92;
    audioRef.current = audio;

    const onPlay = () => setStatus("playing");
    const onPause = () => setStatus((value) => (value === "playing" ? "paused" : value));
    const onEnded = () => setStatus("idle");
    const onWaiting = () => setStatus("loading");

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("waiting", onWaiting);

    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("waiting", onWaiting);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const candidateSources = [audioSrc, fallbackAudioSrc].filter(Boolean) as string[];
    if (!audio) {
      setEngine("browser_tts");
      setAudioReady(false);
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    setStatus("idle");
    setAudioReady(false);

    if (candidateSources.length === 0) {
      setEngine("browser_tts");
      return;
    }

    let sourceIndex = 0;

    const onCanPlay = () => {
      setAudioReady(true);
      setEngine("audio_file");
      setStatus("idle");
    };

    const onError = () => {
      sourceIndex += 1;
      if (candidateSources[sourceIndex]) {
        audio.src = candidateSources[sourceIndex];
        audio.load();
        return;
      }

      setAudioReady(false);
      setEngine("browser_tts");
      setStatus("idle");
    };

    audio.addEventListener("canplaythrough", onCanPlay);
    audio.addEventListener("error", onError);
    setStatus("loading");
    audio.src = candidateSources[sourceIndex];
    audio.load();

    return () => {
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.removeEventListener("error", onError);
    };
  }, [audioSrc, fallbackAudioSrc]);

  useEffect(() => {
    const preloadSrc = nextAudioSrc ?? nextFallbackAudioSrc;
    if (!preloadSrc) {
      return;
    }

    const preloader = new Audio();
    preloader.preload = "auto";
    preloader.src = preloadSrc;
    preloader.load();

    return () => {
      preloader.src = "";
    };
  }, [nextAudioSrc, nextFallbackAudioSrc]);

  const stopAllPlayback = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setStatus("idle");
  };

  const speakFallbackTts = () => {
    if (!ttsSupported || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voice = pickIndonesianVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => setStatus("playing");
    utterance.onend = () => setStatus("idle");
    utterance.onpause = () => setStatus("paused");
    utterance.onresume = () => setStatus("playing");
    utterance.onerror = () => setStatus("idle");
    window.speechSynthesis.speak(utterance);
  };

  const play = async () => {
    if (!canUseVoice) {
      return;
    }

    if (engine === "audio_file" && audioReady && audioRef.current) {
      stopAllPlayback();
      try {
        await audioRef.current.play();
      } catch {
        setEngine("browser_tts");
        speakFallbackTts();
      }
      return;
    }

    speakFallbackTts();
  };

  const pause = () => {
    if (engine === "audio_file" && audioReady && audioRef.current) {
      audioRef.current.pause();
      setStatus("paused");
      return;
    }

    if (ttsSupported && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
      setStatus("paused");
    }
  };

  const resume = async () => {
    if (engine === "audio_file" && audioReady && audioRef.current) {
      try {
        await audioRef.current.play();
      } catch {
        setStatus("idle");
      }
      return;
    }

    if (ttsSupported && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
      setStatus("playing");
    }
  };

  const replay = async () => {
    if (!canUseVoice) {
      return;
    }

    if (engine === "audio_file" && audioReady && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      try {
        await audioRef.current.play();
      } catch {
        setStatus("idle");
      }
      return;
    }

    speakFallbackTts();
  };

  if (!canUseVoice) {
    if (variant === "compact") {
      return (
        <section className="reader-voice-inline is-disabled" aria-label={`Voice over ${title}`}>
          <div className="reader-voice-inline-meta">
            <span className="voice-mini-badge">VO</span>
            <span className="reader-voice-inline-status">Audio belum tersedia</span>
          </div>
        </section>
      );
    }

    return (
      <section className="card">
        <p className="eyebrow">Voice Over</p>
        <p>Perangkat ini belum mendukung audio file maupun text-to-speech.</p>
      </section>
    );
  }

  if (variant === "compact") {
    return (
      <section className="reader-voice-inline" aria-label={narrationLabel}>
        <div className="reader-voice-inline-meta">
          <span className="voice-mini-badge">VO</span>
          <div className="reader-voice-inline-text">
            <strong>Voice Over</strong>
            <span>
              {statusLabel} · {engineLabel}
            </span>
          </div>
        </div>
        <div className="voice-icon-strip">
          <button
            type="button"
            className="voice-icon-button is-primary"
            onClick={status === "paused" ? resume : play}
            disabled={status === "loading"}
            aria-label={status === "paused" ? "Lanjutkan voice over" : "Putar voice over"}
            title={status === "paused" ? "Lanjutkan" : "Putar"}
          >
            <span aria-hidden="true">{status === "paused" ? "▶" : "▶"}</span>
          </button>
          <button
            type="button"
            className="voice-icon-button"
            onClick={pause}
            disabled={status !== "playing"}
            aria-label="Jeda voice over"
            title="Jeda"
          >
            <span aria-hidden="true">⏸</span>
          </button>
          <button
            type="button"
            className="voice-icon-button"
            onClick={replay}
            disabled={status === "loading"}
            aria-label="Ulangi voice over"
            title="Ulang"
          >
            <span aria-hidden="true">↻</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="card voice-card">
      <div className="voice-header">
        <p className="eyebrow">Voice Over</p>
        <div className="voice-header-meta">
          <span className="status-pill">{status}</span>
          <span className="status-pill">{engineLabel}</span>
        </div>
      </div>

      {showText ? <p aria-label={narrationLabel}>{text}</p> : null}

      <div className="button-row">
        <button type="button" className="btn btn-primary" onClick={play} disabled={status === "loading"}>
          Putar
        </button>
        <button type="button" className="btn btn-outline" onClick={pause} disabled={status !== "playing"}>
          Jeda
        </button>
        <button type="button" className="btn btn-outline" onClick={resume} disabled={status !== "paused"}>
          Lanjut
        </button>
        <button type="button" className="btn btn-outline" onClick={replay} disabled={status === "loading"}>
          Ulang
        </button>
      </div>
    </section>
  );
}
