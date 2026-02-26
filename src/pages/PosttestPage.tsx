import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { flipbookPages } from "../data/flipbookPages";
import { posttestQuestions } from "../data/posttestQuestions";
import { useSessionContext } from "../state/SessionContext";

const POSTTEST_TOTAL = posttestQuestions.length;

export function PosttestPage() {
  const navigate = useNavigate();
  const { session, ensureAssessmentOrder, setAssessmentAnswer, finalizeAssessment } = useSessionContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const questionIds = useMemo(() => posttestQuestions.map((item) => item.id), []);

  useEffect(() => {
    ensureAssessmentOrder("posttest", questionIds);
  }, [ensureAssessmentOrder, questionIds]);

  const orderedQuestions = useMemo(() => {
    if (session.posttest.order.length === 0) {
      return [];
    }
    const questionMap = new Map(posttestQuestions.map((item) => [item.id, item]));
    return session.posttest.order
      .map((id) => questionMap.get(id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [session.posttest.order]);

  if (!session.pretest.completed) {
    return <Navigate to="/pretest" replace />;
  }

  if (!session.flipbook.completed) {
    const firstIncomplete = flipbookPages.find((page) => !session.flipbook.completedPages.includes(page.id));
    return <Navigate to={firstIncomplete ? `/flipbook/${firstIncomplete.id}` : "/mulai"} replace />;
  }

  if (session.posttest.completed) {
    return <Navigate to="/hasil-akhir" replace />;
  }

  if (orderedQuestions.length === 0) {
    return (
      <main className="page-shell">
        <section className="card">
          <p>Menyiapkan posttest...</p>
        </section>
      </main>
    );
  }

  const currentQuestion = orderedQuestions[currentIndex];
  const currentAnswer = session.posttest.answers[currentIndex] ?? -1;
  const answeredCount = session.posttest.answers.filter((answer) => answer >= 0).length;
  const allAnswered = answeredCount === POSTTEST_TOTAL;

  const onSelect = (optionIndex: number) => {
    setAssessmentAnswer("posttest", currentIndex, optionIndex);
  };

  const onSubmit = () => {
    const score = orderedQuestions.reduce((total, question, index) => {
      return total + (question.correctIndex === session.posttest.answers[index] ? 1 : 0);
    }, 0);
    finalizeAssessment("posttest", score);
    navigate("/hasil-akhir");
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Posttest</p>
        <h1>Posttest 10 Soal</h1>
        <p className="subtitle">
          Soal {currentIndex + 1}/{POSTTEST_TOTAL} | Terjawab {answeredCount}/{POSTTEST_TOTAL}
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
            onClick={() => setCurrentIndex((value) => Math.min(POSTTEST_TOTAL - 1, value + 1))}
            disabled={currentIndex === POSTTEST_TOTAL - 1}
          >
            Soal Berikutnya
          </button>
        </div>
        <button type="button" className="btn btn-primary btn-full" onClick={onSubmit} disabled={!allAnswered}>
          Kirim Posttest
        </button>
      </section>
    </main>
  );
}
