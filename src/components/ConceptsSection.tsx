import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  ExternalLink,
  Image as ImageIcon,
  PlayCircle,
  Scale,
} from 'lucide-react';
import { STUDY_CHAPTERS } from '../data/theme6Data';
import {
  ActiveNarrationState,
  AudioReadAloud,
  HighlightedText,
  NarrationSegment,
} from './AudioReadAloud';

interface ConceptsSectionProps {
  activeChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  reviewedTopics: string[];
  onToggleTopicReviewed: (topicId: string) => void;
}

export function ConceptsSection({
  activeChapterId,
  onSelectChapter,
  reviewedTopics,
  onToggleTopicReviewed,
}: ConceptsSectionProps) {
  const activeChapter =
    STUDY_CHAPTERS.find((c) => c.id === activeChapterId) ?? STUDY_CHAPTERS[0];

  const [checkpointAnswers, setCheckpointAnswers] = useState<
    Record<string, number>
  >({});
  const [selectedVideoByChapter, setSelectedVideoByChapter] = useState<
    Record<string, string>
  >({});
  const [showVideoPlayer, setShowVideoPlayer] = useState<boolean>(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [activeNarration, setActiveNarration] =
    useState<ActiveNarrationState | null>(null);
  const [autoFollowScroll, setAutoFollowScroll] = useState<boolean>(true);

  const selectedOption = checkpointAnswers[activeChapter.checkpoint.id];
  const hasAnswered = selectedOption !== undefined;
  const isCorrect =
    hasAnswered && selectedOption === activeChapter.checkpoint.correctIndex;

  const chapterIdx = STUDY_CHAPTERS.findIndex((c) => c.id === activeChapter.id);
  const nextChapter =
    chapterIdx >= 0 && chapterIdx < STUDY_CHAPTERS.length - 1
      ? STUDY_CHAPTERS[chapterIdx + 1]
      : null;

  const activeVideo =
    activeChapter.videos.find(
      (v) => v.id === selectedVideoByChapter[activeChapter.id],
    ) ?? activeChapter.videos[0];

  const chapterSegments = useMemo<NarrationSegment[]>(() => {
    const segs: NarrationSegment[] = [
      {
        id: 'chapter-title',
        label: activeChapter.number,
        text: activeChapter.title,
      },
      {
        id: 'chapter-subtitle',
        label: 'Chapter Overview',
        text: activeChapter.subtitle,
      },
      {
        id: 'scene-title',
        label: 'Historical Scene',
        text: activeChapter.illustration.title,
      },
      {
        id: 'scene-caption',
        label: 'Visual Context',
        text: activeChapter.illustration.caption,
      },
      ...activeChapter.illustration.visualCues.map((cue, cIdx) => ({
        id: `scene-cue:${cIdx}`,
        label: `What to Notice ${cIdx + 1}`,
        text: cue,
      })),
    ];

    for (const topic of activeChapter.topics) {
      segs.push({
        id: `${topic.id}:title`,
        label: topic.title,
        text: topic.title,
      });
      segs.push({
        id: `${topic.id}:takeaway`,
        label: `${topic.title} · Takeaway`,
        text: topic.plainTakeaway,
      });
      topic.keyPoints.forEach((pt, pIdx) => {
        segs.push({
          id: `${topic.id}:point:${pIdx}`,
          label: `${topic.title} · Point ${pIdx + 1}`,
          text: pt,
        });
      });
      segs.push({
        id: `${topic.id}:rejects`,
        label: `${topic.title} · 30-2 Link`,
        text: topic.rejectsLiberalism,
      });
      if (topic.spotlightTitle && topic.spotlightText) {
        segs.push({
          id: `${topic.id}:spotlight`,
          label: topic.spotlightTitle,
          text: topic.spotlightText,
        });
      }
    }

    return segs;
  }, [activeChapter]);

  const handleNarrationChange = (
    playerId: string,
    next: ActiveNarrationState | null,
  ) => {
    setActiveNarration((prev) => {
      if (next === null) {
        return prev?.sourcePlayerId === playerId ? null : prev;
      }
      return next;
    });
  };

  useEffect(() => {
    setActiveNarration(null);
  }, [activeChapter.id]);

  // Gently keep the currently read block in view if it scrolls off-screen
  useEffect(() => {
    if (!autoFollowScroll || !activeNarration?.segmentId) return;
    const el = document.querySelector(
      `[data-narration-segment="${CSS.escape(activeNarration.segmentId)}"]`,
    );
    if (el instanceof HTMLElement) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [autoFollowScroll, activeNarration?.segmentId]);

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <p className="text-xs font-medium text-slate-500">
          Key Concepts · Plain-Language Study Notes, Visuals &amp; Audio
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 mt-1 [text-wrap:balance]">
          Theme 6 Core Lessons
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl">
          Read each chapter, listen with optional AI voice narration, watch the
          presentation videos, and answer the checkpoint question at the bottom.
        </p>
      </div>

      {/* Chapter Navigation Tabs */}
      <div
        role="tablist"
        aria-label="Study chapters"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2"
      >
        {STUDY_CHAPTERS.map((chapter) => {
          const active = chapter.id === activeChapter.id;
          const done = chapter.topics.filter((t) =>
            reviewedTopics.includes(t.id),
          ).length;

          return (
            <button
              key={chapter.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                onSelectChapter(chapter.id);
                setShowVideoPlayer(false);
              }}
              className={`text-left px-4 py-3 rounded-xl border transition-colors cursor-pointer ${
                active
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className={active ? 'text-slate-300' : 'text-slate-500'}>
                  {chapter.number}
                </span>
                <span
                  className={`tabular-nums ${active ? 'text-slate-300' : 'text-slate-500'}`}
                >
                  {done}/{chapter.topics.length}
                </span>
              </div>
              <p className="text-sm font-semibold truncate">{chapter.title}</p>
            </button>
          );
        })}
      </div>

      {/* Active Chapter Header + Full Chapter AI Audio Narration */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-mono">
          <span>
            {activeChapter.number} · Estimated {activeChapter.estimatedMinutes}{' '}
            min read
          </span>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-1.5 font-sans text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoFollowScroll}
                onChange={(e) => setAutoFollowScroll(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span>Auto-follow highlight</span>
            </label>
            <span className="tabular-nums">
              {
                activeChapter.topics.filter((t) =>
                  reviewedTopics.includes(t.id),
                ).length
              }{' '}
              of {activeChapter.topics.length} topics reviewed
            </span>
          </div>
        </div>
        <h2
          data-narration-segment="chapter-title"
          className="text-2xl font-semibold text-slate-900"
        >
          <HighlightedText
            text={activeChapter.title}
            segmentId="chapter-title"
            activeState={activeNarration}
          />
        </h2>
        <p
          data-narration-segment="chapter-subtitle"
          className={`text-sm leading-relaxed rounded-md transition-colors ${
            activeNarration?.segmentId === 'chapter-subtitle'
              ? 'bg-amber-50/80 px-2 py-1 -mx-2 text-slate-900'
              : 'text-slate-600'
          }`}
        >
          <HighlightedText
            text={activeChapter.subtitle}
            segmentId="chapter-subtitle"
            activeState={activeNarration}
          />
        </p>

        <AudioReadAloud
          playerId={`chapter-${activeChapter.id}`}
          title={`Full ${activeChapter.number}`}
          segments={chapterSegments}
          onActiveChange={(state) =>
            handleNarrationChange(`chapter-${activeChapter.id}`, state)
          }
        />
      </div>

      {/* Illustrated Historical Scene Card */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 bg-slate-100 relative min-h-[220px]">
          {!imgErrors[activeChapter.id] ? (
            <img
              src={activeChapter.illustration.imagePath}
              alt={activeChapter.illustration.alt}
              referrerPolicy="no-referrer"
              onError={() =>
                setImgErrors((prev) => ({ ...prev, [activeChapter.id]: true }))
              }
              className="w-full h-full object-cover lg:max-h-[340px]"
            />
          ) : (
            <div className="w-full h-full min-h-[220px] flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600">
              <ImageIcon className="w-8 h-8 mb-2 text-slate-400" aria-hidden="true" />
              <p className="text-sm font-medium text-slate-800">
                {activeChapter.illustration.title}
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-mono text-slate-500">
              Historical Scene · Visual Context
            </p>
            <h3
              data-narration-segment="scene-title"
              className="text-lg font-semibold text-slate-900"
            >
              <HighlightedText
                text={activeChapter.illustration.title}
                segmentId="scene-title"
                activeState={activeNarration}
              />
            </h3>
            <p
              data-narration-segment="scene-caption"
              className={`text-sm leading-relaxed rounded-md transition-colors ${
                activeNarration?.segmentId === 'scene-caption'
                  ? 'bg-amber-50/80 px-2 py-1 -mx-2 text-slate-900'
                  : 'text-slate-600'
              }`}
            >
              <HighlightedText
                text={activeChapter.illustration.caption}
                segmentId="scene-caption"
                activeState={activeNarration}
              />
            </p>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-1.5">
            <p className="text-xs font-semibold text-slate-700">
              What to Notice
            </p>
            <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
              {activeChapter.illustration.visualCues.map((cue, idx) => {
                const segId = `scene-cue:${idx}`;
                const isCueActive = activeNarration?.segmentId === segId;
                return (
                  <li
                    key={idx}
                    data-narration-segment={segId}
                    className={`rounded-md transition-colors ${
                      isCueActive
                        ? 'bg-amber-50/80 px-1.5 py-0.5 -mx-1.5 text-slate-900'
                        : ''
                    }`}
                  >
                    <HighlightedText
                      text={cue}
                      segmentId={segId}
                      activeState={activeNarration}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Topics List */}
      <div className="space-y-6">
        {activeChapter.topics.map((topic, idx) => {
          const isReviewed = reviewedTopics.includes(topic.id);
          const topicSegments: NarrationSegment[] = [
            {
              id: `${topic.id}:title`,
              label: topic.title,
              text: topic.title,
            },
            {
              id: `${topic.id}:takeaway`,
              label: 'Plain-Language Takeaway',
              text: topic.plainTakeaway,
            },
            ...topic.keyPoints.map((pt, pIdx) => ({
              id: `${topic.id}:point:${pIdx}`,
              label: `Key Point ${pIdx + 1}`,
              text: pt,
            })),
            {
              id: `${topic.id}:rejects`,
              label: 'How This Rejects Liberalism',
              text: topic.rejectsLiberalism,
            },
            ...(topic.spotlightTitle && topic.spotlightText
              ? [
                  {
                    id: `${topic.id}:spotlight`,
                    label: topic.spotlightTitle,
                    text: topic.spotlightText,
                  },
                ]
              : []),
          ];

          const isTakeawayActive =
            activeNarration?.segmentId === `${topic.id}:takeaway`;
          const isRejectsActive =
            activeNarration?.segmentId === `${topic.id}:rejects`;
          const isSpotlightActive =
            activeNarration?.segmentId === `${topic.id}:spotlight`;

          return (
            <article
              key={topic.id}
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <p className="text-xs font-mono text-slate-500">
                    Topic 0{idx + 1} · {topic.kicker}
                  </p>
                  <h3
                    data-narration-segment={`${topic.id}:title`}
                    className="text-xl font-semibold text-slate-900"
                  >
                    <HighlightedText
                      text={topic.title}
                      segmentId={`${topic.id}:title`}
                      activeState={activeNarration}
                    />
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleTopicReviewed(topic.id)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isReviewed
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isReviewed ? (
                    <CheckCircle2
                      className="w-4 h-4 text-emerald-700"
                      aria-hidden="true"
                    />
                  ) : (
                    <Circle
                      className="w-4 h-4 text-slate-400"
                      aria-hidden="true"
                    />
                  )}
                  <span>{isReviewed ? 'Reviewed' : 'Mark as Reviewed'}</span>
                </button>
              </div>

              {/* Optional per-topic Text-to-Speech */}
              <AudioReadAloud
                playerId={`topic-${topic.id}`}
                title={topic.title}
                segments={topicSegments}
                onActiveChange={(state) =>
                  handleNarrationChange(`topic-${topic.id}`, state)
                }
                compact
              />

              {/* Plain-Language Takeaway */}
              <div
                data-narration-segment={`${topic.id}:takeaway`}
                className={`border rounded-lg p-4 transition-colors ${
                  isTakeawayActive
                    ? 'bg-amber-50/70 border-amber-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Plain-Language Takeaway
                </p>
                <p className="text-sm font-medium text-slate-900 leading-relaxed">
                  <HighlightedText
                    text={topic.plainTakeaway}
                    segmentId={`${topic.id}:takeaway`}
                    activeState={activeNarration}
                  />
                </p>
              </div>

              {/* Key Points */}
              <ul className="space-y-2.5 text-sm text-slate-700 leading-relaxed list-disc pl-5">
                {topic.keyPoints.map((point, pIdx) => {
                  const segId = `${topic.id}:point:${pIdx}`;
                  const isPointActive = activeNarration?.segmentId === segId;
                  return (
                    <li
                      key={pIdx}
                      data-narration-segment={segId}
                      className={`rounded-md transition-colors ${
                        isPointActive
                          ? 'bg-amber-50/80 px-2 py-1 -mx-2 text-slate-950'
                          : ''
                      }`}
                    >
                      <HighlightedText
                        text={point}
                        segmentId={segId}
                        activeState={activeNarration}
                      />
                    </li>
                  );
                })}
              </ul>

              {/* How It Rejects Liberalism + Optional Spotlight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div
                  data-narration-segment={`${topic.id}:rejects`}
                  className={`space-y-1 rounded-lg transition-colors ${
                    isRejectsActive ? 'bg-amber-50/70 p-2.5 -m-2.5' : ''
                  }`}
                >
                  <p className="text-xs font-semibold text-blue-800">
                    How This Rejects Liberalism (30-2 Link)
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <HighlightedText
                      text={topic.rejectsLiberalism}
                      segmentId={`${topic.id}:rejects`}
                      activeState={activeNarration}
                    />
                  </p>
                </div>

                {topic.spotlightTitle && topic.spotlightText && (
                  <div
                    data-narration-segment={`${topic.id}:spotlight`}
                    className={`space-y-1 rounded-lg transition-colors ${
                      isSpotlightActive ? 'bg-amber-50/70 p-2.5 -m-2.5' : ''
                    }`}
                  >
                    <p className="text-xs font-semibold text-amber-800">
                      {topic.spotlightTitle}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      <HighlightedText
                        text={topic.spotlightText}
                        segmentId={`${topic.id}:spotlight`}
                        activeState={activeNarration}
                      />
                    </p>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Watch & Learn: Curated Presentation Videos */}
      {activeChapter.videos.length > 0 && activeVideo && (
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs font-mono text-slate-500">
                Visual Learner Shelf · From Your Theme 6 Slides
              </p>
              <h3 className="text-xl font-semibold text-slate-900 mt-0.5">
                Watch &amp; Learn Videos
              </h3>
            </div>
            <a
              href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}${
                activeVideo.startSeconds ? `&t=${activeVideo.startSeconds}s` : ''
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 self-start"
            >
              <span>Open on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Video Picker List */}
            <div className="lg:col-span-5 space-y-2">
              {activeChapter.videos.map((vid) => {
                const isSelected = vid.id === activeVideo.id;
                return (
                  <button
                    key={vid.id}
                    type="button"
                    onClick={() => {
                      setSelectedVideoByChapter((prev) => ({
                        ...prev,
                        [activeChapter.id]: vid.id,
                      }));
                      setShowVideoPlayer(true);
                    }}
                    className={`w-full text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span
                        className={isSelected ? 'text-slate-300' : 'text-slate-500'}
                      >
                        {vid.durationHint}
                      </span>
                      <PlayCircle
                        className={`w-4 h-4 ${
                          isSelected ? 'text-white' : 'text-slate-500'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-sm font-semibold leading-snug">
                      {vid.title}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        isSelected ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {vid.slideContext}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Video Player Stage */}
            <div className="lg:col-span-7 space-y-3">
              {showVideoPlayer ? (
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-950">
                  <iframe
                    key={activeVideo.id}
                    className="w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}${
                      activeVideo.startSeconds
                        ? `?start=${activeVideo.startSeconds}`
                        : ''
                    }`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-xl border border-slate-200 bg-slate-900 text-white p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <PlayCircle
                    className="w-12 h-12 text-slate-300"
                    aria-hidden="true"
                  />
                  <div className="space-y-1 max-w-md">
                    <p className="text-base font-semibold">
                      {activeVideo.title}
                    </p>
                    <p className="text-xs text-slate-300">
                      {activeVideo.slideContext}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowVideoPlayer(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Load Video Player</span>
                  </button>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold text-slate-900">
                  Watch For:{' '}
                </span>
                {activeVideo.watchFor}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Chapter Side-by-Side Comparison Table */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center gap-2.5 bg-slate-50">
          <Scale
            className="w-4 h-4 text-slate-700 shrink-0"
            aria-hidden="true"
          />
          <h3 className="text-base font-semibold text-slate-900">
            {activeChapter.comparison.title}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="py-3 px-4 font-semibold text-slate-700 w-1/5">
                  Feature
                </th>
                <th className="py-3 px-4 font-semibold text-blue-800 w-2/5">
                  {activeChapter.comparison.leftHeading}
                </th>
                <th className="py-3 px-4 font-semibold text-red-800 w-2/5">
                  {activeChapter.comparison.rightHeading}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeChapter.comparison.rows.map((row) => (
                <tr key={row.aspect} className="align-top">
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    {row.aspect}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 leading-relaxed">
                    {row.leftLabel}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 leading-relaxed">
                    {row.rightLabel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Inline Chapter Checkpoint Question */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-mono text-blue-700 font-semibold">
            Chapter Checkpoint
          </p>
          <h3 className="text-lg font-semibold text-slate-900">
            {activeChapter.checkpoint.question}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {activeChapter.checkpoint.options.map((option, idx) => {
            const isPicked = selectedOption === idx;
            const isRightOption = idx === activeChapter.checkpoint.correctIndex;

            let styleClass =
              'bg-white border-slate-200 text-slate-800 hover:bg-slate-50';
            if (hasAnswered) {
              if (isRightOption) {
                styleClass =
                  'bg-emerald-50 border-emerald-300 text-emerald-950';
              } else if (isPicked && !isRightOption) {
                styleClass = 'bg-red-50 border-red-300 text-red-950';
              } else {
                styleClass = 'bg-slate-50 border-slate-200 text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  setCheckpointAnswers((prev) => ({
                    ...prev,
                    [activeChapter.checkpoint.id]: idx,
                  }))
                }
                className={`text-left p-3.5 rounded-lg border text-sm transition-colors cursor-pointer flex items-start justify-between gap-3 ${styleClass}`}
              >
                <span className="leading-relaxed">
                  <span className="font-mono font-semibold mr-2">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {option}
                </span>
                {hasAnswered && isRightOption && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 shrink-0 mt-0.5">
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>Correct</span>
                  </span>
                )}
                {hasAnswered && isPicked && !isRightOption && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-800 shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Incorrect</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div
            className={`p-4 rounded-lg border text-sm leading-relaxed ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <span className="font-semibold">
              {isCorrect ? 'Well done: ' : 'Study tip: '}
            </span>
            {activeChapter.checkpoint.explanation}
          </div>
        )}

        {nextChapter && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => {
                onSelectChapter(nextChapter.id);
                setShowVideoPlayer(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>
                Next: {nextChapter.number} — {nextChapter.title}
              </span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
