export type CompetencyTag = "iman" | "taat" | "sabar" | "akhlak";
export type AssessmentPhase = "pretest" | "posttest";

export type StudentProfile = {
  nickname: string;
};

export type FlipbookPage = {
  id: string;
  title: string;
  objective: string;
  narration: string;
  pageTexture?: string;
};

export type VoiceAssetManifest = {
  pageId: string;
  src: string;
  durationHintSec?: number;
};

export type AssessmentQuestion = {
  id: string;
  phase: AssessmentPhase;
  competencyTag: CompetencyTag;
  question: string;
  options: string[];
  correctIndex: number;
};

export type AssessmentState = {
  completed: boolean;
  score: number | null;
  answers: number[];
  order: string[];
  completedAt?: string;
};

export type FlipbookState = {
  completedPages: string[];
  completed: boolean;
};

export type SessionReport = {
  deltaScore: number;
  summary: string;
};

export type LearningSessionV2 = {
  sessionId: string;
  profile: StudentProfile;
  startedAt: string;
  pretest: AssessmentState;
  flipbook: FlipbookState;
  posttest: AssessmentState;
  report?: SessionReport;
};
