import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Search,
  Shuffle,
} from 'lucide-react';
import { VOCAB_TERMS, VocabTerm } from '../data/theme6Data';

interface VocabularySectionProps {
  masteredVocab: string[];
  onToggleMastered: (termId: string) => void;
}

type CategoryFilter =
  | 'All'
  | 'Soviet Communism'
  | 'Fascism & Nazism'
  | 'Dictatorship & Spectrum';

export function VocabularySection({
  masteredVocab,
  onToggleMastered,
}: VocabularySectionProps) {
  const [mode, setMode] = useState<'flashcards' | 'glossary'>('flashcards');
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [onlyNeedsReview, setOnlyNeedsReview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Flashcard state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledOrder, setShuffledOrder] = useState<string[] | null>(null);

  const filteredTerms = useMemo(() => {
    let list = VOCAB_TERMS.filter((item) => {
      if (category !== 'All' && item.category !== category) return false;
      if (onlyNeedsReview && masteredVocab.includes(item.id)) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          item.term.toLowerCase().includes(q) ||
          item.definition.toLowerCase().includes(q) ||
          item.example.toLowerCase().includes(q)
        );
      }
      return true;
    });

    if (shuffledOrder) {
      const orderMap = new Map(shuffledOrder.map((id, i) => [id, i]));
      list = [...list].sort(
        (a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999),
      );
    }

    return list;
  }, [category, onlyNeedsReview, searchQuery, masteredVocab, shuffledOrder]);

  // Keep cardIndex safely inside bounds when filters change
  const safeIndex =
    filteredTerms.length > 0 ? Math.min(cardIndex, filteredTerms.length - 1) : 0;
  const currentCard: VocabTerm | undefined = filteredTerms[safeIndex];

  useEffect(() => {
    setIsFlipped(false);
  }, [safeIndex, category, onlyNeedsReview, mode]);

  // Keyboard shortcuts in flashcard mode
  useEffect(() => {
    if (mode !== 'flashcards' || filteredTerms.length === 0) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setCardIndex((prev) => (prev + 1) % filteredTerms.length);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setCardIndex((prev) =>
          prev - 1 < 0 ? filteredTerms.length - 1 : prev - 1,
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, filteredTerms.length]);

  const handleShuffle = () => {
    const ids = [...VOCAB_TERMS.map((t) => t.id)];
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setShuffledOrder(ids);
    setCardIndex(0);
    setIsFlipped(false);
  };

  const categories: CategoryFilter[] = [
    'All',
    'Soviet Communism',
    'Fascism & Nazism',
    'Dictatorship & Spectrum',
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Vocabulary Trainer · {VOCAB_TERMS.length} Essential Theme 6 Terms
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 mt-1">
            Key Terms & Flashcards
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Mastered{' '}
            <span className="font-mono tabular-nums font-semibold text-slate-900">
              {masteredVocab.length}/{VOCAB_TERMS.length}
            </span>{' '}
            terms. Mark words you know to focus your studying on the rest.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg self-start">
          <button
            type="button"
            onClick={() => setMode('flashcards')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              mode === 'flashcards'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Flashcard Trainer
          </button>
          <button
            type="button"
            onClick={() => setMode('glossary')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              mode === 'glossary'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Full Glossary
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategory(cat);
                setCardIndex(0);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                category === cat
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {mode === 'glossary' && (
            <div className="relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search terms..."
                aria-label="Search vocabulary terms"
                className="pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 w-52"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setOnlyNeedsReview((prev) => !prev);
              setCardIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
              onlyNeedsReview
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {onlyNeedsReview ? 'Showing: Needs Review' : 'Filter: Needs Review'}
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredTerms.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <p className="text-lg font-semibold text-slate-900">
            {onlyNeedsReview
              ? 'All terms in this category are mastered!'
              : 'No matching vocabulary terms found.'}
          </p>
          <p className="text-sm text-slate-600">
            {onlyNeedsReview
              ? 'Great work. Turn off the "Needs Review" filter or switch categories to keep practicing.'
              : 'Try clearing your search box or selecting "All" categories.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setOnlyNeedsReview(false);
              setSearchQuery('');
              setCategory('All');
            }}
            className="px-4 py-2 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Show All Terms
          </button>
        </div>
      ) : mode === 'flashcards' && currentCard ? (
        /* Flashcard Trainer */
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono tabular-nums">
              Card {safeIndex + 1} of {filteredTerms.length} ·{' '}
              {currentCard.category}
            </span>
            <button
              type="button"
              onClick={handleShuffle}
              className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900 cursor-pointer whitespace-nowrap"
            >
              <Shuffle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Shuffle Deck</span>
            </button>
          </div>

          {/* Flip Card Container */}
          <div className="perspective-1000">
            <button
              type="button"
              onClick={() => setIsFlipped((prev) => !prev)}
              aria-label={`Flashcard for ${currentCard.term}. Click or press Space to flip.`}
              className="w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 rounded-2xl block"
            >
              <div
                className={`relative w-full min-h-[300px] transition-transform duration-300 transform-style-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front Face */}
                <div className="absolute inset-0 backface-hidden bg-white border border-slate-200 rounded-2xl p-8 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{currentCard.category}</span>
                    <span>
                      {masteredVocab.includes(currentCard.id)
                        ? 'Status: Mastered'
                        : 'Status: Reviewing'}
                    </span>
                  </div>

                  <div className="text-center py-6 space-y-3">
                    <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                      {currentCard.term}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Click card or press Space to reveal definition
                    </p>
                  </div>

                  <div className="flex justify-center text-xs font-medium text-blue-700 items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Flip for meaning</span>
                  </div>
                </div>

                {/* Back Face */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 text-white border border-slate-900 rounded-2xl p-8 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-200">
                      {currentCard.term}
                    </span>
                    <span>{currentCard.category}</span>
                  </div>

                  <div className="space-y-4 my-auto py-2">
                    <p className="text-base sm:text-lg font-medium leading-relaxed text-white">
                      {currentCard.definition}
                    </p>
                    <div className="border-t border-slate-700 pt-3 space-y-2 text-xs sm:text-sm text-slate-300">
                      <p>
                        <span className="font-semibold text-slate-100">
                          Example:{' '}
                        </span>
                        {currentCard.example}
                      </p>
                      <p>
                        <span className="font-semibold text-amber-300">
                          Memory Tip:{' '}
                        </span>
                        {currentCard.memoryTip}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center text-xs text-slate-400 items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Click to flip back</span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Flashcard Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCardIndex((prev) =>
                    prev - 1 < 0 ? filteredTerms.length - 1 : prev - 1,
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                <span>Previous</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setCardIndex((prev) => (prev + 1) % filteredTerms.length)
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onToggleMastered(currentCard.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                masteredVocab.includes(currentCard.id)
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>
                {masteredVocab.includes(currentCard.id)
                  ? 'Mastered (Click to Unmark)'
                  : 'Mark as Mastered'}
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* Searchable Glossary Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTerms.map((item) => {
            const isMastered = masteredVocab.includes(item.id);
            return (
              <article
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-500">{item.category}</p>
                      <h3 className="text-lg font-semibold text-slate-900 mt-0.5">
                        {item.term}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleMastered(item.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isMastered
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{isMastered ? 'Know It' : 'Mark Known'}</span>
                    </button>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed">
                    {item.definition}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-1 text-xs text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-800">
                      Example:{' '}
                    </span>
                    {item.example}
                  </p>
                  <p>
                    <span className="font-semibold text-blue-800">
                      Memory Tip:{' '}
                    </span>
                    {item.memoryTip}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
