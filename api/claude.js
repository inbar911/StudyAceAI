const MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-flash-latest'];
const urlFor = (m) => `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`;

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
  const payload = JSON.stringify(toGeminiBody(req.body));
  let lastErr = 'Unknown error';
  let lastStatus = 500;
  for (const model of MODELS) {
    try {
      const r = await fetch(`${urlFor(model)}?key=${key}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: payload
      });
      const data = await r.json();
      if (r.ok) {
        const text = data.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
        return res.json({ content: [{ type: 'text', text }] });
      }
      lastErr = data.error?.message || 'Gemini error';
      lastStatus = r.status;
      if (![429, 503, 500].includes(r.status)) break;
    } catch (e) {
      lastErr = e.message;
    }
  }
  res.status(lastStatus).json({ error: lastErr });
}
