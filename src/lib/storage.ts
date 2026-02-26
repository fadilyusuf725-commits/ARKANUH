import { LearningSessionV2, SessionReport } from "../types/domain";

export const CURRENT_SESSION_KEY = "arkanuh_v2_session_current";
export const SESSION_HISTORY_KEY = "arkanuh_v2_session_history";
const MAX_HISTORY_ITEMS = 25;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, data: T) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(data));
}

export function normalizeNickname(input: string): string {
  const trimmed = input.trim();
  return trimmed.length > 0 ? trimmed : "Siswa Hebat";
}

function createDefaultAssessmentState() {
  return {
    completed: false,
    score: null,
    answers: [],
    order: []
  };
}

export function createNewSession(nickname = "Siswa Hebat"): LearningSessionV2 {
  return {
    sessionId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    profile: {
      nickname: normalizeNickname(nickname)
    },
    startedAt: new Date().toISOString(),
    pretest: createDefaultAssessmentState(),
    flipbook: {
      completedPages: [],
      completed: false
    },
    posttest: createDefaultAssessmentState()
  };
}

export function loadCurrentSession(): LearningSessionV2 | null {
  const data = readJson<LearningSessionV2 | null>(CURRENT_SESSION_KEY, null);
  if (!data) {
    return null;
  }
  return data;
}

export function saveCurrentSession(session: LearningSessionV2) {
  writeJson(CURRENT_SESSION_KEY, session);
}

export function loadSessionHistory(): LearningSessionV2[] {
  return readJson<LearningSessionV2[]>(SESSION_HISTORY_KEY, []);
}

export function upsertSessionHistory(session: LearningSessionV2): LearningSessionV2[] {
  const currentHistory = loadSessionHistory().filter((item) => item.sessionId !== session.sessionId);
  const updatedHistory = [session, ...currentHistory].slice(0, MAX_HISTORY_ITEMS);
  writeJson(SESSION_HISTORY_KEY, updatedHistory);
  return updatedHistory;
}

export function removeSessionHistoryById(sessionId: string): LearningSessionV2[] {
  const updatedHistory = loadSessionHistory().filter((item) => item.sessionId !== sessionId);
  writeJson(SESSION_HISTORY_KEY, updatedHistory);
  return updatedHistory;
}

export function createReport(pretestScore: number, posttestScore: number): SessionReport {
  const delta = posttestScore - pretestScore;
  if (delta >= 4) {
    return {
      deltaScore: delta,
      summary: "Peningkatan sangat baik. Pemahaman kisah Nabi Nuh bertambah kuat."
    };
  }

  if (delta >= 1) {
    return {
      deltaScore: delta,
      summary: "Ada peningkatan yang baik. Teruskan latihan memahami hikmah cerita."
    };
  }

  if (delta === 0) {
    return {
      deltaScore: delta,
      summary: "Skor stabil. Ulangi bagian cerita penting untuk memperdalam pemahaman."
    };
  }

  return {
    deltaScore: delta,
    summary: "Skor menurun. Perlu pendampingan ulang pada bagian inti cerita dan nilai teladan."
  };
}
