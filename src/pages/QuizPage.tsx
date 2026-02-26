import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { quizQuestions } from "../data/quizQuestions";
import { storyPages } from "../data/storyPages";
import { useSessionContext } from "../state/SessionContext";

export function QuizPage() {
  const navigate = useNavigate();
  const { session, setQuizResult } = useSessionContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    session.quizAnswers.length === quizQuestions.length
      ? session.quizAnswers
      : Array.from({ length: quizQuestions.length }, () => -1)
  );

  useEffect(() => {
    setAnswers(
      session.quizAnswers.length === quizQuestions.length
        ? session.quizAnswers
        : Array.from({ length: quizQuestions.length }, () => -1)
    );
    setCurrentIndex(0);
  }, [session.quizAnswers, session.sessionId]);

  const allPagesCompleted = session.completedPages.length >= storyPages.length;

  const currentQuestion = quizQuestions[currentIndex];
  const selectedOption = answers[currentIndex];
  const answeredCount = answers.filter((item) => item >= 0).length;
  const allAnswered = answeredCount === quizQuestions.length;

  const progressText = useMemo(
    () => `Soal ${currentIndex + 1} dari ${quizQuestions.length} • Terjawab ${answeredCount}/${quizQuestions.length}`,
    [answeredCount, currentIndex]
  );

  if (!allPagesCompleted) {
    const firstIncomplete = storyPages.find((page) => !session.completedPages.includes(page.id));
    return <Navigate to={firstIncomplete ? `/buku/${firstIncomplete.id}` : "/"} replace />;
  }

  const onSelectOption = (optionIndex: number) => {
    setAnswers((prev) => prev.map((value, index) => (index === currentIndex ? optionIndex : value)));
  };

  const onSubmit = () => {
    const score = answers.reduce((total, answer, index) => {
      const isCorrect = quizQuestions[index].correctIndex === answer;
      return total + (isCorrect ? 1 : 0);
    }, 0);

    setQuizResult(score, answers);
    navigate("/hasil");
  };

  return (
    <main className="page-shell">
      <section className="card">
        <p className="eyebrow">Kuis Formatif</p>
        <h1>Kuis Kisah Nabi Nuh</h1>
        <p>{progressText}</p>
      </section>

      <section className="card quiz-card">
        <p className="question-tag">Kompetensi: {currentQuestion.competencyTag}</p>
        <h2>{currentQuestion.question}</h2>
        <div className="choice-list">
          {currentQuestion.options.map((option, optionIndex) => (
            <button
              key={option}
              type="button"
              className={`choice-button ${selectedOption === optionIndex ? "is-selected" : ""}`}
              onClick={() => onSelectOption(optionIndex)}
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
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
          >
            Soal Sebelumnya
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setCurrentIndex((prev) => Math.min(quizQuestions.length - 1, prev + 1))}
            disabled={currentIndex === quizQuestions.length - 1}
          >
            Soal Berikutnya
          </button>
        </div>
        <button type="button" className="btn btn-primary btn-full" onClick={onSubmit} disabled={!allAnswered}>
          Kirim Jawaban
        </button>
      </section>
    </main>
  );
}
