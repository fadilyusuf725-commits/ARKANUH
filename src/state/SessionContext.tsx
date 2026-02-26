import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import {
  createNewSession,
  loadCurrentSession,
  loadSessionHistory,
  normalizeNickname,
  removeSessionHistoryById,
  saveCurrentSession,
  upsertSessionHistory
} from "../lib/storage";
import { LearningSession } from "../types/domain";

type SessionContextValue = {
  session: LearningSession;
  history: LearningSession[];
  setNickname: (nickname: string) => void;
  markPageCompleted: (pageId: string) => void;
  setQuizResult: (score: number, answers: number[]) => void;
  clearQuizResult: () => void;
  restartSession: (nickname?: string) => void;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<LearningSession>(() => loadCurrentSession() ?? createNewSession());
  const [history, setHistory] = useState<LearningSession[]>(() => loadSessionHistory());

  useEffect(() => {
    saveCurrentSession(session);
  }, [session]);

  const setNickname = (nickname: string) => {
    setSession((prev) => ({ ...prev, nickname: normalizeNickname(nickname) }));
  };

  const markPageCompleted = (pageId: string) => {
    setSession((prev) => {
      if (prev.completedPages.includes(pageId)) {
        return prev;
      }

      return {
        ...prev,
        completedPages: [...prev.completedPages, pageId].sort((a, b) => Number(a) - Number(b))
      };
    });
  };

  const setQuizResult = (score: number, answers: number[]) => {
    setSession((prev) => {
      const finalizedSession: LearningSession = {
        ...prev,
        quizScore: score,
        quizAnswers: answers,
        finalizedAt: new Date().toISOString()
      };
      setHistory(upsertSessionHistory(finalizedSession));
      return finalizedSession;
    });
  };

  const clearQuizResult = () => {
    setSession((prev) => {
      if (prev.quizScore !== null) {
        setHistory(removeSessionHistoryById(prev.sessionId));
      }
      return {
        ...prev,
        quizScore: null,
        quizAnswers: [],
        finalizedAt: undefined
      };
    });
  };

  const restartSession = (nickname?: string) => {
    const nextNickname = nickname ? normalizeNickname(nickname) : session.nickname;
    setSession(createNewSession(nextNickname));
  };

  const value = useMemo(
    () => ({
      session,
      history,
      setNickname,
      markPageCompleted,
      setQuizResult,
      clearQuizResult,
      restartSession
    }),
    [history, session]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext harus dipakai di dalam SessionProvider.");
  }
  return context;
}
