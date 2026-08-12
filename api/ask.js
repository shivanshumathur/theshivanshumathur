import { answer, llmReady } from '../lib/ask-rag.js';

const hits = new Map();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_HOUR = 40;

function clientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string' && xf) return xf.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function limited(ip) {
  const now = Date.now();
  const row = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (row.length >= MAX_PER_HOUR) {
    hits.set(ip, row);
    return true;
  }
  row.push(now);
  hits.set(ip, row);
  return false;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    res.status(200).json({ ready: true, llm: llmReady() });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (limited(clientIp(req))) {
    res.status(429).json({ error: 'Too many requests' });
    return;
  }

  const text = typeof req.body === 'string'
    ? req.body
    : (req.body && (req.body.message || req.body.text)) || '';

  try {
    const result = await answer(text);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Ask failed' });
  }
}
