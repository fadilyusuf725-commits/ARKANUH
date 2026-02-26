import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  createReport,
  createNewSession,
  loadCurrentSession,
  loadSessionHistory,
  normalizeNickname,
  saveCurrentSession,
  upsertSessionHistory
} from "../lib/storage";
import { AssessmentPhase, LearningSessionV2 } from "../types/domain";

type SessionContextValue = {
  session: LearningSessionV2;
  history: LearningSessionV2[];
  setNickname: (nickname: string) => void;
  ensureAssessmentOrder: (phase: AssessmentPhase, questionIds: string[]) => void;
  setAssessmentAnswer: (phase: AssessmentPhase, index: number, answer: number) => void;
  finalizeAssessment: (phase: AssessmentPhase, score: number) => void;
  markFlipbookPageCompleted: (pageId: string, totalPages: number) => void;
  restartSession: (nickname?: string) => void;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

function shuffleIds(ids: string[]): string[] {
  const copy = [...ids];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const temp = copy[index];
    copy[index] = copy[swapIndex];
    copy[swapIndex] = temp;
  }
  return copy;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<LearningSessionV2>(() => loadCurrentSession() ?? createNewSession());
  const [history, setHistory] = useState<LearningSessionV2[]>(() => loadSessionHistory());

  useEffect(() => {
    saveCurrentSession(session);
  }, [session]);

  const setNickname = useCallback((nickname: string) => {
    setSession((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        nickname: normalizeNickname(nickname)
      }
    }));
  }, []);

  const ensureAssessmentOrder = useCallback((phase: AssessmentPhase, questionIds: string[]) => {
    setSession((prev) => {
      const current = prev[phase];
      if (current.order.length > 0) {
        return prev;
      }

      return {
        ...prev,
        [phase]: {
          ...current,
          order: shuffleIds(questionIds),
          answers: Array.from({ length: questionIds.length }, () => -1)
        }
      };
    });
  }, []);

  const setAssessmentAnswer = useCallback((phase: AssessmentPhase, index: number, answer: number) => {
    setSession((prev) => {
      const current = prev[phase];
      const answers = [...current.answers];
      while (answers.length <= index) {
        answers.push(-1);
      }
      answers[index] = answer;
      return {
        ...prev,
        [phase]: {
          ...current,
          answers
        }
      };
    });
  }, []);

  const finalizeAssessment = useCallback((phase: AssessmentPhase, score: number) => {
    setSession((prev) => {
      const updated: LearningSessionV2 = {
        ...prev,
        [phase]: {
          ...prev[phase],
          completed: true,
          score,
          completedAt: new Date().toISOString()
        }
      };

      if (phase === "posttest") {
        const pretestScore = updated.pretest.score ?? 0;
        const posttestScore = updated.posttest.score ?? 0;
        updated.report = createReport(pretestScore, posttestScore);
        setHistory(upsertSessionHistory(updated));
      }

      return updated;
    });
  }, []);

  const markFlipbookPageCompleted = useCallback((pageId: string, totalPages: number) => {
    setSession((prev) => {
      if (prev.flipbook.completedPages.includes(pageId)) {
        return prev;
      }

      const completedPages = [...prev.flipbook.completedPages, pageId].sort((a, b) => Number(a) - Number(b));
      return {
        ...prev,
        flipbook: {
          completedPages,
          completed: completedPages.length >= totalPages
        }
      };
    });
  }, []);

  const restartSession = useCallback((nickname?: string) => {
    const nextNickname = nickname ? normalizeNickname(nickname) : session.profile.nickname;
    setSession(createNewSession(nextNickname));
  }, [session.profile.nickname]);

  const value = useMemo(
    () => ({
      session,
      history,
      setNickname,
      ensureAssessmentOrder,
      setAssessmentAnswer,
      finalizeAssessment,
      markFlipbookPageCompleted,
      restartSession
    }),
    [
      ensureAssessmentOrder,
      finalizeAssessment,
      history,
      markFlipbookPageCompleted,
      restartSession,
      session,
      setAssessmentAnswer,
      setNickname
    ]
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
