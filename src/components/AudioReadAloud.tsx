import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Loader2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Square,
  Volume2,
} from 'lucide-react';

export interface NarrationSegment {
  id: string;
  label?: string;
  text: string;
}

export interface ActiveNarrationState {
  sourcePlayerId: string;
  segmentId: string;
  segmentLabel?: string;
  sentenceIndex: number;
  totalSentences: number;
  sentenceText: string;
  sentenceStart: number;
  sentenceEnd: number;
  wordStart?: number;
  wordEnd?: number;
}

interface AudioReadAloudProps {
  playerId?: string;
  title: string;
  textToRead?: string;
  segments?: NarrationSegment[];
  onActiveChange?: (state: ActiveNarrationState | null) => void;
  compact?: boolean;
}

interface WordSpan {
  startInSegment: number;
  endInSegment: number;
  weightStart: number;
  weightEnd: number;
}

interface IndexedSentence {
  sentenceIndex: number;
  segmentId: string;
  segmentLabel?: string;
  text: string;
  startInSegment: number;
  endInSegment: number;
  weightStart: number;
  weightEnd: number;
  words: WordSpan[];
}

const VOICES = [
  { id: 'Zephyr', label: 'Zephyr (Bright)' },
  { id: 'Kore', label: 'Kore (Balanced)' },
  { id: 'Charon', label: 'Charon (Calm)' },
];

const SPEEDS = [0.9, 1.0, 1.15];

const NON_BREAKING_ABBREVS = new Set([
  'e.g',
  'i.e',
  'u.s',
  'u.s.s.r',
  's.o',
  'st',
  'mr',
  'mrs',
  'ms',
  'dr',
  'vs',
  'etc',
  'approx',
  'no',
]);

// Global tracker so starting a new clip stops any currently playing clip
let activeStopCallback: (() => void) | null = null;

function findSentenceRanges(raw: string): Array<{ start: number; end: number }> {
  const ranges: Array<{ start: number; end: number }> = [];
  let cursor = 0;

  const pushTrimmedRange = (from: number, to: number) => {
    let start = from;
    let end = to;
    while (start < end && /\s/.test(raw[start])) start++;
    while (end > start && /\s/.test(raw[end - 1])) end--;
    if (end > start) {
      ranges.push({ start, end });
    }
  };

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (ch !== '.' && ch !== '!' && ch !== '?') continue;

    // Skip ellipsis dots until the final dot
    if (ch === '.' && raw[i + 1] === '.') continue;

    // Skip decimals like 3.3 or 1.5
    if (ch === '.' && i > 0 && /\d/.test(raw[i - 1]) && /\d/.test(raw[i + 1] ?? '')) {
      continue;
    }

    if (ch === '.') {
      // Extract word token ending right before this period (e.g., "e.g", "St", "S.O")
      let tokenStart = i - 1;
      while (tokenStart >= 0 && /[A-Za-z0-9.]/.test(raw[tokenStart])) {
        tokenStart--;
      }
      const token = raw.slice(tokenStart + 1, i).toLowerCase();

      if (NON_BREAKING_ABBREVS.has(token)) {
        continue;
      }

      // Skip numbered list prefix at the start of a sentence (e.g., "1. Censorship:")
      if (/^\d+$/.test(token) && raw.slice(cursor, tokenStart + 1).trim() === '') {
        continue;
      }
    }

    // Include trailing closing quotes / parentheses
    let endPos = i + 1;
    while (endPos < raw.length && /["')\]’”!]/.test(raw[endPos])) {
      endPos++;
    }

    // A real sentence break is followed by end-of-string or whitespace
    if (endPos === raw.length || /\s/.test(raw[endPos])) {
      pushTrimmedRange(cursor, endPos);
      cursor = endPos;
      i = endPos - 1;
    }
  }

  if (cursor < raw.length) {
    pushTrimmedRange(cursor, raw.length);
  }

  return ranges;
}

