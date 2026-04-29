const API_BASE = '/api/claude';

async function call(body) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || err.error || `Request failed (${res.status})`);
  }
  return res.json();
}

function extractText(resp) {
  return (resp.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
}

function extractJSON(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf('{');
  const startArr = body.indexOf('[');
  const s = startArr !== -1 && (startArr < start || start === -1) ? startArr : start;
  if (s === -1) throw new Error('No JSON found');
  let depth = 0, end = -1, opener = body[s], closer = opener === '{' ? '}' : ']';
  for (let i = s; i < body.length; i++) {
    if (body[i] === opener) depth++;
    else if (body[i] === closer) { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) throw new Error('Truncated JSON');
  return JSON.parse(body.slice(s, end + 1));
}

const langName = { en: 'English', he: 'Hebrew', es: 'Spanish' };

export async function generateFlashcards({ topic, count = 10, lang = 'en' }) {
  const system = `You are an expert tutor creating flashcards. Output STRICT JSON only — an array of objects with shape {"front": string, "back": string}. No prose, no markdown. Write all content in ${langName[lang] || 'English'}. Make cards concise, factual, and varied (definitions, examples, comparisons).`;
  const user = `Topic / source text:\n"""${topic}"""\n\nProduce exactly ${count} flashcards as a JSON array.`;
  const resp = await call({ system, messages: [{ role: 'user', content: user }] });
  const text = extractText(resp);
  const arr = extractJSON(text);
  if (!Array.isArray(arr)) throw new Error('Bad response shape');
  return arr.filter(c => c?.front && c?.back).map(c => ({ front: String(c.front), back: String(c.back) }));
}

export async function generateExam({ deck, lang = 'en', count = 5 }) {
  const sample = deck.cards.slice(0, 30).map(c => `Q: ${c.front}\nA: ${c.back}`).join('\n\n');
  const system = `You write fair, varied exam questions for students. Output STRICT JSON only — an array of objects with shape:
{"type": "mcq" | "short", "q": string, "choices": string[]?, "answer": string, "explanation": string}
"choices" only present for mcq (4 options, exactly one correct, "answer" must be the exact correct choice text). Language: ${langName[lang] || 'English'}.`;
  const user = `Deck name: ${deck.name}\nFlashcards:\n${sample}\n\nGenerate exactly ${count} questions: mostly MCQ, 1–2 short answer. Cover different cards.`;
  const resp = await call({ system, messages: [{ role: 'user', content: user }] });
  const text = extractText(resp);
  const arr = extractJSON(text);
  return arr.filter(q => q?.q && q?.answer);
}

export async function gradeShortAnswer({ question, answer, expected, lang = 'en' }) {
  const system = `You grade student short answers. Output STRICT JSON: {"correct": boolean, "explanation": string}. Be lenient on phrasing if meaning matches. Language: ${langName[lang] || 'English'}.`;
  const user = `Question: ${question}\nExpected: ${expected}\nStudent answer: ${answer}`;
  const resp = await call({ system, messages: [{ role: 'user', content: user }] });
  return extractJSON(extractText(resp));
}

export async function solveMathFromImage({ base64, mediaType = 'image/png', lang = 'en' }) {
  const system = `You are a friendly math tutor. Analyze the math problem in the image and solve it. Output in ${langName[lang] || 'English'}. Format your answer EXACTLY as:
PROBLEM: <restate the problem>
STEPS:
1. <step>
2. <step>
...
ANSWER: <final answer>
Keep steps short and clear. Use plain text math (no LaTeX).`;
  const resp = await call({
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
        { type: 'text', text: 'Solve this problem step by step.' }
      ]
    }],
    system,
    max_tokens: 1500
  });
  const text = extractText(resp);
  return parseMathSolution(text);
}

function parseMathSolution(text) {
  const problemMatch = text.match(/PROBLEM:\s*([\s\S]*?)(?=STEPS:|ANSWER:|$)/i);
  const stepsBlock = text.match(/STEPS:\s*([\s\S]*?)(?=ANSWER:|$)/i);
  const answerMatch = text.match(/ANSWER:\s*([\s\S]*?)$/i);
  const stepsRaw = stepsBlock ? stepsBlock[1].trim() : '';
  const steps = stepsRaw
    .split(/\n+/)
    .map(s => s.replace(/^\s*\d+[\.\)]\s*/, '').trim())
    .filter(Boolean);
  return {
    problem: problemMatch ? problemMatch[1].trim() : '',
    steps: steps.length ? steps : [text.trim()],
    answer: answerMatch ? answerMatch[1].trim() : '',
    raw: text
  };
}
