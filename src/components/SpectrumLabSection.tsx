import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  GripVertical,
  Image as ImageIcon,
  Lightbulb,
  RotateCcw,
  Shuffle,
} from 'lucide-react';
import {
  PRIMARY_SOURCES,
  PrimarySourceCategory,
  SORTER_ITEMS,
  SPECTRUM_CHALLENGES,
  SPECTRUM_QUADRANTS,
  SpectrumQuadrant,
  TECHNIQUE_SCENARIOS,
  TIMELINE_EVENTS,
  TimelineEvent,
} from '../data/theme6Data';
import {
  ActiveNarrationState,
  AudioReadAloud,
  HighlightedText,
} from './AudioReadAloud';
import { SourceVisualExhibit } from './SourceVisualExhibit';

type LabTab = 'spectrum' | 'sorter' | 'timeline' | 'sources';
type SorterBucket = 'communism' | 'both' | 'fascism';

function getInitialScrambledTimeline(): TimelineEvent[] {
  // Deterministic non-chronological starting order so students immediately see a puzzle to solve
  const order = [3, 0, 6, 1, 7, 2, 5, 4];
  return order.map((idx) => TIMELINE_EVENTS[idx]);
}

function createShuffledSourceOptionOrders(): Record<string, number[]> {
  const orders: Record<string, number[]> = {};
  for (const src of PRIMARY_SOURCES) {
    const indices = src.options.map((_, idx) => idx);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    orders[src.id] = indices;
  }
  return orders;
}

