export type InteractionType = "tap" | "drag" | "choice";
export type CompetencyTag = "iman" | "taat" | "sabar" | "akhlak";
export type AssessmentPhase = "pretest" | "posttest";
export type PopupTemplate = "ark" | "rain" | "mountain" | "wave" | "light";
export type BookAnimState = "cover_intro" | "drop_in" | "idle" | "flipping" | "final_close";
export type FlipbookRenderer = "unity_webgl";
export type StoryLayoutStyle = "ppt_story";

export type StudentProfile = {
  nickname: string;
};

export type SlideLayerAsset = {
  src: string;
  alt: string;
  zIndex: number;
  effect?: "fade" | "slide_up" | "none";
};

export type SlideLayout = {
  style: StoryLayoutStyle;
  pageBadgeLabel: string;
  layers: SlideLayerAsset[];
  bodyText: string;
  emphasizeText?: string;
};

export type FlipbookPage = {
  id: string;
  title: string;
  objective: string;
  narration: string;
  arAsset: string;
  voAudio: string;
  interactionType: InteractionType;
  interactionPrompt: string;
  completionRule: string;
  interactionChoices?: string[];
  correctChoiceIndex?: number;
  interactionItems?: string[];
  popupTemplate: PopupTemplate;
  floatingText: string;
  popupAccent: string;
  coverTitle?: string;
  backCoverSummary?: string[];
  slideLayout: SlideLayout;
};

export type PopupViewState = {
  yaw: number;
  pitch: number;
  autoRotate: boolean;
};

export type UnityCommand =
  | { type: "LOAD_PAGE"; pageId: string; payload: string }
  | { type: "SET_CAN_ADVANCE"; canAdvance: boolean }
  | { type: "RESET_VIEW" }
  | { type: "PLAY_FINAL_CLOSE" };

export type UnityEvent =
  | { type: "UNITY_READY" }
  | { type: "REQUEST_NEXT_PAGE" }
  | { type: "REQUEST_PREV_PAGE" }
  | { type: "FINAL_CLOSE_DONE" };

export type UnityPagePayload = {
  id: string;
  title: string;
  popupTemplate: PopupTemplate;
  popupAccent: string;
  floatingText: string;
  coverTitle?: string;
  backCoverSummary?: string[];
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
