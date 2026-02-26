export type InteractionType = "tap" | "drag" | "choice";
export type CompetencyTag = "iman" | "taat" | "sabar" | "akhlak";

export type StoryPage = {
  id: string;
  title: string;
  objective: string;
  markerImage: string;
  arAsset: string;
  voAudio: string;
  interactionType: InteractionType;
  interactionPrompt: string;
  completionRule: string;
  narration: string;
  interactionChoices?: string[];
  correctChoiceIndex?: number;
  interactionItems?: string[];
};

export type QuizQuestion = {
  id: string;
  pageId: string;
  question: string;
  options: string[];
  correctIndex: number;
  competencyTag: CompetencyTag;
};

export type LearningSession = {
  sessionId: string;
  nickname: string;
  startedAt: string;
  completedPages: string[];
  quizScore: number | null;
  quizAnswers: number[];
  finalizedAt?: string;
};
