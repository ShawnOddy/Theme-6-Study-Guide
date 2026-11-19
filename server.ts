import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const ALLOWED_VOICES = new Set(['Kore', 'Charon', 'Puck', 'Fenrir', 'Zephyr']);

// In-memory WAV base64 cache so repeated listens of the same section are instant
const ttsCache = new Map<string, string>();
const MAX_CACHE_ENTRIES = 60;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    return res.json({
      ok: true,
      ttsConfigured: Boolean(getGeminiClient()),
    });
  });

  app.post('/api/tts', async (req, res) => {
    try {
      const rawText = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
      const requestedVoice =
        typeof req.body?.voice === 'string' && ALLOWED_VOICES.has(req.body.voice)
          ? req.body.voice
          : 'Zephyr';

      if (!rawText) {
        return res.status(400).json({ error: 'Text content is required for audio narration.' });
      }

      const text = rawText.slice(0, 6000);
      const cacheKey = crypto
        .createHash('sha256')
        .update(`${requestedVoice}:${text}`)
        .digest('hex');

      const cached = ttsCache.get(cacheKey);
      if (cached) {
        return res.json({ audioBase64: cached, mimeType: 'audio/wav', cached: true });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error:
            'Gemini API key is not configured. Add GEMINI_API_KEY in Settings > Secrets to enable AI voice narration.',
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text,
                speechMetadata: {
                  style:
                    'Clear, calm, engaging Social Studies teacher reading study notes aloud at an easy-to-follow pace',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: requestedVoice },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!base64Audio) {
        return res.status(502).json({
          error: 'No audio was returned by the voice service. Please try again.',
        });
      }

      if (ttsCache.size >= MAX_CACHE_ENTRIES) {
        const firstKey = ttsCache.keys().next().value;
        if (firstKey) ttsCache.delete(firstKey);
      }
      ttsCache.set(cacheKey, base64Audio);

      return res.json({
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
        cached: false,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unexpected error generating audio narration.';
      console.error('TTS generation error:', message);
      return res.status(500).json({
        error: 'Unable to generate AI narration right now. Please try again shortly.',
      });
    }
  });

  app.use('/api', (_req, res) => {
    return res.status(404).json({ error: 'API endpoint not found.' });
  });

  app.use(
    '/api',
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      const message =
        err instanceof Error ? err.message : 'Invalid API request.';
      console.error('API middleware error:', message);
      return res.status(400).json({ error: 'Invalid API request payload.' });
    },
  );

  const distDir = path.resolve(__dirname, 'dist');
  const isProd = process.env.NODE_ENV === 'production' && fs.existsSync(distDir);

  if (isProd) {
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
