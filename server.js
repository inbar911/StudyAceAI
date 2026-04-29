import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';

app.post('/api/claude', async (req, res) => {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY' });
  try {
    const r = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 2048, ...req.body })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/claude/stream', async (req, res) => {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY' });
  try {
    const r = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 2048, stream: true, ...req.body })
    });
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    for await (const chunk of r.body) res.write(chunk);
    res.end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/health', (_, res) => res.json({ ok: true, model: MODEL }));

const port = process.env.PORT || 8787;
app.listen(port, () => console.log(`StudyAce API on :${port}`));
