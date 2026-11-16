import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '1mb' }));

const PORT = Number(process.env.PORT) || 3000;

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

interface TutorRequestBody {
  action?: 'explain' | 'examples' | 'test' | 'ask';
  contextType?: 'word' | 'verse' | 'term' | 'lesson';
  contextTitle?: string;
  arabicText?: string;
  contextDetails?: string;
  learningMode?: 'guided' | 'detailed' | 'exam';
  studentLevel?: string;
  customQuestion?: string;
}

app.post('/api/tutor', async (req, res) => {
  try {
    const body = (req.body ?? {}) as TutorRequestBody;
    const action = body.action ?? 'explain';
    const learningMode = body.learningMode ?? 'guided';
    const contextType = body.contextType ?? 'word';
    const arabicText = (body.arabicText ?? '').trim();
    const contextTitle = (body.contextTitle ?? '').trim();
    const contextDetails = (body.contextDetails ?? '').trim();
    const customQuestion = (body.customQuestion ?? '').trim();

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in environment secrets. Please verify Settings > Secrets.',
      });
      return;
    }

    const modeDirective =
      learningMode === 'guided'
        ? 'The student is in GUIDED LEARNING mode (beginner-friendly). Teach in clear, gentle Urdu, avoid overwhelming technical jargon, explain any Arabic term briefly in simple Urdu, and keep the initial explanation concise (3-5 short paragraphs or bullet points).'
        : learningMode === 'detailed'
        ? 'The student is in DETAILED STUDY mode (intermediate/Dars-e-Nizami level). Include classical Sarf/Nahw terminology in Arabic alongside clear Urdu explanation, mention Aamil/Ma’mool and I’rab signs, and cite well-known grammatical principles accurately.'
        : 'The student is in EXAMINATION mode. Do NOT just hand over the full final answer immediately if testing—pose a clear analytical question or evaluate their reasoning first, then provide structured feedback.';

    const actionDirective =
      action === 'explain'
        ? 'Explain this clearly in Urdu: start with a simple 2-sentence overview, then break down the morphology/syntax or grammatical rule step-by-step.'
        : action === 'examples'
        ? 'Provide 2–3 authentic, fully vowelled Quranic examples (with exact Surah name and Ayah number—only cite verses you are 100% certain of!) illustrating this exact rule or word pattern, with Urdu translation and brief grammatical pointer.'
        : action === 'test'
        ? 'Create 1–2 short, focused practice questions (multiple-choice or short analytical prompt in Urdu) to test the student’s understanding of this specific item, and include a clearly separated Answer Key / Hint section at the bottom.'
        : `Answer the student's specific question directly and pedagogically in Urdu: "${customQuestion}"`;

    const systemInstruction = `You are Ustad Al-Muallim (استادِ معلم), an expert, patient Quranic Arabic teacher for native Urdu speakers.
Academic Integrity Rules:
1. NEVER invent Quranic verses, Surah/Ayah references, Arabic roots, or book quotations. If uncertain of an exact reference, state that clearly.
2. Always include full Arabic diacritics (تشكيل/حرکات) on Arabic words and examples.
3. Teach primarily in natural, clear Urdu, keeping Arabic terms accurate and English terms minimal unless helpful.
4. End with one short follow-up reflection question to keep the student actively thinking.
5. Keep total response focused and structured with clear headings (no code comments or robotic symbols).
${modeDirective}`;

    const prompt = [
      `Context Type: ${contextType}`,
      contextTitle ? `Topic / Title: ${contextTitle}` : '',
      arabicText ? `Arabic Text: ${arabicText}` : '',
      contextDetails ? `Verified Context Metadata: ${contextDetails}` : '',
      `Requested Teaching Action: ${actionDirective}`,
    ]
      .filter(Boolean)
      .join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    const text = response.text?.trim();
    if (!text) {
      res.status(502).json({ error: 'Empty response received from tutor service.' });
      return;
    }

    res.json({
      reply: text,
      verificationStatus: 'AI GENERATED — NEEDS REVIEW',
      model: 'gemini-4-hydrogen',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error';
    res.status(500).json({ error: `Tutor request failed: ${message}` });
  }
});

async function startServer() {
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server: httpServer },
        ws: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`AL-MUALLIM 2.0 server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
