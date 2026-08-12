import { CONTACT, DOCS, OFF_TOPIC } from './ask-corpus.js';

const REFUSE = {
  speak: "I only talk about Shivanshu's work. Ask about his background, case studies, or how to hire him.",
  show: "I stay on-topic: Shivanshu, his design work, and how to reach him.",
  action: null,
  refuse: true,
  cards: []
};

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9+.# ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isOffTopic(q) {
  return OFF_TOPIC.some((k) => q.includes(k));
}

function scoreDoc(q, doc) {
  let n = 0;
  let longest = 0;
  for (const k of doc.keys) {
    if (q.includes(k)) {
      n += k.length >= 8 ? 3 : k.length >= 4 ? 2 : 1;
      if (k.length > longest) longest = k.length;
    }
  }
  const words = q.split(' ').filter((w) => w.length > 3);
  const blob = (doc.text + ' ' + doc.id).toLowerCase();
  for (const w of words) {
    if (blob.includes(w)) n += 1;
  }
  return { n, longest };
}

export function retrieve(raw, limit = 3) {
  const q = norm(raw);
  if (!q) return { q, docs: [], refuse: false, greeting: 'empty' };
  if (isOffTopic(q)) return { q, docs: [], refuse: true };

  if (/\b(hi|hello|hey|yo)\b/.test(q) && q.split(' ').length < 4) {
    return { q, docs: [], refuse: false, greeting: 'hi' };
  }
  if (/\b(thanks|thank you|thx)\b/.test(q) && q.split(' ').length < 5) {
    return { q, docs: [], refuse: false, greeting: 'thanks' };
  }

  const ranked = DOCS
    .map((doc) => ({ doc, ...scoreDoc(q, doc) }))
    .filter((r) => r.n >= 2)
    .sort((a, b) => b.n - a.n || b.longest - a.longest);

  return { q, docs: ranked.slice(0, limit).map((r) => r.doc), refuse: false };
}

function cardsFrom(docs) {
  if (!docs.length || !docs[0].cards) return [];
  return docs[0].cards.slice(0, 3);
}

export function answerLocal(raw) {
  const hit = retrieve(raw);
  if (hit.refuse) return { ...REFUSE };
  if (hit.greeting === 'empty') {
    return {
      speak: "I'm listening. Ask about Shivanshu's work.",
      show: "Background, Forge, finance, process, or how to hire him.",
      action: null,
      refuse: false,
      cards: []
    };
  }
  if (hit.greeting === 'hi') {
    return {
      speak: "Hi. I can talk about Shivanshu's work, case studies, or how to reach him.",
      show: "Try: Who is he? · Forge · Book a call",
      action: null,
      refuse: false,
      cards: []
    };
  }
  if (hit.greeting === 'thanks') {
    return {
      speak: "Anytime. Want the Forge study, or a link to book time?",
      show: "Forge · Finance · Book a call",
      action: null,
      refuse: false,
      cards: []
    };
  }
  if (!hit.docs.length) {
    return {
      speak: "I don't have that detail. Ask about his background, Forge, the finance platform, or how to get in touch.",
      show: "Try his background, Forge, finance work, process, or booking a call.",
      action: null,
      refuse: false,
      cards: []
    };
  }
  const best = hit.docs[0];
  return {
    speak: best.speak,
    show: best.show,
    action: best.action || null,
    refuse: false,
    cards: cardsFrom(hit.docs)
  };
}

function llmProvider() {
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.GROQ_API_KEY) return 'groq';
  if (process.env.OPENAI_API_KEY) return 'openai';
  return null;
}

const SYSTEM = `You are Ask on Shivanshu Mathur's Personal OS.
Answer ONLY about Shivanshu and his professional work.
Use ONLY the provided context. If the answer is not in context, say you do not have that detail.
Never invent employers, dates, metrics, or titles.
speak: max 40 words, for voice, third person ("he").
show: one compact on-screen line.
Return JSON only: {"speak":"...","show":"..."}`;

async function llmSpeakShow(question, docs) {
  const provider = llmProvider();
  if (!provider) return null;
  const context = docs.map((d) => `### ${d.id}\n${d.text}`).join('\n\n');
  const user = `Question: ${question}\n\nContext:\n${context}`;

  if (provider === 'gemini') {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM }] },
          contents: [{ role: 'user', parts: [{ text: user }] }],
          generationConfig: { temperature: 0.3, responseMimeType: 'application/json' }
        })
      }
    );
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return parseJson(text);
  }

  const model = provider === 'groq'
    ? (process.env.GROQ_MODEL || 'llama-3.1-8b-instant')
    : (process.env.OPENAI_ASK_MODEL || 'gpt-4o-mini');
  const url = provider === 'groq'
    ? 'https://api.groq.com/openai/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
  const key = provider === 'groq' ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: user }
      ]
    })
  });
  const data = await res.json();
  return parseJson(data.choices?.[0]?.message?.content);
}

function parseJson(text) {
  if (!text) return null;
  try {
    const obj = JSON.parse(text);
    if (obj && obj.speak && obj.show) return { speak: String(obj.speak), show: String(obj.show) };
  } catch {
    /* ignore */
  }
  return null;
}

export async function answer(raw) {
  const local = answerLocal(raw);
  const hit = retrieve(raw);
  if (local.refuse || !hit.docs.length) return local;
  try {
    const generated = await llmSpeakShow(raw, hit.docs);
    if (generated) {
      return {
        ...local,
        speak: generated.speak,
        show: generated.show
      };
    }
  } catch {
    /* fall back to grounded local copy */
  }
  return local;
}

export function askReady() {
  return true;
}

export function llmReady() {
  return !!llmProvider();
}

export { CONTACT };
