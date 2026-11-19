import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Layers,
  ListChecks,
  RotateCcw,
} from 'lucide-react';
import {
  IDEOLOGY_PROGRESSION,
  SPECIFIC_OUTCOMES,
  STUDY_CHAPTERS,
  StudySection,
  VOCAB_TERMS,
} from '../data/theme6Data';

interface OverviewSectionProps {
  reviewedTopics: string[];
  masteredVocab: string[];
  bestQuizScores: Record<string, number>;
  onNavigate: (section: StudySection, chapterId?: string) => void;
  onResetProgress: () => void;
}

export function OverviewSection({
  reviewedTopics,
  masteredVocab,
  bestQuizScores,
  onNavigate,
  onResetProgress,
}: OverviewSectionProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);

  const totalTopics = STUDY_CHAPTERS.reduce((acc, ch) => acc + ch.topics.length, 0);
  const totalVocab = VOCAB_TERMS.length;
  const quizScoresList = Object.values(bestQuizScores);
  const bestOverall =
    quizScoresList.length > 0 ? Math.max(...quizScoresList) : null;

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border-b border-slate-200 pb-10">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-wide text-slate-500">
              Social Studies 30-2 · Theme 6 Study Companion
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 leading-[1.12] [text-wrap:balance]">
              Communism and Fascism as a Rejection of Liberalism
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              Review why 20th-century nations abandoned democracy and individual
              rights for totalitarian rule. Read clear plain-language notes, drill
              essential vocabulary flashcards, explore the political-economic
              spectrum, and test yourself with 30-2 practice quizzes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('concepts')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>Start Studying Concepts</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('quizzes')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 border border-slate-300 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              <ListChecks className="w-4 h-4" aria-hidden="true" />
              <span>Take Practice Quiz</span>
            </button>
          </div>
        </div>

        {/* Study Progress Snapshot Panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Your Study Progress
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Saved automatically in this browser
              </p>
            </div>
            {(reviewedTopics.length > 0 ||
              masteredVocab.length > 0 ||
              quizScoresList.length > 0) && (
              <div className="shrink-0">
                {!confirmReset ? (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Reset</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onResetProgress();
                        setConfirmReset(false);
                      }}
                      className="text-xs font-medium text-red-700 hover:underline cursor-pointer whitespace-nowrap"
                    >
                      Confirm Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer whitespace-nowrap"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-700">
                  Key Concepts Reviewed
                </span>
                <span className="font-mono tabular-nums text-slate-900 font-medium">
                  {reviewedTopics.length} / {totalTopics}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-700 transition-transform duration-300 origin-left"
                  style={{
                    width: `${Math.round((reviewedTopics.length / totalTopics) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-700">
                  Vocabulary Mastered
                </span>
                <span className="font-mono tabular-nums text-slate-900 font-medium">
                  {masteredVocab.length} / {totalVocab}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-700 transition-transform duration-300 origin-left"
                  style={{
                    width: `${Math.round((masteredVocab.length / totalVocab) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">
                Best Practice Quiz Score
              </span>
              <span className="font-mono tabular-nums font-semibold text-slate-900">
                {bestOverall !== null ? `${bestOverall}%` : 'Not taken yet'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('vocabulary')}
              className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Flashcards ({totalVocab})</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('spectrum')}
              className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Visual Lab</span>
            </button>
          </div>
        </div>
      </section>

      {/* Ideological Progression Interactive Strip */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              How We Got Here: Progression of Ideologies
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Click each stage to trace how classical capitalism led to extreme
              reactions on both the left and right.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {IDEOLOGY_PROGRESSION.map((step, index) => {
            const isSelected = activeStep === index;
            return (
              <button
                key={step.stepNumber}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>
                    Step {step.stepNumber}
                  </span>
                  {isSelected && (
                    <span className="text-slate-300 font-sans">Selected</span>
                  )}
                </div>
                <p className="font-semibold text-sm leading-snug">{step.title}</p>
              </button>
            );
          })}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <p className="text-xs font-mono text-slate-500">
                Stage {IDEOLOGY_PROGRESSION[activeStep].stepNumber} ·{' '}
                {IDEOLOGY_PROGRESSION[activeStep].keyFigureOrEvent}
              </p>
              <h3 className="text-lg font-semibold text-slate-900">
                {IDEOLOGY_PROGRESSION[activeStep].title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {IDEOLOGY_PROGRESSION[activeStep].summary}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('concepts')}
              className="self-start md:self-center inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Explore in Chapters</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* Unit Chapters Quick Jump */}
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Theme 6 Study Chapters
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Jump directly into any section of the unit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STUDY_CHAPTERS.map((chapter) => {
            const completedCount = chapter.topics.filter((t) =>
              reviewedTopics.includes(t.id),
            ).length;
            const isComplete = completedCount === chapter.topics.length;

            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => onNavigate('concepts', chapter.id)}
                className="text-left bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-400 transition-colors cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span className="font-mono">{chapter.number}</span>
                    <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
                      {isComplete && (
                        <CheckCircle2
                          className="w-3.5 h-3.5 text-emerald-700"
                          aria-hidden="true"
                        />
                      )}
                      <span>
                        {completedCount}/{chapter.topics.length} reviewed ·{' '}
                        {chapter.estimatedMinutes} min
                      </span>
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {chapter.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {chapter.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium text-blue-700">
                  <span>Open chapter</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Curriculum Specific Outcomes */}
      <section className="space-y-5 border-t border-slate-200 pt-10">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            What You Need to Know (30-2 Outcomes)
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Official curriculum outcomes translated into plain language for test
            prep.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SPECIFIC_OUTCOMES.map((so) => (
            <div
              key={so.code}
              className="bg-white border border-slate-200 rounded-xl p-5 space-y-3"
            >
              <p className="font-mono text-xs font-semibold text-blue-700">
                {so.code}
              </p>
              <p className="text-sm font-semibold text-slate-900 leading-snug">
                {so.officialText}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {so.studentTranslation}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