function buildIndexedNarration(segments: NarrationSegment[]): {
  fullText: string;
  sentences: IndexedSentence[];
  totalWeight: number;
} {
  const sentences: IndexedSentence[] = [];
  const joinedParts: string[] = [];
  let cumulativeWeight = 0;

  for (const segment of segments) {
    const raw = segment.text;
    if (!raw || !raw.trim()) continue;
    joinedParts.push(raw.trim());

    const ranges = findSentenceRanges(raw);
    for (const { start, end } of ranges) {
      const trimmed = raw.slice(start, end);
      const weightStart = cumulativeWeight;

      const words: WordSpan[] = [];
      const wordRegex = /\S+/g;
      let wordMatch: RegExpExecArray | null;
      while ((wordMatch = wordRegex.exec(trimmed)) !== null) {
        const wText = wordMatch[0];
        const wStart = start + wordMatch.index;
        const wEnd = wStart + wText.length;
        let wWeight = Math.max(2, wText.length);
        if (/[,;:—–-]$/.test(wText)) wWeight += 3;
        if (/[.!?]["')\]’”]*$/.test(wText)) wWeight += 8;

        words.push({
          startInSegment: wStart,
          endInSegment: wEnd,
          weightStart: cumulativeWeight,
          weightEnd: cumulativeWeight + wWeight,
        });
        cumulativeWeight += wWeight;
      }

      cumulativeWeight += 4;

      sentences.push({
        sentenceIndex: sentences.length,
        segmentId: segment.id,
        segmentLabel: segment.label,
        text: trimmed,
        startInSegment: start,
        endInSegment: end,
        weightStart,
        weightEnd: cumulativeWeight,
        words,
      });
    }
  }

  return {
    fullText: joinedParts.join(' '),
    sentences,
    totalWeight: Math.max(1, cumulativeWeight),
  };
}

function findWordEndInSentence(sentenceText: string, charIndex: number): number {
  let end = charIndex;
  while (end < sentenceText.length && !/\s/.test(sentenceText[end])) {
    end++;
  }
  return Math.max(charIndex + 1, end);
}

function pickEnglishBrowserVoice(
  preferredId: string,
): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const englishVoices = voices.filter((v) =>
    v.lang.toLowerCase().startsWith('en'),
  );
  const pool = englishVoices.length > 0 ? englishVoices : voices;

  if (preferredId === 'Charon' && pool.length > 1) {
    const deep = pool.find((v) =>
      /daniel|david|george|mark|arthur|male/i.test(v.name),
    );
    if (deep) return deep;
  }
  if (preferredId === 'Zephyr' && pool.length > 1) {
    const bright = pool.find((v) =>
      /samantha|aria|jenny|karen|serena|natural|google/i.test(v.name),
    );
    if (bright) return bright;
  }

  return (
    pool.find((v) => v.lang.toLowerCase() === 'en-ca') ||
    pool.find((v) => v.lang.toLowerCase() === 'en-us') ||
    pool[0] ||
    null
  );
}

interface HighlightedTextProps {
  text: string;
  segmentId: string;
  activeState: ActiveNarrationState | null;
}

export function HighlightedText({
  text,
  segmentId,
  activeState,
}: HighlightedTextProps) {
  if (!activeState || activeState.segmentId !== segmentId) {
    return <>{text}</>;
  }

  const sStart = Math.max(0, Math.min(text.length, activeState.sentenceStart));
  const sEnd = Math.max(sStart, Math.min(text.length, activeState.sentenceEnd));

  const hasWord =
    activeState.wordStart !== undefined &&
    activeState.wordEnd !== undefined &&
    activeState.wordStart >= sStart &&
    activeState.wordEnd <= sEnd;

  const beforeSentence = text.slice(0, sStart);
  const afterSentence = text.slice(sEnd);

  if (hasWord) {
    const wStart = activeState.wordStart!;
    const wEnd = activeState.wordEnd!;
    return (
      <>
        {beforeSentence}
        <mark className="bg-amber-100 text-slate-950 rounded-xs underline decoration-amber-500 decoration-2 underline-offset-4">
          {text.slice(sStart, wStart)}
          <span className="bg-amber-300 text-slate-950 font-medium rounded-xs px-0.5">
            {text.slice(wStart, wEnd)}
          </span>
          {text.slice(wEnd, sEnd)}
        </mark>
        {afterSentence}
      </>
    );
  }

  return (
    <>
      {beforeSentence}
      <mark className="bg-amber-200/90 text-slate-950 rounded-xs px-0.5 underline decoration-amber-500 decoration-2 underline-offset-4">
        {text.slice(sStart, sEnd)}
      </mark>
      {afterSentence}
    </>
  );
}

export function AudioReadAloud({
  playerId = 'default-player',
  title,
  textToRead = '',
  segments,
  onActiveChange,
  compact = false,
}: AudioReadAloudProps) {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'playing' | 'paused' | 'error'
  >('idle');
  const [playbackMode, setPlaybackMode] = useState<'ai' | 'browser' | null>(
    null,
  );
  const [fallbackNote, setFallbackNote] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [voice, setVoice] = useState<string>('Zephyr');
  const [speed, setSpeed] = useState<number>(1.0);
  const [localHighlight, setLocalHighlight] =
    useState<ActiveNarrationState | null>(null);

  const segmentsKey =
    segments && segments.length > 0
      ? segments.map((s) => `${s.id}\u0000${s.text}`).join('\u0001')
      : `${playerId}\u0000${textToRead}`;

  const normalizedSegments = useMemo<NarrationSegment[]>(() => {
    if (segments && segments.length > 0) return segments;
    return [{ id: `${playerId}:full`, text: textToRead }];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segmentsKey]);

  const indexed = useMemo(
    () => buildIndexedNarration(normalizedSegments),
    [normalizedSegments],
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const cachedKeyRef = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);
  const fetchAbortRef = useRef<AbortController | null>(null);
  const requestSeqRef = useRef<number>(0);

  const speechIndexRef = useRef<number>(0);
  const speechActiveRef = useRef<boolean>(false);
  const speechSessionRef = useRef<number>(0);
  const speakTimerRef = useRef<number | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speedRef = useRef<number>(speed);
  const prevSpeedRef = useRef<number>(speed);
  const voiceRef = useRef<string>(voice);
  const statusRef = useRef(status);
  const playbackModeRef = useRef(playbackMode);
  const onActiveChangeRef = useRef(onActiveChange);
  const lastEmitSignatureRef = useRef<string>('');

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    voiceRef.current = voice;
  }, [voice]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    playbackModeRef.current = playbackMode;
  }, [playbackMode]);

  useEffect(() => {
    onActiveChangeRef.current = onActiveChange;
  }, [onActiveChange]);

  const emitHighlight = useCallback((next: ActiveNarrationState | null) => {
    const sig = next
      ? `${next.segmentId}|${next.sentenceIndex}|${next.sentenceStart}|${next.wordStart ?? -1}|${next.wordEnd ?? -1}`
      : 'null';
    if (sig === lastEmitSignatureRef.current) return;
    lastEmitSignatureRef.current = sig;
    setLocalHighlight(next);
    onActiveChangeRef.current?.(next);
  }, []);

  const emitSentence = useCallback(
    (sentence: IndexedSentence, wordStart?: number, wordEnd?: number) => {
      emitHighlight({
        sourcePlayerId: playerId,
        segmentId: sentence.segmentId,
        segmentLabel: sentence.segmentLabel,
        sentenceIndex: sentence.sentenceIndex,
        totalSentences: indexed.sentences.length,
        sentenceText: sentence.text,
        sentenceStart: sentence.startInSegment,
        sentenceEnd: sentence.endInSegment,
        wordStart,
        wordEnd,
      });
    },
    [playerId, indexed.sentences.length, emitHighlight],
  );

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const cancelPendingSpeech = useCallback((): boolean => {
    speechSessionRef.current += 1;
    if (speakTimerRef.current !== null) {
      window.clearTimeout(speakTimerRef.current);
      speakTimerRef.current = null;
    }
    if (activeUtteranceRef.current) {
      activeUtteranceRef.current.onstart = null;
      activeUtteranceRef.current.onboundary = null;
      activeUtteranceRef.current.onend = null;
      activeUtteranceRef.current.onerror = null;
      activeUtteranceRef.current = null;
    }
    if (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      (window.speechSynthesis.speaking ||
        window.speechSynthesis.pending ||
        window.speechSynthesis.paused)
    ) {
      window.speechSynthesis.cancel();
      return true;
    }
    return false;
  }, []);

  const stopBrowserSpeech = useCallback(() => {
    speechActiveRef.current = false;
    speechIndexRef.current = 0;
    cancelPendingSpeech();
  }, [cancelPendingSpeech]);

  const cleanupAudio = useCallback(() => {
    requestSeqRef.current += 1;
    if (fetchAbortRef.current) {
      fetchAbortRef.current.abort();
      fetchAbortRef.current = null;
    }
    stopRaf();
    stopBrowserSpeech();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    cachedKeyRef.current = null;
    emitHighlight(null);
  }, [stopRaf, stopBrowserSpeech, emitHighlight]);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  // Reset if narrated text changes (e.g. switching chapters or sources)
  useEffect(() => {
    cleanupAudio();
    setStatus('idle');
    setPlaybackMode(null);
    setFallbackNote(null);
    setErrorMessage(null);
  }, [indexed.fullText, cleanupAudio]);

  // Sync AI audio progress to active sentence & word via synchronized text index
  const startAiHighlightLoop = useCallback(
    (audio: HTMLAudioElement) => {
      stopRaf();

      const tick = () => {
        if (!audioRef.current || audio.paused || audio.ended) return;

        if (audio.duration > 0 && Number.isFinite(audio.duration)) {
          const progress = Math.max(
            0,
            Math.min(1, audio.currentTime / audio.duration),
          );
          const targetWeight = progress * indexed.totalWeight;

          const sentence =
            indexed.sentences.find(
              (s) => targetWeight >= s.weightStart && targetWeight <= s.weightEnd,
            ) ?? indexed.sentences[indexed.sentences.length - 1];

          if (sentence) {
            const word =
              sentence.words.find(
                (w) =>
                  targetWeight >= w.weightStart && targetWeight <= w.weightEnd,
              ) ?? sentence.words[sentence.words.length - 1];

            emitSentence(sentence, word?.startInSegment, word?.endInSegment);
          }
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    },
    [indexed, stopRaf, emitSentence],
  );

  const speakNextSentence = useCallback(
    (index: number, needsCancelDelay = false) => {
      if (
        !speechActiveRef.current ||
        typeof window === 'undefined' ||
        !('speechSynthesis' in window)
      ) {
        return;
      }

      const sentences = indexed.sentences;
      if (index >= sentences.length) {
        speechActiveRef.current = false;
        speechIndexRef.current = 0;
        activeUtteranceRef.current = null;
        emitHighlight(null);
        setStatus('idle');
        return;
      }

      const current = sentences[index];
      speechIndexRef.current = index;
      const sessionAtStart = speechSessionRef.current;

      const dispatchSpeak = () => {
        if (
          !speechActiveRef.current ||
          speechSessionRef.current !== sessionAtStart
        ) {
          return;
        }

        const utterance = new SpeechSynthesisUtterance(current.text);
        utterance.rate = speedRef.current;
        const selectedVoice = pickEnglishBrowserVoice(voiceRef.current);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        // Keep strong ref so Chrome does not GC utterance mid-sentence
        activeUtteranceRef.current = utterance;

        // Immediately show sentence highlight even if browser delays onstart
        emitSentence(current);

        utterance.onstart = () => {
          if (
            !speechActiveRef.current ||
            speechSessionRef.current !== sessionAtStart
          ) {
            return;
          }
          emitSentence(current);
        };

        utterance.onboundary = (event) => {
          if (
            !speechActiveRef.current ||
            speechSessionRef.current !== sessionAtStart
          ) {
            return;
          }
          if (typeof event.charIndex === 'number') {
            const wStart = current.startInSegment + event.charIndex;
            const rawLen =
              typeof event.charLength === 'number' && event.charLength > 0
                ? event.charLength
                : findWordEndInSentence(current.text, event.charIndex) -
                  event.charIndex;
            const wEnd = Math.min(current.endInSegment, wStart + rawLen);
            emitSentence(current, wStart, wEnd);
          }
        };

        utterance.onend = () => {
          if (
            speechActiveRef.current &&
            speechSessionRef.current === sessionAtStart
          ) {
            speakNextSentence(index + 1, false);
          }
        };

        utterance.onerror = (event) => {
          if (
            event.error === 'canceled' ||
            event.error === 'interrupted' ||
            speechSessionRef.current !== sessionAtStart
          ) {
            return;
          }
          speechActiveRef.current = false;
          activeUtteranceRef.current = null;
          emitHighlight(null);
          setStatus('error');
          setErrorMessage('Audio playback failed in your browser.');
        };

        window.speechSynthesis.speak(utterance);
      };

      if (needsCancelDelay) {
        speakTimerRef.current = window.setTimeout(() => {
          speakTimerRef.current = null;
          dispatchSpeak();
        }, 65);
      } else {
        dispatchSpeak();
      }
    },
    [indexed.sentences, emitSentence, emitHighlight],
  );

  const startBrowserSpeech = useCallback(
    (note: string) => {
      if (
        typeof window === 'undefined' ||
        !('speechSynthesis' in window) ||
        typeof SpeechSynthesisUtterance === 'undefined'
      ) {
        return false;
      }

      if (indexed.sentences.length === 0) return false;

      // Clear audio elements & cancel any existing speech safely
      stopRaf();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const didCancel = cancelPendingSpeech();

      speechIndexRef.current = 0;
      speechActiveRef.current = true;
      playbackModeRef.current = 'browser';
      setPlaybackMode('browser');
      setFallbackNote(note);
      setErrorMessage(null);
      setStatus('playing');
      speakNextSentence(0, didCancel);
      return true;
    },
    [indexed.sentences.length, stopRaf, cancelPendingSpeech, speakNextSentence],
  );

  // Only react when speed itself actually changes
  useEffect(() => {
    if (prevSpeedRef.current === speed) return;
    prevSpeedRef.current = speed;

    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    } else if (
      playbackModeRef.current === 'browser' &&
      statusRef.current === 'playing' &&
      speechActiveRef.current
    ) {
      const currentIdx = speechIndexRef.current;
      const didCancel = cancelPendingSpeech();
      speakNextSentence(currentIdx, didCancel);
    }
  }, [speed, cancelPendingSpeech, speakNextSentence]);

  const handleStop = useCallback(() => {
    requestSeqRef.current += 1;
    if (fetchAbortRef.current) {
      fetchAbortRef.current.abort();
      fetchAbortRef.current = null;
    }
    stopRaf();
    stopBrowserSpeech();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    emitHighlight(null);
    setStatus('idle');
  }, [stopRaf, stopBrowserSpeech, emitHighlight]);

  const jumpToSentence = useCallback(
    (delta: -1 | 1) => {
      if (!localHighlight || indexed.sentences.length === 0) return;
      const targetIdx = Math.max(
        0,
        Math.min(
          indexed.sentences.length - 1,
          localHighlight.sentenceIndex + delta,
        ),
      );
      const targetSentence = indexed.sentences[targetIdx];
      if (!targetSentence) return;

      if (playbackModeRef.current === 'browser' && 'speechSynthesis' in window) {
        const didCancel = cancelPendingSpeech();
        speechActiveRef.current = true;
        speechIndexRef.current = targetIdx;
        emitSentence(targetSentence);
        if (statusRef.current === 'paused') {
          setStatus('playing');
        }
        speakNextSentence(targetIdx, didCancel);
        return;
      }

      if (
        playbackModeRef.current === 'ai' &&
        audioRef.current &&
        audioRef.current.duration > 0
      ) {
        const targetTime =
          (targetSentence.weightStart / indexed.totalWeight) *
          audioRef.current.duration;
        audioRef.current.currentTime = targetTime;
        emitSentence(targetSentence);
        if (statusRef.current === 'paused') {
          void audioRef.current.play();
          setStatus('playing');
          startAiHighlightLoop(audioRef.current);
        }
      }
    },
    [
      localHighlight,
      indexed.sentences,
      indexed.totalWeight,
      cancelPendingSpeech,
      emitSentence,
      speakNextSentence,
      startAiHighlightLoop,
    ],
  );

  const handlePlayPause = async () => {
    if (status === 'loading') return;

    if (status === 'playing') {
      if (playbackModeRef.current === 'browser') {
        speechActiveRef.current = false;
        cancelPendingSpeech();
        setStatus('paused');
        return;
      }
      if (audioRef.current) {
        stopRaf();
        audioRef.current.pause();
        setStatus('paused');
        return;
      }
    }

    if (status === 'paused') {
      if (activeStopCallback && activeStopCallback !== handleStop) {
        activeStopCallback();
      }
      activeStopCallback = handleStop;

      if (playbackModeRef.current === 'browser') {
        const didCancel = cancelPendingSpeech();
        speechActiveRef.current = true;
        setStatus('playing');
        speakNextSentence(speechIndexRef.current, didCancel);
        return;
      }

      if (
        audioRef.current &&
        cachedKeyRef.current === `${voice}:${indexed.fullText}`
      ) {
        audioRef.current.playbackRate = speed;
        await audioRef.current.play();
        setStatus('playing');
        startAiHighlightLoop(audioRef.current);
        return;
      }
    }

    // Stop any other player currently active on the page
    if (activeStopCallback && activeStopCallback !== handleStop) {
      activeStopCallback();
    }
    activeStopCallback = handleStop;

    // Reuse existing decoded WAV if voice + text match
    if (
      audioRef.current &&
      cachedKeyRef.current === `${voice}:${indexed.fullText}`
    ) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = speed;
      playbackModeRef.current = 'ai';
      setPlaybackMode('ai');
      await audioRef.current.play();
      setStatus('playing');
      startAiHighlightLoop(audioRef.current);
      return;
    }

    const reqId = ++requestSeqRef.current;
    const controller = new AbortController();
    fetchAbortRef.current = controller;

    setStatus('loading');
    setErrorMessage(null);
    setFallbackNote(null);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ text: indexed.fullText, voice }),
        signal: controller.signal,
      });

      if (reqId !== requestSeqRef.current) return;

      const contentType = res.headers.get('content-type') || '';
      const rawBody = await res.text();
      if (reqId !== requestSeqRef.current) return;

      let data: {
        audioBase64?: string;
        mimeType?: string;
        error?: string;
      } | null = null;

      if (
        contentType.includes('application/json') ||
        rawBody.trim().startsWith('{')
      ) {
        try {
          data = JSON.parse(rawBody) as {
            audioBase64?: string;
            mimeType?: string;
            error?: string;
          };
        } catch {
          data = null;
        }
      }

      // If host served HTML (e.g. static SPA fallback) or AI voice key isn't configured,
      // seamlessly fall back to built-in browser speech with sentence + word highlighting.
      if (!data) {
        const started = startBrowserSpeech(
          'Playing with built-in browser voice (AI voice API is unavailable on this host).',
        );
        if (started) return;
        throw new Error(
          'Voice API returned an unexpected response and browser speech is not available.',
        );
      }

      if (!res.ok || !data.audioBase64) {
        const started = startBrowserSpeech(
          res.status === 503
            ? 'Playing with built-in browser voice (add GEMINI_API_KEY in Secrets for AI voice).'
            : 'Playing with built-in browser voice.',
        );
        if (started) return;
        throw new Error(data.error || 'Could not generate AI audio narration.');
      }

      cleanupAudio();

      const binaryStr = atob(data.audioBase64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;
      cachedKeyRef.current = `${voice}:${indexed.fullText}`;

      const audio = new Audio(url);
      audio.playbackRate = speed;
      audio.onended = () => {
        stopRaf();
        emitHighlight(null);
        setStatus('idle');
      };
      audio.onerror = () => {
        stopRaf();
        emitHighlight(null);
        setStatus('error');
        setErrorMessage('Audio playback failed in your browser.');
      };
      audioRef.current = audio;
      playbackModeRef.current = 'ai';
      setPlaybackMode('ai');

      await audio.play();
      setStatus('playing');
      startAiHighlightLoop(audio);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      if (reqId !== requestSeqRef.current) return;
      const started = startBrowserSpeech('Playing with built-in browser voice.');
      if (started) return;
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to play audio narration.',
      );
    }
  };

  return (
    <div
      className={`rounded-lg border border-slate-200 bg-slate-50 ${
        compact ? 'px-3 py-2' : 'p-3.5'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Volume2
            className="w-4 h-4 text-blue-700 shrink-0"
            aria-hidden="true"
          />
          <span className="text-xs font-medium text-slate-800 truncate">
            {status === 'loading'
              ? `Generating voice for "${title}"...`
              : status === 'playing'
                ? `Reading "${title}"${playbackMode === 'browser' ? ' (Device Voice)' : ''}`
                : status === 'paused'
                  ? `Paused "${title}"`
                  : `Listen to "${title}" (Read Aloud)`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!compact && (
            <label className="inline-flex items-center gap-1.5 text-xs text-slate-600">
              <span className="sr-only">Narrator voice</span>
              <select
                value={voice}
                onChange={(e) => {
                  setVoice(e.target.value);
                  if (status === 'playing' || status === 'paused') {
                    handleStop();
                  }
                }}
                aria-label="Choose narrator voice"
                className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          {/* Speed selector */}
          <div
            role="group"
            aria-label="Playback speed"
            className="inline-flex items-center bg-white border border-slate-200 rounded-md p-0.5"
          >
            {SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={`px-1.5 py-0.5 text-[11px] font-mono tabular-nums rounded cursor-pointer transition-colors ${
                  speed === s
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handlePlayPause}
            disabled={status === 'loading'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
          >
            {status === 'loading' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            ) : status === 'playing' ? (
              <Pause className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>
              {status === 'loading'
                ? 'Loading'
                : status === 'playing'
                  ? 'Pause'
                  : status === 'paused'
                    ? 'Resume'
                    : 'Listen'}
            </span>
          </button>

          {(status === 'playing' || status === 'paused') && (
            <button
              type="button"
              onClick={handleStop}
              aria-label="Stop narration"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Square className="w-3 h-3" aria-hidden="true" />
              <span>Stop</span>
            </button>
          )}
        </div>
      </div>

      {/* Live follow-along caption bar with synchronized sentence index & step controls */}
      {(status === 'playing' || status === 'paused') && localHighlight && (
        <div
          aria-live="polite"
          className="mt-2.5 pt-2.5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700 leading-relaxed"
        >
          <div className="min-w-0">
            <span className="font-mono font-semibold text-amber-900 mr-2 tabular-nums">
              Sentence {localHighlight.sentenceIndex + 1} /{' '}
              {localHighlight.totalSentences}
              {localHighlight.segmentLabel
                ? ` · ${localHighlight.segmentLabel}:`
                : ':'}
            </span>
            <span className="bg-amber-100/90 text-slate-950 rounded-xs px-1 py-0.5 underline decoration-amber-500 decoration-2 underline-offset-4">
              {localHighlight.sentenceText}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => jumpToSentence(-1)}
              disabled={localHighlight.sentenceIndex === 0}
              aria-label="Previous sentence"
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium bg-white border border-slate-200 text-slate-700 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
            >
              <SkipBack className="w-3 h-3" aria-hidden="true" />
              <span>Prev</span>
            </button>
            <button
              type="button"
              onClick={() => jumpToSentence(1)}
              disabled={
                localHighlight.sentenceIndex >= localHighlight.totalSentences - 1
              }
              aria-label="Next sentence"
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium bg-white border border-slate-200 text-slate-700 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
            >
              <span>Next</span>
              <SkipForward className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {fallbackNote && status !== 'error' && (
        <p className="text-[11px] text-slate-500 mt-1.5">{fallbackNote}</p>
      )}

      {status === 'error' && errorMessage && (
        <p className="text-xs text-red-700 mt-2" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
