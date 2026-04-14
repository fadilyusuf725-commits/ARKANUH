import { ReactNode, useEffect, useMemo, useState } from "react";
import { AssessmentPhase, AssessmentQuestion } from "../types/domain";
import { useSessionContext } from "../state/SessionContext";

type CompletedScreenConfig = {
  eyebrow: string;
  getTitle: (score: number | null) => string;
  description: string;
  actions: ReactNode;
};

type AssessmentFlowProps = {
  phase: AssessmentPhase;
  title: string;
  intro: string;
  questions: AssessmentQuestion[];
  submitLabel: string;
  onSubmitted: () => void;
  completedScreen?: CompletedScreenConfig;
};

export function AssessmentFlow({
  phase,
  title,
  intro,
  questions,
  submitLabel,
  onSubmitted,
  completedScreen
}: AssessmentFlowProps) {
  const { session, ensureAssessmentOrder, setAssessmentAnswer, finalizeAssessment } = useSessionContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const questionIds = useMemo(() => questions.map((item) => item.id), [questions]);
  const assessment = session[phase];
  const totalQuestions = questions.length;

  useEffect(() => {
    ensureAssessmentOrder(phase, questionIds);
  }, [ensureAssessmentOrder, phase, questionIds]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [phase]);

  const orderedQuestions = useMemo(() => {
    if (assessment.order.length === 0) {
      return [];
    }

    const questionMap = new Map(questions.map((item) => [item.id, item]));
    return assessment.order
      .map((id) => questionMap.get(id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [assessment.order, questions]);

  useEffect(() => {
    setCurrentIndex((value) => Math.min(value, Math.max(orderedQuestions.length - 1, 0)));
  }, [orderedQuestions.length]);

  if (assessment.completed && completedScreen) {
    return (
      <main className="page-shell">
        <section className="hero-card assessment-hero">
          <p className="eyebrow">{completedScreen.eyebrow}</p>
          <h1>{completedScreen.getTitle(assessment.score)}</h1>
          <p className="subtitle">{completedScreen.description}</p>
        </section>
        <section className="card assessment-complete-card">{completedScreen.actions}</section>
      </main>
    );
  }

  if (orderedQuestions.length === 0) {
    return (
      <main className="page-shell">
        <section className="card route-loading-card" role="status" aria-live="polite">
          <p className="eyebrow">Memuat Soal</p>
          <h1>Menyiapkan {title.toLowerCase()}...</h1>
        </section>
      </main>
    );
  }

  const currentQuestion = orderedQuestions[currentIndex];
  const currentAnswer = assessment.answers[currentIndex] ?? -1;
  const answeredCount = assessment.answers.filter((answer) => answer >= 0).length;
  const allAnswered = answeredCount === totalQuestions;

  const onSelect = (optionIndex: number) => {
    setAssessmentAnswer(phase, currentIndex, optionIndex);
  };

  const onSubmit = () => {
    const score = orderedQuestions.reduce((total, question, index) => {
      return total + (question.correctIndex === assessment.answers[index] ? 1 : 0);
    }, 0);

    finalizeAssessment(phase, score);
    onSubmitted();
  };

  return (
    <main className="page-shell assessment-shell">
      <section className="hero-card assessment-hero">
        <p className="eyebrow">{phase === "pretest" ? "Pretest" : "Posttest"}</p>
        <h1>{title}</h1>
        <p className="subtitle">{intro}</p>
        <div className="assessment-status-row">
          <span className="assessment-status-pill">Soal {currentIndex + 1}/{totalQuestions}</span>
          <span className="assessment-status-pill">Jawab {answeredCount}/{totalQuestions}</span>
          <span className="assessment-status-pill">Kompetensi: {currentQuestion.competencyTag}</span>
        </div>
      </section>

      <section className="card assessment-card">
        <div className="assessment-progress-strip" aria-label={`Progress menjawab ${answeredCount} dari ${totalQuestions}`}>
          {orderedQuestions.map((question, index) => {
            const answer = assessment.answers[index] ?? -1;
            const className = [
              "assessment-progress-dot",
              answer >= 0 ? "is-complete" : "",
              index === currentIndex ? "is-current" : ""
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={question.id}
                type="button"
                className={className}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Buka soal ${index + 1}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        <div className="assessment-question-block">
          <p className="question-tag">Kompetensi: {currentQuestion.competencyTag}</p>
          <h2>{currentQuestion.question}</h2>
        </div>

        <div className="choice-list">
          {currentQuestion.options.map((option, optionIndex) => (
            <button
              key={option}
              type="button"
              className={`choice-button ${currentAnswer === optionIndex ? "is-selected" : ""}`}
              onClick={() => onSelect(optionIndex)}
              aria-pressed={currentAnswer === optionIndex}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="card assessment-footer-card">
        <div className="button-row assessment-footer-row">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
            disabled={currentIndex === 0}
          >
            Soal Sebelumnya
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setCurrentIndex((value) => Math.min(totalQuestions - 1, value + 1))}
            disabled={currentIndex === totalQuestions - 1}
          >
            Soal Berikutnya
          </button>
        </div>

        <button type="button" className="btn btn-primary btn-full" onClick={onSubmit} disabled={!allAnswered}>
          {submitLabel}
        </button>
      </section>
    </main>
  );
}
