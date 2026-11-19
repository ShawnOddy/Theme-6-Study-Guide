import { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import {
  QUIZ_QUESTIONS,
  QUIZ_TRACKS,
  QuizQuestion,
  QuizTrackMeta,
} from '../data/theme6Data';

interface QuizSectionProps {
  bestQuizScores: Record<string, number>;
  onSaveQuizScore: (trackId: string, percentage: number) => void;
}

function buildTrackQuestions(trackId: QuizTrackMeta['id']): QuizQuestion[] {
  if (trackId === 'full-review') {
    // Balanced 15-question 30-2 comprehensive review: 5 from each track
    const c = QUIZ_QUESTIONS.filter((q) => q.track === 'communism').slice(0, 5);
    const f = QUIZ_QUESTIONS.filter((q) => q.track === 'fascism').slice(0, 5);
    const t = QUIZ_QUESTIONS.filter((q) => q.track === 'techniques').slice(0, 5);
    return [...c, ...f, ...t];
  }
  return QUIZ_QUESTIONS.filter((q) => q.track === trackId);
}

export function QuizSection({
  bestQuizScores,
  onSaveQuizScore,
}: QuizSectionProps) {
  const [activeTrackId, setActiveTrackId] = useState<
    QuizTrackMeta['id'] | null
  >(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'missed'>('all');

  const startTrack = (trackId: QuizTrackMeta['id']) => {
    const qs = buildTrackQuestions(trackId);
    setActiveTrackId(trackId);
    setQuestions(qs);
    setCurrentIdx(0);
    setAnswers({});
    setShowResults(false);
    setReviewFilter('all');
  };

  const currentQuestion = questions[currentIdx];
  const selectedAnswer = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;
  const hasAnsweredCurrent = selectedAnswer !== undefined;

  const handleSelectOption = (optionIdx: number) => {
    if (!currentQuestion || hasAnsweredCurrent) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIdx }));
  };

  const handleNextOrFinish = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else if (activeTrackId) {
      const correctTotal = questions.reduce(
        (sum, q) => (answers[q.id] === q.correctIndex ? sum + 1 : sum),
        0,
      );
      const pct = Math.round((correctTotal / questions.length) * 100);
      onSaveQuizScore(activeTrackId, pct);
      setShowResults(true);
    }
  };

  // Track Selector View
  if (!activeTrackId) {
    return (
      <div className="space-y-8">
        <div className="border-b border-slate-200 pb-6">
          <p className="text-xs font-medium text-slate-500">
            Check Your Understanding · Social Studies 30-2 Practice
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 mt-1">
            Theme 6 Practice Quizzes
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl">
            Quiz yourself by topic as you study or take the 15-question Full
            Theme 6 Practice Test. Every question explains why the correct answer
            fits 30-2 outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {QUIZ_TRACKS.map((track) => {
            const best = bestQuizScores[track.id];
            const isFull = track.id === 'full-review';

            return (
              <div
                key={track.id}
                className={`rounded-xl border p-6 flex flex-col justify-between space-y-5 ${
                  isFull
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-900 border-slate-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={isFull ? 'text-slate-300' : 'text-slate-500'}>
                      {track.questionCount} Questions
                    </span>
                    <span
                      className={`tabular-nums ${
                        isFull ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {best !== undefined ? `Best: ${best}%` : 'Not attempted'}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold">{track.title}</h2>
                  <p
                    className={`text-sm leading-relaxed ${
                      isFull ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {track.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => startTrack(track.id)}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    isFull
                      ? 'bg-white text-slate-900 hover:bg-slate-100'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <span>
                    {best !== undefined ? 'Retake Quiz' : 'Start Quiz'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const activeTrackMeta = QUIZ_TRACKS.find((t) => t.id === activeTrackId)!;

  // Results Screen
  if (showResults) {
    const correctTotal = questions.reduce(
      (sum, q) => (answers[q.id] === q.correctIndex ? sum + 1 : sum),
      0,
    );
    const pct = Math.round((correctTotal / questions.length) * 100);
    const missedCount = questions.length - correctTotal;
    const reviewItems =
      reviewFilter === 'missed'
        ? questions.filter((q) => answers[q.id] !== q.correctIndex)
        : questions;

    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <button
          type="button"
          onClick={() => setActiveTrackId(null)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>All Practice Quizzes</span>
        </button>

        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <p className="text-xs font-mono text-slate-500">
                Quiz Completed · {activeTrackMeta.title}
              </p>
              <h1 className="text-3xl font-semibold text-slate-900 mt-1">
                You scored{' '}
                <span className="font-mono tabular-nums">{correctTotal}</span> /{' '}
                <span className="font-mono tabular-nums">
                  {questions.length}
                </span>{' '}
                (<span className="font-mono tabular-nums">{pct}%</span>)
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {pct >= 80
                  ? 'Strong mastery! You are ready for Theme 6 source and multiple-choice questions.'
                  : pct >= 60
                    ? 'Solid start. Review the missed explanations below and revisit the flashcards.'
                    : 'Good practice run. Read the missed explanations below and review the Key Concepts chapters.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => startTrack(activeTrackId)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Retake Quiz</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Question Review
            </h2>
            <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setReviewFilter('all')}
                className={`px-3 py-1 text-xs font-medium rounded-md cursor-pointer whitespace-nowrap ${
                  reviewFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                All ({questions.length})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('missed')}
                className={`px-3 py-1 text-xs font-medium rounded-md cursor-pointer whitespace-nowrap ${
                  reviewFilter === 'missed'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Missed ({missedCount})
              </button>
            </div>
          </div>

          {reviewItems.length === 0 ? (
            <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              Zero missed questions! Every answer on this quiz was correct.
            </p>
          ) : (
            <div className="space-y-4">
              {reviewItems.map((q) => {
                const userChoice = answers[q.id];
                const isRight = userChoice === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className="border border-slate-200 rounded-xl p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900 leading-snug">
                        {q.question}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold shrink-0 ${
                          isRight ? 'text-emerald-800' : 'text-red-800'
                        }`}
                      >
                        {isRight ? (
                          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <AlertCircle className="w-4 h-4" aria-hidden="true" />
                        )}
                        <span>{isRight ? 'Correct' : 'Missed'}</span>
                      </span>
                    </div>

                    {!isRight && userChoice !== undefined && (
                      <p className="text-xs text-red-800">
                        Your answer: {q.options[userChoice]}
                      </p>
                    )}
                    <p className="text-xs text-emerald-800 font-medium">
                      Correct answer: {q.options[q.correctIndex]}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2.5">
                      {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Active Question View
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setActiveTrackId(null)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Exit Quiz</span>
        </button>

        <span className="text-xs font-mono tabular-nums text-slate-600">
          Question {currentIdx + 1} of {questions.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-slate-900 transition-all duration-200"
          style={{
            width: `${Math.round(((currentIdx + 1) / questions.length) * 100)}%`,
          }}
        />
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <p className="text-xs font-mono text-slate-500">
            {activeTrackMeta.title}
          </p>

          {currentQuestion.sourceQuote && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1.5">
              <p className="text-sm italic text-slate-900 leading-relaxed">
                {currentQuestion.sourceQuote}
              </p>
              {currentQuestion.sourceAttribution && (
                <p className="text-xs text-slate-500">
                  — {currentQuestion.sourceAttribution}
                </p>
              )}
            </div>
          )}

          <h2 className="text-xl font-semibold text-slate-900 leading-snug">
            {currentQuestion.question}
          </h2>

          <div className="space-y-2.5">
            {currentQuestion.options.map((opt, idx) => {
              const isPicked = selectedAnswer === idx;
              const isCorrectOption = idx === currentQuestion.correctIndex;

              let optClass =
                'bg-white border-slate-200 text-slate-800 hover:bg-slate-50';
              if (hasAnsweredCurrent) {
                if (isCorrectOption) {
                  optClass =
                    'bg-emerald-50 border-emerald-300 text-emerald-950';
                } else if (isPicked && !isCorrectOption) {
                  optClass = 'bg-red-50 border-red-300 text-red-950';
                } else {
                  optClass = 'bg-slate-50 border-slate-200 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnsweredCurrent}
                  className={`w-full text-left p-4 rounded-lg border text-sm transition-colors flex items-start justify-between gap-3 ${
                    hasAnsweredCurrent ? 'cursor-default' : 'cursor-pointer'
                  } ${optClass}`}
                >
                  <span className="leading-relaxed">
                    <span className="font-mono font-semibold mr-2">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                  </span>
                  {hasAnsweredCurrent && isCorrectOption && (
                    <CheckCircle2
                      className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                  )}
                  {hasAnsweredCurrent && isPicked && !isCorrectOption && (
                    <AlertCircle
                      className="w-4 h-4 text-red-700 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {hasAnsweredCurrent && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div
                className={`p-4 rounded-lg border text-sm leading-relaxed ${
                  selectedAnswer === currentQuestion.correctIndex
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <span className="font-semibold">
                  {selectedAnswer === currentQuestion.correctIndex
                    ? 'Correct: '
                    : 'Explanation: '}
                </span>
                {currentQuestion.explanation}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextOrFinish}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>
                    {currentIdx + 1 === questions.length
                      ? 'See Quiz Results'
                      : 'Next Question'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
