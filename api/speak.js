import { synthesize, ttsReady } from '../lib/tts.js';

const hits = new Map();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_HOUR = 20;

function clientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string' && xf) return xf.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function limited(ip) {
  const now = Date.now();
  const row = hits.get(ip) || [];
  const recent = row.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_HOUR) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    res.status(200).json({ ready: ttsReady() });
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
    : (req.body && req.body.text) || '';

  try {
    const { buffer, contentType } = await synthesize(text);
    res.setHeader('Content-Type', contentType);
    res.status(200).send(buffer);
  } catch (err) {
    const status = err.code === 'NO_PROVIDER' ? 503 : 502;
    res.status(status).json({ error: err.message || 'TTS failed' });
  }
}
