import { LearningSession } from "../types/domain";

export const CURRENT_SESSION_KEY = "arkanuh_session_current";
export const SESSION_HISTORY_KEY = "arkanuh_session_history";
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

export function createNewSession(nickname = "Siswa Hebat"): LearningSession {
  return {
    sessionId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    nickname: normalizeNickname(nickname),
    startedAt: new Date().toISOString(),
    completedPages: [],
    quizScore: null,
    quizAnswers: []
  };
}

export function loadCurrentSession(): LearningSession | null {
  const data = readJson<LearningSession | null>(CURRENT_SESSION_KEY, null);
  if (!data) {
    return null;
  }
  return data;
}

export function saveCurrentSession(session: LearningSession) {
  writeJson(CURRENT_SESSION_KEY, session);
}

export function loadSessionHistory(): LearningSession[] {
  return readJson<LearningSession[]>(SESSION_HISTORY_KEY, []);
}

export function upsertSessionHistory(session: LearningSession): LearningSession[] {
  const currentHistory = loadSessionHistory().filter((item) => item.sessionId !== session.sessionId);
  const updatedHistory = [session, ...currentHistory].slice(0, MAX_HISTORY_ITEMS);
  writeJson(SESSION_HISTORY_KEY, updatedHistory);
  return updatedHistory;
}

export function removeSessionHistoryById(sessionId: string): LearningSession[] {
  const updatedHistory = loadSessionHistory().filter((item) => item.sessionId !== sessionId);
  writeJson(SESSION_HISTORY_KEY, updatedHistory);
  return updatedHistory;
}
