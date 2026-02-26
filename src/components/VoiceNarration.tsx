import { useEffect, useMemo, useState } from "react";

type VoiceNarrationProps = {
  text: string;
  title: string;
};

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

export function VoiceNarration({ text, title }: VoiceNarrationProps) {
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
      return;
    }

    const onVoicesChanged = () => {
      pickIndonesianVoice();
    };

    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
    };
  }, []);

  const narrationLabel = useMemo(() => `Narasi: ${title}`, [title]);

  const speak = () => {
    if (!isSupported || typeof window === "undefined") {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = 0.95;
    utterance.pitch = 1.02;
    utterance.volume = 1;
    const voice = pickIndonesianVoice();
    if (voice) {
      utterance.voice = voice;
    }
    utterance.onend = () => setStatus("idle");
    utterance.onpause = () => setStatus("paused");
    utterance.onresume = () => setStatus("playing");
    utterance.onerror = () => setStatus("idle");

    window.speechSynthesis.speak(utterance);
    setStatus("playing");
  };

  const pause = () => {
    if (!isSupported || typeof window === "undefined") {
      return;
    }
    window.speechSynthesis.pause();
    setStatus("paused");
  };

  const resume = () => {
    if (!isSupported || typeof window === "undefined") {
      return;
    }
    window.speechSynthesis.resume();
    setStatus("playing");
  };

  if (!isSupported) {
    return (
      <section className="card">
        <p className="eyebrow">Voice Over</p>
        <p>Perangkat ini belum mendukung text-to-speech browser.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="voice-header">
        <p className="eyebrow">Voice Over</p>
        <span className="status-pill">{status}</span>
      </div>
      <p aria-label={narrationLabel}>{text}</p>
      <div className="button-row">
        <button type="button" className="btn btn-primary" onClick={speak}>
          Putar
        </button>
        <button type="button" className="btn btn-outline" onClick={pause} disabled={status !== "playing"}>
          Jeda
        </button>
        <button type="button" className="btn btn-outline" onClick={resume} disabled={status !== "paused"}>
          Lanjut
        </button>
      </div>
    </section>
  );
}
