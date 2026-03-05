import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pretestQuestions } from "../data/pretestQuestions";
import { useSessionContext } from "../state/SessionContext";

const PRETEST_TOTAL = pretestQuestions.length;

export function PretestPage() {
  const navigate = useNavigate();
  const { session, ensureAssessmentOrder, setAssessmentAnswer, finalizeAssessment } = useSessionContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const questionIds = useMemo(() => pretestQuestions.map((item) => item.id), []);

  useEffect(() => {
    ensureAssessmentOrder("pretest", questionIds);
  }, [ensureAssessmentOrder, questionIds]);

  const orderedQuestions = useMemo(() => {
    if (session.pretest.order.length === 0) {
      return [];
    }
    const questionMap = new Map(pretestQuestions.map((item) => [item.id, item]));
    return session.pretest.order
      .map((id) => questionMap.get(id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [session.pretest.order]);

  if (session.pretest.completed) {
    return (
      <main className="page-shell">
        <section className="hero-card">
          <p className="eyebrow">Pretest Selesai</p>
          <h1>Skor Pretest: {session.pretest.score}/10</h1>
          <p className="subtitle">Pretest tidak perlu diulang pada sesi yang sama.</p>
        </section>
        <section className="card">
          <div className="button-row">
            <button type="button" className="btn btn-primary" onClick={() => navigate("/mulai")}>
              Lanjut ke Mulai
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/")}>
              Kembali ke Menu
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (orderedQuestions.length === 0) {
    return (
      <main className="page-shell">
        <section className="card">
          <p>Menyiapkan pretest...</p>
        </section>
      </main>
    );
  }

  const currentQuestion = orderedQuestions[currentIndex];
  const currentAnswer = session.pretest.answers[currentIndex] ?? -1;
  const answeredCount = session.pretest.answers.filter((answer) => answer >= 0).length;
  const allAnswered = answeredCount === PRETEST_TOTAL;

  const onSelect = (optionIndex: number) => {
    setAssessmentAnswer("pretest", currentIndex, optionIndex);
  };

  const onSubmit = () => {
    const score = orderedQuestions.reduce((total, question, index) => {
      return total + (question.correctIndex === session.pretest.answers[index] ? 1 : 0);
    }, 0);
    finalizeAssessment("pretest", score);
    navigate("/mulai");
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Pretest</p>
        <h1>Pretest Cerita Nabi Nuh</h1>
        <p className="subtitle">
          Soal {currentIndex + 1}/{PRETEST_TOTAL} - Jawab {answeredCount}/{PRETEST_TOTAL}
        </p>
      </section>

      <section className="card quiz-card">
        <p className="question-tag">Kompetensi: {currentQuestion.competencyTag}</p>
        <h2>{currentQuestion.question}</h2>
        <div className="choice-list">
          {currentQuestion.options.map((option, optionIndex) => (
            <button
              key={option}
              type="button"
              className={`choice-button ${currentAnswer === optionIndex ? "is-selected" : ""}`}
              onClick={() => onSelect(optionIndex)}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="button-row">
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
            onClick={() => setCurrentIndex((value) => Math.min(PRETEST_TOTAL - 1, value + 1))}
            disabled={currentIndex === PRETEST_TOTAL - 1}
          >
            Soal Berikutnya
          </button>
        </div>
        <button type="button" className="btn btn-primary btn-full" onClick={onSubmit} disabled={!allAnswered}>
          Selesai Pretest
        </button>
      </section>
    </main>
  );
}
