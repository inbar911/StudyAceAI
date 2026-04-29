const MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

function toGeminiBody({ system, messages = [], max_tokens = 2048 }) {
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: Array.isArray(m.content)
      ? m.content.map(p =>
          p.type === 'image'
            ? { inline_data: { mime_type: p.source.media_type, data: p.source.data } }
            : { text: p.text }
        )
      : [{ text: m.content }]
  }));
  const body = { contents, generationConfig: { maxOutputTokens: max_tokens } };
  if (system) body.system_instruction = { parts: [{ text: system }] };
  return body;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
  try {
    const r = await fetch(`${GEMINI_URL}?key=${key}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(toGeminiBody(req.body))
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.error?.message || 'Gemini error' });
    const text = data.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
    res.json({ content: [{ type: 'text', text }] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