export function SpectrumLabSection() {
  const [activeTab, setActiveTab] = useState<LabTab>('spectrum');

  // --- Tab 1: Spectrum Grid + Technique Spotter ---
  const [selectedQuadrantId, setSelectedQuadrantId] =
    useState<SpectrumQuadrant['id']>('communism');
  const [labMode, setLabMode] = useState<'explore' | 'challenge'>('explore');
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [pickedQuadrant, setPickedQuadrant] = useState<
    SpectrumQuadrant['id'] | null
  >(null);

  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [pickedTechnique, setPickedTechnique] = useState<string | null>(null);
  const [techniqueScore, setTechniqueScore] = useState(0);
  const [answeredScenarios, setAnsweredScenarios] = useState<
    Record<string, boolean>
  >({});

  // --- Tab 2: Communism vs Fascism Sorter (Drag + Click) ---
  const [assignments, setAssignments] = useState<Record<string, SorterBucket>>(
    {},
  );
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [sorterChecked, setSorterChecked] = useState(false);

  // --- Tab 3: Timeline Sequencer ---
  const [timelineOrder, setTimelineOrder] = useState<TimelineEvent[]>(
    getInitialScrambledTimeline,
  );
  const [timelineChecked, setTimelineChecked] = useState(false);
  const [draggedTimelineId, setDraggedTimelineId] = useState<string | null>(
    null,
  );

  // --- Tab 4: Primary Source Analysis ---
  const [sourceCategory, setSourceCategory] = useState<
    'All' | PrimarySourceCategory
  >('All');
  const [sourceIdx, setSourceIdx] = useState(0);
  const [sourceOptionOrders, setSourceOptionOrders] = useState<
    Record<string, number[]>
  >(createShuffledSourceOptionOrders);
  const [sourceAnswers, setSourceAnswers] = useState<Record<string, number>>(
    {},
  );
  const [showSourceClues, setShowSourceClues] = useState<
    Record<string, boolean>
  >({});
  const [writtenDrafts, setWrittenDrafts] = useState<Record<string, string>>(
    {},
  );
  const [showWrittenSample, setShowWrittenSample] = useState<
    Record<string, boolean>
  >({});
  const [imgError, setImgError] = useState<Record<string, boolean>>({});
  const [sourceNarration, setSourceNarration] =
    useState<ActiveNarrationState | null>(null);

  useEffect(() => {
    setSourceNarration(null);
  }, [sourceIdx, sourceCategory, activeTab]);

  const activeQuadrant =
    SPECTRUM_QUADRANTS.find((q) => q.id === selectedQuadrantId) ??
    SPECTRUM_QUADRANTS[2];
  const currentChallenge = SPECTRUM_CHALLENGES[challengeIdx];
  const currentScenario = TECHNIQUE_SCENARIOS[scenarioIdx];

  const filteredSources = useMemo(() => {
    if (sourceCategory === 'All') return PRIMARY_SOURCES;
    return PRIMARY_SOURCES.filter((s) => s.category === sourceCategory);
  }, [sourceCategory]);

  const safeSourceIdx = Math.min(sourceIdx, Math.max(0, filteredSources.length - 1));
  const currentSource = filteredSources[safeSourceIdx] ?? PRIMARY_SOURCES[0];

  const analyzedSourceCount = PRIMARY_SOURCES.filter(
    (s) => sourceAnswers[s.id] !== undefined,
  ).length;
  const correctSourceCount = PRIMARY_SOURCES.filter(
    (s) => sourceAnswers[s.id] === s.correctIndex,
  ).length;

  const sourceSegments = useMemo(() => {
    const segs = [
      {
        id: `${currentSource.id}:title`,
        label: 'Title',
        text: currentSource.title,
      },
    ];
    if (currentSource.excerpt) {
      segs.push({
        id: `${currentSource.id}:excerpt`,
        label: 'Source Excerpt',
        text: currentSource.excerpt,
      });
    }
    segs.push({
      id: `${currentSource.id}:context`,
      label: 'Context',
      text: currentSource.contextNote,
    });
    return segs;
  }, [currentSource]);

  const gridOrder: SpectrumQuadrant['id'][] = [
    'dem-socialism',
    'dem-capitalism',
    'communism',
    'fascism',
  ];

  // Handlers for Spectrum
  const handleGridClick = (id: SpectrumQuadrant['id']) => {
    if (labMode === 'explore') {
      setSelectedQuadrantId(id);
    } else {
      setPickedQuadrant(id);
      setSelectedQuadrantId(id);
    }
  };

  const handleTechniquePick = (option: string) => {
    if (pickedTechnique !== null) return;
    setPickedTechnique(option);
    if (!answeredScenarios[currentScenario.id]) {
      const isRight = option === currentScenario.correctTechnique;
      setAnsweredScenarios((prev) => ({
        ...prev,
        [currentScenario.id]: isRight,
      }));
      if (isRight) setTechniqueScore((prev) => prev + 1);
    }
  };

  // Handlers for Sorter
  const unassignedSorterItems = SORTER_ITEMS.filter(
    (item) => !assignments[item.id],
  );

  const assignToBucket = (itemId: string, bucket: SorterBucket) => {
    setAssignments((prev) => ({ ...prev, [itemId]: bucket }));
    setSelectedCardId(null);
    setSorterChecked(false);
  };

  const removeFromBucket = (itemId: string) => {
    setAssignments((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setSorterChecked(false);
  };

  const sorterCorrectCount = SORTER_ITEMS.filter(
    (item) => assignments[item.id] === item.correctBucket,
  ).length;

  // Handlers for Timeline
  const moveTimelineItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= timelineOrder.length) return;
    setTimelineOrder((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setTimelineChecked(false);
  };

  const handleTimelineDrop = (targetId: string) => {
    if (!draggedTimelineId || draggedTimelineId === targetId) return;
    setTimelineOrder((prev) => {
      const fromIdx = prev.findIndex((e) => e.id === draggedTimelineId);
      const toIdx = prev.findIndex((e) => e.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
    setDraggedTimelineId(null);
    setTimelineChecked(false);
  };

  const shuffleTimeline = () => {
    setTimelineOrder((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
    setTimelineChecked(false);
  };

  const timelineCorrectCount = timelineOrder.filter(
    (ev, idx) => ev.orderIndex === idx,
  ).length;

  const tabs: { id: LabTab; label: string }[] = [
    { id: 'spectrum', label: '01. Spectrum & Techniques' },
    { id: 'sorter', label: '02. Communism vs. Fascism Sorter' },
    { id: 'timeline', label: '03. Timeline Ordering' },
    { id: 'sources', label: '04. Primary Source Analysis' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <p className="text-xs font-medium text-slate-500">
          Visual &amp; Interactive Lab · S.O. 2.9, 3.3 &amp; 3.5
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 mt-1 [text-wrap:balance]">
          Interactive Activities &amp; Visual Analysis
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl">
          Practice placing ideologies on the spectrum, sorting traits of
          Communism and Fascism, ordering key historical dates, and analyzing
          visual primary sources.
        </p>
      </div>

      {/* Sub-navigation Tabs */}
      <div
        role="tablist"
        aria-label="Visual learning activities"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-left text-xs sm:text-sm font-semibold rounded-xl border transition-colors cursor-pointer whitespace-nowrap truncate ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: SPECTRUM GRID + TECHNIQUE MATCHER */}
      {activeTab === 'spectrum' && (
        <div className="space-y-10">
          <section className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  The Political-Economic Grid
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  {labMode === 'explore'
                    ? 'Click any quadrant on the grid to examine its real-world example and freedoms.'
                    : 'Read the policy card on the right, then click the matching quadrant on the grid.'}
                </p>
              </div>

              <div className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg self-start">
                <button
                  type="button"
                  onClick={() => {
                    setLabMode('explore');
                    setPickedQuadrant(null);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    labMode === 'explore'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Explore Quadrants
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLabMode('challenge');
                    setPickedQuadrant(null);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    labMode === 'challenge'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Place the Policy
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between space-y-4">
                <div className="text-center">
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md inline-block">
                    ▲ Maximum Political Freedom (Democracy)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-center justify-center w-24 shrink-0 text-center">
                    <span className="text-xs font-semibold text-blue-800 leading-tight">
                      ◄ Economic Collectivism
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      (Gov’t Control)
                    </span>
                  </div>

                  <div className="relative flex-1 grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    {gridOrder.map((qId) => {
                      const q = SPECTRUM_QUADRANTS.find(
                        (item) => item.id === qId,
                      )!;
                      const isSelected =
                        labMode === 'explore'
                          ? selectedQuadrantId === q.id
                          : pickedQuadrant === q.id;
                      const isChallengeCorrect =
                        labMode === 'challenge' &&
                        pickedQuadrant !== null &&
                        currentChallenge.correctQuadrantId === q.id;
                      const isChallengeWrong =
                        labMode === 'challenge' &&
                        pickedQuadrant === q.id &&
                        currentChallenge.correctQuadrantId !== q.id;

                      let cardClasses =
                        'bg-white border-slate-200 text-slate-900 hover:border-slate-400';
                      if (labMode === 'explore' && isSelected) {
                        cardClasses =
                          q.id === 'communism'
                            ? 'bg-blue-50 border-blue-600 text-slate-900 ring-1 ring-blue-600'
                            : q.id === 'fascism'
                              ? 'bg-red-50 border-red-600 text-slate-900 ring-1 ring-red-600'
                              : 'bg-slate-900 border-slate-900 text-white';
                      } else if (isChallengeCorrect) {
                        cardClasses =
                          'bg-emerald-50 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600';
                      } else if (isChallengeWrong) {
                        cardClasses =
                          'bg-red-50 border-red-600 text-red-950 ring-1 ring-red-600';
                      }

                      const mutedText =
                        labMode === 'explore' &&
                        isSelected &&
                        q.id !== 'communism' &&
                        q.id !== 'fascism'
                          ? 'text-slate-300'
                          : 'text-slate-500';

                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => handleGridClick(q.id)}
                          className={`p-4 rounded-lg border text-left transition-colors cursor-pointer min-h-[120px] flex flex-col justify-between ${cardClasses}`}
                        >
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className={mutedText}>
                              Q{q.quadrantNumber}
                            </span>
                            {isChallengeCorrect && (
                              <CheckCircle2
                                className="w-4 h-4 text-emerald-700"
                                aria-hidden="true"
                              />
                            )}
                            {isChallengeWrong && (
                              <AlertCircle
                                className="w-4 h-4 text-red-700"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                          <div className="space-y-1 mt-2">
                            <p className="font-semibold text-sm leading-snug">
                              {q.title}
                            </p>
                            <p className={`text-xs ${mutedText}`}>
                              {q.countryExamples}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="hidden sm:flex flex-col items-center justify-center w-24 shrink-0 text-center">
                    <span className="text-xs font-semibold text-red-800 leading-tight">
                      Economic Individualism ►
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      (Private Enterprise)
                    </span>
                  </div>
                </div>

                <div className="flex sm:hidden items-center justify-between text-xs font-medium px-1">
                  <span className="text-blue-800">◄ Economic Collectivism</span>
                  <span className="text-red-800">
                    Economic Individualism ►
                  </span>
                </div>

                <div className="text-center">
                  <span className="text-xs font-semibold text-red-800 bg-red-50 border border-red-200 px-3 py-1 rounded-md inline-block">
                    ▼ Maximum Political Control (Dictatorship)
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-blue-800">
                      ◄ Radical (Far Left · USSR)
                    </span>
                    <span className="text-red-800">
                      Reactionary (Far Right · Nazi Germany) ►
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gradient-to-r from-blue-600 via-slate-300 to-red-600" />
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                    <span>Rejects past traditions for future equality</span>
                    <span>Idealizes the past &amp; natural hierarchy</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5">
                {labMode === 'explore' ? (
                  <>
                    <div className="space-y-4">
                      <div className="border-b border-slate-100 pb-4">
                        <p className="text-xs font-mono text-slate-500">
                          Quadrant {activeQuadrant.quadrantNumber} ·{' '}
                          {activeQuadrant.countryExamples}
                        </p>
                        <h3 className="text-2xl font-semibold text-slate-900 mt-1">
                          {activeQuadrant.title}
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                          <p className="text-slate-500 mb-0.5">Politics</p>
                          <p className="font-semibold text-slate-900">
                            {activeQuadrant.politicalAxis}
                          </p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                          <p className="text-slate-500 mb-0.5">Economy</p>
                          <p className="font-semibold text-slate-900">
                            {activeQuadrant.economicAxis}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          How It Works
                        </p>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {activeQuadrant.description}
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1">
                        <p className="text-xs font-semibold text-slate-900">
                          Relationship to Liberalism (S.O. 3.5)
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {activeQuadrant.liberalismStance}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setLabMode('challenge');
                        setPickedQuadrant(null);
                      }}
                      className="w-full py-2.5 px-4 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Try &ldquo;Place the Policy&rdquo; Challenge
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
                        <span className="font-mono font-semibold text-blue-700">
                          Policy Challenge {challengeIdx + 1} of{' '}
                          {SPECTRUM_CHALLENGES.length}
                        </span>
                        <span className="text-slate-500">
                          Click a quadrant on the grid
                        </span>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                        <p className="text-base font-medium text-slate-900 leading-relaxed">
                          {currentChallenge.statement}
                        </p>
                      </div>

                      {pickedQuadrant === null ? (
                        <p className="text-sm text-slate-600">
                          Where does this statement belong on the
                          Political-Economic Grid? Select Quadrant 1, 2, 3, or 4
                          on the left.
                        </p>
                      ) : (
                        <div
                          className={`p-4 rounded-lg border text-sm leading-relaxed space-y-1.5 ${
                            pickedQuadrant ===
                            currentChallenge.correctQuadrantId
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                              : 'bg-red-50 border-red-200 text-red-950'
                          }`}
                        >
                          <p className="font-semibold flex items-center gap-1.5">
                            {pickedQuadrant ===
                            currentChallenge.correctQuadrantId ? (
                              <>
                                <CheckCircle2
                                  className="w-4 h-4 text-emerald-700"
                                  aria-hidden="true"
                                />
                                <span>Correct placement!</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle
                                  className="w-4 h-4 text-red-700"
                                  aria-hidden="true"
                                />
                                <span>Not quite — check the axes.</span>
                              </>
                            )}
                          </p>
                          <p>{currentChallenge.explanation}</p>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPickedQuadrant(null);
                        setChallengeIdx(
                          (prev) => (prev + 1) % SPECTRUM_CHALLENGES.length,
                        );
                      }}
                      className="w-full py-2.5 px-4 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Next Policy Statement
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>

          <section className="border-t border-slate-200 pt-10 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Spot the Dictatorship Technique
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Match each historical example from Theme 6 to the dictatorship
                  technique being used.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-600 tabular-nums">
                  Score:{' '}
                  <strong className="text-slate-900">{techniqueScore}</strong> /{' '}
                  {TECHNIQUE_SCENARIOS.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setScenarioIdx(0);
                    setPickedTechnique(null);
                    setTechniqueScore(0);
                    setAnsweredScenarios({});
                  }}
                  className="inline-flex items-center gap-1.5 font-sans font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Restart</span>
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span className="tabular-nums">
                  Scenario {scenarioIdx + 1} of {TECHNIQUE_SCENARIOS.length}
                </span>
                <span>Context: {currentScenario.regime}</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="text-base font-medium text-slate-900 leading-relaxed">
                  {currentScenario.scenario}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentScenario.options.map((option) => {
                  const isPicked = pickedTechnique === option;
                  const isRight = option === currentScenario.correctTechnique;
                  const revealed = pickedTechnique !== null;

                  let btnClass =
                    'bg-white border-slate-200 text-slate-800 hover:bg-slate-50';
                  if (revealed) {
                    if (isRight) {
                      btnClass =
                        'bg-emerald-50 border-emerald-300 text-emerald-950';
                    } else if (isPicked && !isRight) {
                      btnClass = 'bg-red-50 border-red-300 text-red-950';
                    } else {
                      btnClass = 'bg-slate-50 border-slate-200 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleTechniquePick(option)}
                      className={`p-4 rounded-lg border text-left text-sm font-medium transition-colors cursor-pointer flex items-center justify-between gap-2 ${btnClass}`}
                    >
                      <span>{option}</span>
                      {revealed && isRight && (
                        <CheckCircle2
                          className="w-4 h-4 text-emerald-700 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      {revealed && isPicked && !isRight && (
                        <AlertCircle
                          className="w-4 h-4 text-red-700 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {pickedTechnique !== null && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <span className="font-semibold text-slate-900">Why: </span>
                    {currentScenario.explanation}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setPickedTechnique(null);
                      setScenarioIdx(
                        (prev) => (prev + 1) % TECHNIQUE_SCENARIOS.length,
                      );
                    }}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-center"
                  >
                    {scenarioIdx + 1 === TECHNIQUE_SCENARIOS.length
                      ? 'Loop to Scenario 1'
                      : 'Next Scenario'}
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: COMMUNISM VS FASCISM SORTER (DRAG OR CLICK) */}
      {activeTab === 'sorter' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Communism vs. Fascism Sorter
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Drag each card into a column—or click a card and click the
                matching column button below.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {sorterChecked && (
                <span className="text-xs font-mono tabular-nums font-semibold text-slate-900">
                  Score: {sorterCorrectCount} / {SORTER_ITEMS.length}
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setAssignments({});
                  setSelectedCardId(null);
                  setSorterChecked(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset Sorter</span>
              </button>
            </div>
          </div>

          {/* Unassigned Card Tray */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                Cards to Sort ({unassignedSorterItems.length} remaining)
              </span>
              {selectedCardId && (
                <span className="text-blue-700 font-medium">
                  Card selected — now click a column below to place it
                </span>
              )}
            </div>

            {unassignedSorterItems.length === 0 ? (
              <div className="py-4 text-center space-y-3">
                <p className="text-sm font-medium text-slate-700">
                  All {SORTER_ITEMS.length} cards have been placed!
                </p>
                {!sorterChecked && (
                  <button
                    type="button"
                    onClick={() => setSorterChecked(true)}
                    className="px-5 py-2.5 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Check My Sorting
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {unassignedSorterItems.map((item) => {
                  const isSelected = selectedCardId === item.id;
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => setDraggedCardId(item.id)}
                      onDragEnd={() => setDraggedCardId(null)}
                      onClick={() =>
                        setSelectedCardId((prev) =>
                          prev === item.id ? null : item.id,
                        )
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedCardId((prev) =>
                            prev === item.id ? null : item.id,
                          );
                        }
                      }}
                      className={`p-3.5 rounded-lg border text-sm transition-colors cursor-grab active:cursor-grabbing flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-blue-50 border-blue-600 text-slate-900 ring-1 ring-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <GripVertical
                        className="w-4 h-4 text-slate-400 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="leading-snug">{item.statement}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3 Drop Buckets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            {(
              [
                {
                  id: 'communism' as SorterBucket,
                  title: 'Communism Only',
                  subtitle: 'Far Left · USSR',
                  headerClass: 'bg-blue-50 text-blue-900 border-blue-200',
                },
                {
                  id: 'both' as SorterBucket,
                  title: 'Both Regimes',
                  subtitle: 'Shared Totalitarian Traits',
                  headerClass: 'bg-slate-100 text-slate-900 border-slate-200',
                },
                {
                  id: 'fascism' as SorterBucket,
                  title: 'Fascism Only',
                  subtitle: 'Far Right · Nazi Germany',
                  headerClass: 'bg-red-50 text-red-900 border-red-200',
                },
              ] as const
            ).map((bucket) => {
              const bucketItems = SORTER_ITEMS.filter(
                (i) => assignments[i.id] === bucket.id,
              );

              return (
                <div
                  key={bucket.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedCardId) {
                      assignToBucket(draggedCardId, bucket.id);
                      setDraggedCardId(null);
                    }
                  }}
                  className="bg-white border border-slate-200 rounded-xl flex flex-col justify-between min-h-[260px]"
                >
                  <div
                    className={`p-4 border-b rounded-t-xl flex items-center justify-between gap-2 ${bucket.headerClass}`}
                  >
                    <div>
                      <h3 className="text-sm font-semibold">{bucket.title}</h3>
                      <p className="text-xs opacity-80">{bucket.subtitle}</p>
                    </div>
                    {selectedCardId && (
                      <button
                        type="button"
                        onClick={() =>
                          assignToBucket(selectedCardId, bucket.id)
                        }
                        className="px-2.5 py-1 text-xs font-semibold bg-slate-900 text-white rounded-md hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Place Here
                      </button>
                    )}
                  </div>

                  <div className="p-4 flex-1 space-y-2.5">
                    {bucketItems.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-8">
                        Drop cards here or select a card and click &ldquo;Place
                        Here&rdquo;
                      </p>
                    ) : (
                      bucketItems.map((item) => {
                        const isCorrect = item.correctBucket === bucket.id;
                        let itemClass =
                          'bg-slate-50 border-slate-200 text-slate-800';
                        if (sorterChecked) {
                          itemClass = isCorrect
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                            : 'bg-red-50 border-red-300 text-red-950';
                        }

                        return (
                          <div
                            key={item.id}
                            className={`p-3 rounded-lg border text-xs space-y-2 ${itemClass}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-medium leading-relaxed">
                                {item.statement}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFromBucket(item.id)}
                                className="text-[11px] underline opacity-70 hover:opacity-100 shrink-0 cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                            {sorterChecked && (
                              <div className="pt-1.5 border-t border-black/10 space-y-1">
                                <p className="font-semibold flex items-center gap-1">
                                  {isCorrect ? (
                                    <>
                                      <CheckCircle2
                                        className="w-3.5 h-3.5 text-emerald-700"
                                        aria-hidden="true"
                                      />
                                      <span>Correct</span>
                                    </>
                                  ) : (
                                    <>
                                      <AlertCircle
                                        className="w-3.5 h-3.5 text-red-700"
                                        aria-hidden="true"
                                      />
                                      <span>
                                        Belongs in:{' '}
                                        {item.correctBucket === 'communism'
                                          ? 'Communism Only'
                                          : item.correctBucket === 'fascism'
                                            ? 'Fascism Only'
                                            : 'Both Regimes'}
                                      </span>
                                    </>
                                  )}
                                </p>
                                <p className="opacity-90 leading-relaxed">
                                  {item.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {unassignedSorterItems.length > 0 &&
            Object.keys(assignments).length > 0 &&
            !sorterChecked && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setSorterChecked(true)}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Check Placed Cards ({Object.keys(assignments).length}/
                  {SORTER_ITEMS.length})
                </button>
              </div>
            )}
        </section>
      )}

      {/* TAB 3: TIMELINE ORDERING ACTIVITY */}
      {activeTab === 'timeline' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Theme 6 Timeline Ordering
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Arrange these 8 key events from earliest (top) to latest
                (bottom) using drag-and-drop or the Up / Down buttons.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {timelineChecked && (
                <span className="text-xs font-mono tabular-nums font-semibold text-slate-900">
                  {timelineCorrectCount} / {TIMELINE_EVENTS.length} in exact
                  order
                </span>
              )}
              <button
                type="button"
                onClick={shuffleTimeline}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer whitespace-nowrap"
              >
                <Shuffle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Scramble</span>
              </button>
              <button
                type="button"
                onClick={() => setTimelineChecked(true)}
                className="px-4 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                Check Order &amp; Reveal Dates
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {timelineOrder.map((event, idx) => {
              const isExactSpot = event.orderIndex === idx;
              let cardStyle = 'bg-white border-slate-200';
              if (timelineChecked) {
                cardStyle = isExactSpot
                  ? 'bg-emerald-50 border-emerald-300'
                  : 'bg-red-50 border-red-300';
              }

              return (
                <div
                  key={event.id}
                  draggable
                  onDragStart={() => setDraggedTimelineId(event.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleTimelineDrop(event.id)}
                  className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors cursor-grab active:cursor-grabbing ${cardStyle}`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <GripVertical
                      className="w-4 h-4 text-slate-400 shrink-0 mt-1"
                      aria-hidden="true"
                    />
                    <span className="font-mono tabular-nums text-xs font-semibold text-slate-500 mt-0.5 shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{event.regime}</span>
                        {timelineChecked && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono font-semibold text-slate-900">
                              {event.year}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span
                              className={`font-semibold ${
                                isExactSpot
                                  ? 'text-emerald-800'
                                  : 'text-red-800'
                              }`}
                            >
                              {isExactSpot
                                ? 'Correct position'
                                : `Belongs at #${event.orderIndex + 1}`}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {event.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => moveTimelineItem(idx, -1)}
                      disabled={idx === 0}
                      aria-label={`Move ${event.title} earlier`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-md hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Earlier</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveTimelineItem(idx, 1)}
                      disabled={idx === timelineOrder.length - 1}
                      aria-label={`Move ${event.title} later`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-md hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Later</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 4: PRIMARY SOURCE & PROPAGANDA ANALYSIS */}
      {activeTab === 'sources' && (
        <section className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Primary Source &amp; Propaganda Analysis
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Practice 30-2 source interpretation using visuals, Nazi textbook
                problems, treaties, satire, and Soviet policy case studies.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-slate-700 whitespace-nowrap shrink-0">
                Analyzed:{' '}
                <span className="font-semibold text-slate-900">
                  {analyzedSourceCount}/{PRIMARY_SOURCES.length}
                </span>
                {' · '}
                Correct:{' '}
                <span className="font-semibold text-emerald-800">
                  {correctSourceCount}
                </span>
              </div>
              {analyzedSourceCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSourceAnswers({});
                    setSourceOptionOrders(createShuffledSourceOptionOrders());
                    setShowSourceClues({});
                    setShowWrittenSample({});
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reset Checks</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter + Numbered Source Switcher */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                className="flex flex-wrap items-center gap-1.5"
                role="group"
                aria-label="Filter primary sources by topic"
              >
                {(
                  [
                    'All',
                    'Soviet Communism',
                    'Fascism & Nazism',
                    'Dictatorship Techniques',
                  ] as const
                ).map((cat) => {
                  const count =
                    cat === 'All'
                      ? PRIMARY_SOURCES.length
                      : PRIMARY_SOURCES.filter((s) => s.category === cat).length;
                  const active = sourceCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSourceCategory(cat);
                        setSourceIdx(0);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-slate-500 font-mono">
                Showing {safeSourceIdx + 1} of {filteredSources.length} in view
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
              {filteredSources.map((src, idx) => {
                const isSelected = safeSourceIdx === idx;
                const ans = sourceAnswers[src.id];
                const isAnswered = ans !== undefined;
                const isRight = ans === src.correctIndex;

                let btnCls =
                  'bg-white text-slate-700 border-slate-200 hover:bg-slate-50';
                if (isSelected) {
                  btnCls = 'bg-slate-900 text-white border-slate-900';
                } else if (isAnswered && isRight) {
                  btnCls = 'bg-emerald-50 text-emerald-900 border-emerald-300';
                } else if (isAnswered && !isRight) {
                  btnCls = 'bg-red-50 text-red-900 border-red-300';
                }

                return (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => setSourceIdx(idx)}
                    title={src.title}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg border cursor-pointer transition-colors whitespace-nowrap shrink-0 ${btnCls}`}
                  >
                    <span>#{idx + 1}</span>
                    {isAnswered && (
                      isRight ? (
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${
                            isSelected ? 'text-emerald-300' : 'text-emerald-700'
                          }`}
                          aria-hidden="true"
                        />
                      ) : (
                        <AlertCircle
                          className={`w-3.5 h-3.5 ${
                            isSelected ? 'text-red-300' : 'text-red-700'
                          }`}
                          aria-hidden="true"
                        />
                      )
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Zone: Visual / Data Exhibit + Text Source */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">
                    {currentSource.category} · {currentSource.sourceType}
                  </span>
                  <span className="font-mono">
                    {currentSource.slideRef} · {safeSourceIdx + 1}/
                    {filteredSources.length}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-slate-900">
                  <HighlightedText
                    text={currentSource.title}
                    segmentId={`${currentSource.id}:title`}
                    activeState={sourceNarration}
                  />
                </h3>

                {currentSource.imagePath && (
                  <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                    {!imgError[currentSource.id] ? (
                      <img
                        src={currentSource.imagePath}
                        alt={currentSource.imageAlt || currentSource.title}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setImgError((prev) => ({
                            ...prev,
                            [currentSource.id]: true,
                          }))
                        }
                        className="w-full h-auto object-cover"
                      />
                    ) : (
                      <div className="h-56 flex flex-col items-center justify-center p-6 text-slate-500">
                        <ImageIcon className="w-8 h-8 mb-2" aria-hidden="true" />
                        <p className="text-xs">{currentSource.title}</p>
                      </div>
                    )}
                  </div>
                )}

                {currentSource.visualChart && (
                  <SourceVisualExhibit kind={currentSource.visualChart} />
                )}

                {currentSource.excerpt && (
                  <div
                    className={`border rounded-lg p-4 sm:p-5 transition-colors ${
                      sourceNarration?.segmentId ===
                      `${currentSource.id}:excerpt`
                        ? 'bg-amber-50/70 border-amber-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <p className="text-sm sm:text-base italic text-slate-900 leading-relaxed">
                      <HighlightedText
                        text={currentSource.excerpt}
                        segmentId={`${currentSource.id}:excerpt`}
                        activeState={sourceNarration}
                      />
                    </p>
                  </div>
                )}

                <AudioReadAloud
                  playerId={`source-${currentSource.id}`}
                  title={currentSource.title}
                  segments={sourceSegments}
                  onActiveChange={setSourceNarration}
                  compact
                />

                {/* Guided 30-2 Source Clues Accordion */}
                <div className="border border-slate-200 rounded-lg bg-slate-50/70">
                  <button
                    type="button"
                    onClick={() =>
                      setShowSourceClues((prev) => ({
                        ...prev,
                        [currentSource.id]: !prev[currentSource.id],
                      }))
                    }
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-medium text-slate-800 hover:bg-slate-100/80 rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Lightbulb
                        className="w-4 h-4 text-amber-600 shrink-0"
                        aria-hidden="true"
                      />
                      <span>
                        What to Look For: 30-2 Source Clues (
                        {currentSource.clues.length})
                      </span>
                    </span>
                    <span className="text-slate-500 font-mono">
                      {showSourceClues[currentSource.id] ? 'Hide' : 'Show'}
                    </span>
                  </button>
                  {showSourceClues[currentSource.id] && (
                    <ul className="px-4 pb-3.5 pt-1 space-y-1.5 text-xs text-slate-700 border-t border-slate-200/80 list-disc pl-8 leading-relaxed">
                      {currentSource.clues.map((clue, cIdx) => (
                        <li key={cIdx}>{clue}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-1 text-xs text-slate-600">
                <p className="font-medium text-slate-800">
                  {currentSource.attribution}
                </p>
                <p
                  className={`rounded-md transition-colors leading-relaxed ${
                    sourceNarration?.segmentId ===
                    `${currentSource.id}:context`
                      ? 'bg-amber-50/80 px-2 py-1 -mx-2 text-slate-900'
                      : ''
                  }`}
                >
                  <HighlightedText
                    text={currentSource.contextNote}
                    segmentId={`${currentSource.id}:context`}
                    activeState={sourceNarration}
                  />
                </p>
              </div>
            </div>

            {/* Right Zone: Guided 30-2 Analysis Question & Optional Written Practice */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="space-y-4">
                  <p className="text-xs font-mono font-semibold text-blue-700">
                    30-2 Source Interpretation Check
                  </p>
                  <h4 className="text-lg font-semibold text-slate-900 leading-snug">
                    {currentSource.question}
                  </h4>

                  <div className="space-y-2.5">
                    {(
                      sourceOptionOrders[currentSource.id] ??
                      currentSource.options.map((_, idx) => idx)
                    ).map((origIdx, displayIdx) => {
                      const opt = currentSource.options[origIdx];
                      const picked = sourceAnswers[currentSource.id];
                      const revealed = picked !== undefined;
                      const isPicked = picked === origIdx;
                      const isRight = origIdx === currentSource.correctIndex;

                      let cls =
                        'bg-white border-slate-200 text-slate-800 hover:bg-slate-50';
                      if (revealed) {
                        if (isRight) {
                          cls =
                            'bg-emerald-50 border-emerald-300 text-emerald-950';
                        } else if (isPicked && !isRight) {
                          cls = 'bg-red-50 border-red-300 text-red-950';
                        } else {
                          cls = 'bg-slate-50 border-slate-200 text-slate-400';
                        }
                      }

                      return (
                        <button
                          key={origIdx}
                          type="button"
                          onClick={() =>
                            setSourceAnswers((prev) => ({
                              ...prev,
                              [currentSource.id]: origIdx,
                            }))
                          }
                          className={`w-full text-left p-3.5 rounded-lg border text-sm transition-colors cursor-pointer flex items-start justify-between gap-2 ${cls}`}
                        >
                          <span className="leading-relaxed">
                            <span className="font-mono font-semibold mr-2">
                              {String.fromCharCode(65 + displayIdx)}.
                            </span>
                            {opt}
                          </span>
                          {revealed && isRight && (
                            <CheckCircle2
                              className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                          )}
                          {revealed && isPicked && !isRight && (
                            <AlertCircle
                              className="w-4 h-4 text-red-700 shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {sourceAnswers[currentSource.id] !== undefined && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1.5 text-sm">
                      <p className="font-semibold text-slate-900">
                        Model 30-2 Analysis
                      </p>
                      <p className="text-slate-700 leading-relaxed">
                        {currentSource.modelAnalysis}
                      </p>
                    </div>
                  )}
                </div>

                {/* Optional 30-2 Written Source Interpretation Practice */}
                <div className="border-t border-slate-200 pt-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-700">
                      <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Optional 30-2 Written Practice</span>
                    </p>
                    <span className="text-xs text-slate-500">Self-check</span>
                  </div>

                  <p className="text-sm font-medium text-slate-900 leading-snug">
                    {currentSource.writtenPrompt}
                  </p>

                  <label
                    htmlFor={`written-${currentSource.id}`}
                    className="sr-only"
                  >
                    Draft your 30-2 source interpretation
                  </label>
                  <textarea
                    id={`written-${currentSource.id}`}
                    rows={3}
                    value={writtenDrafts[currentSource.id] ?? ''}
                    onChange={(e) =>
                      setWrittenDrafts((prev) => ({
                        ...prev,
                        [currentSource.id]: e.target.value,
                      }))
                    }
                    placeholder="Write 2–3 sentences linking details from the source to Theme 6 concepts..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setShowWrittenSample((prev) => ({
                          ...prev,
                          [currentSource.id]: !prev[currentSource.id],
                        }))
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 text-xs font-medium rounded-lg cursor-pointer transition-colors whitespace-nowrap shrink-0"
                    >
                      {showWrittenSample[currentSource.id] ? (
                        <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                      <span>
                        {showWrittenSample[currentSource.id]
                          ? 'Hide Sample Paragraph'
                          : 'Compare with Sample 30-2 Paragraph'}
                      </span>
                    </button>

                    {writtenDrafts[currentSource.id]?.trim() && (
                      <span className="text-xs font-mono text-slate-500">
                        {
                          writtenDrafts[currentSource.id]
                            .trim()
                            .split(/\s+/).length
                        }{' '}
                        words drafted
                      </span>
                    )}
                  </div>

                  {showWrittenSample[currentSource.id] && (
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-4 space-y-2.5 text-xs">
                      <p className="font-semibold text-emerald-950">
                        Sample 30-2 Written Response
                      </p>
                      <p className="text-slate-800 leading-relaxed text-sm">
                        {currentSource.sampleWrittenResponse}
                      </p>
                      <div className="pt-1 border-t border-emerald-200/70 text-slate-700">
                        <span className="font-semibold text-emerald-950">
                          Key concepts to include:{' '}
                        </span>
                        <span className="font-mono">
                          {currentSource.keyTerms.join(' · ')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() =>
                    setSourceIdx(
                      (prev) =>
                        (prev - 1 + filteredSources.length) %
                        filteredSources.length,
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-800 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSourceIdx((prev) => (prev + 1) % filteredSources.length)
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>
                    Next Source (
                    {((safeSourceIdx + 1) % filteredSources.length) + 1} of{' '}
                    {filteredSources.length})
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
