import { useEffect, useState } from 'react';
import { ConceptsSection } from './components/ConceptsSection';
import { OverviewSection } from './components/OverviewSection';
import { QuizSection } from './components/QuizSection';
import { SpectrumLabSection } from './components/SpectrumLabSection';
import { VocabularySection } from './components/VocabularySection';
import { STUDY_CHAPTERS, StudySection } from './data/theme6Data';

interface SavedStudyProgress {
  reviewedTopics: string[];
  masteredVocab: string[];
  bestQuizScores: Record<string, number>;
}

const STORAGE_KEY = 'ss30_2_theme6_study_progress_v1';

const DEFAULT_PROGRESS: SavedStudyProgress = {
  reviewedTopics: [],
  masteredVocab: [],
  bestQuizScores: {},
};

const NAV_ITEMS: { id: StudySection; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'concepts', label: 'Key Concepts' },
  { id: 'vocabulary', label: 'Vocabulary' },
  { id: 'spectrum', label: 'Visual Lab' },
  { id: 'quizzes', label: 'Quizzes' },
];

export default function App() {
  const [activeSection, setActiveSection] = useState<StudySection>('overview');
  const [activeChapterId, setActiveChapterId] = useState<string>(
    STUDY_CHAPTERS[0].id,
  );

  const [progress, setProgress] = useState<SavedStudyProgress>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SavedStudyProgress>;
        return {
          reviewedTopics: Array.isArray(parsed.reviewedTopics)
            ? parsed.reviewedTopics
            : [],
          masteredVocab: Array.isArray(parsed.masteredVocab)
            ? parsed.masteredVocab
            : [],
          bestQuizScores:
            parsed.bestQuizScores && typeof parsed.bestQuizScores === 'object'
              ? parsed.bestQuizScores
              : {},
        };
      }
    } catch {
      // Ignore corrupted local storage
    }
    return DEFAULT_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors
    }
  }, [progress]);

  const handleNavigate = (section: StudySection, chapterId?: string) => {
    setActiveSection(section);
    if (chapterId) {
      setActiveChapterId(chapterId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTopicReviewed = (topicId: string) => {
    setProgress((prev) => {
      const exists = prev.reviewedTopics.includes(topicId);
      return {
        ...prev,
        reviewedTopics: exists
          ? prev.reviewedTopics.filter((id) => id !== topicId)
          : [...prev.reviewedTopics, topicId],
      };
    });
  };

  const handleToggleMasteredVocab = (termId: string) => {
    setProgress((prev) => {
      const exists = prev.masteredVocab.includes(termId);
      return {
        ...prev,
        masteredVocab: exists
          ? prev.masteredVocab.filter((id) => id !== termId)
          : [...prev.masteredVocab, termId],
      };
    });
  };

  const handleSaveQuizScore = (trackId: string, percentage: number) => {
    setProgress((prev) => {
      const prevBest = prev.bestQuizScores[trackId] ?? 0;
      return {
        ...prev,
        bestQuizScores: {
          ...prev.bestQuizScores,
          [trackId]: Math.max(prevBest, percentage),
        },
      };
    });
  };

  const handleResetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar: Strict 3-Zone Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavigate('overview')}
            className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Theme 6 Study Guide
          </button>

          {/* Zone 2: 5 concise single-line text nav links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            {NAV_ITEMS.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                    active
                      ? 'text-slate-900 border-slate-900'
                      : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => handleNavigate('quizzes')}
              className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              Practice Quiz
            </button>
          </div>
        </div>

        {/* Mobile Compact Nav Strip (stays well under 15% viewport height) */}
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-4 overflow-x-auto text-xs font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`py-1 whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                  active
                    ? 'text-slate-900 border-slate-900 font-semibold'
                    : 'text-slate-600 border-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Study Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {activeSection === 'overview' && (
          <OverviewSection
            reviewedTopics={progress.reviewedTopics}
            masteredVocab={progress.masteredVocab}
            bestQuizScores={progress.bestQuizScores}
            onNavigate={handleNavigate}
            onResetProgress={handleResetProgress}
          />
        )}

        {activeSection === 'concepts' && (
          <ConceptsSection
            activeChapterId={activeChapterId}
            onSelectChapter={setActiveChapterId}
            reviewedTopics={progress.reviewedTopics}
            onToggleTopicReviewed={handleToggleTopicReviewed}
          />
        )}

        {activeSection === 'vocabulary' && (
          <VocabularySection
            masteredVocab={progress.masteredVocab}
            onToggleMastered={handleToggleMasteredVocab}
          />
        )}

        {activeSection === 'spectrum' && <SpectrumLabSection />}

        {activeSection === 'quizzes' && (
          <QuizSection
            bestQuizScores={progress.bestQuizScores}
            onSaveQuizScore={handleSaveQuizScore}
          />
        )}
      </main>

      {/* Clean Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            Social Studies 30-2 · Theme 6: Communism &amp; Fascism as a Rejection
            of Liberalism
          </span>
          <span>Outcomes S.O. 2.9 · S.O. 3.3 · S.O. 3.5</span>
        </div>
      </footer>
    </div>
  );
}
