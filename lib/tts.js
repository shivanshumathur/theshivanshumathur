const MAX_CHARS = 480;
const cache = new Map();
const CACHE_MAX = 40;

function normalize(text) {
  return String(text || '').replace(/\s+/g, ' ').trim().slice(0, MAX_CHARS);
}

function cacheGet(key) {
  return cache.get(key) || null;
}

function cacheSet(key, value) {
  if (cache.size >= CACHE_MAX) {
    const first = cache.keys().next().value;
    cache.delete(first);
  }
  cache.set(key, value);
}

function detectProvider() {
  const forced = (process.env.TTS_PROVIDER || '').toLowerCase();
  if (forced) return forced;
  if (process.env.GOOGLE_TTS_API_KEY) return 'google';
  if (process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION) return 'azure';
  if (process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID) return 'elevenlabs';
  if (process.env.OPENAI_API_KEY) return 'openai';
  return null;
}

export function ttsReady() {
  return !!detectProvider();
}

async function googleSpeak(text) {
  const key = process.env.GOOGLE_TTS_API_KEY;
  const voice = process.env.GOOGLE_TTS_VOICE || 'en-IN-Neural2-A';
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(key)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: 'en-IN', name: voice, ssmlGender: 'FEMALE' },
        audioConfig: { audioEncoding: 'MP3', speakingRate: 1.02 }
      })
    }
  );
  const data = await res.json();
  if (!res.ok || !data.audioContent) {
    throw new Error(data.error?.message || 'Google TTS failed');
  }
  return Buffer.from(data.audioContent, 'base64');
}

async function azureSpeak(text) {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  const voice = process.env.AZURE_TTS_VOICE || 'en-IN-NeerjaNeural';
  const ssml = `<speak version="1.0" xml:lang="en-IN"><voice name="${voice}">${escapeXml(text)}</voice></speak>`;
  const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3'
    },
    body: ssml
  });
  if (!res.ok) throw new Error('Azure TTS failed');
  return Buffer.from(await res.arrayBuffer());
}

async function elevenSpeak(text) {
  const key = process.env.ELEVENLABS_API_KEY;
  const voice = process.env.ELEVENLABS_VOICE_ID;
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
    method: 'POST',
    headers: {
      'xi-api-key': key,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg'
    },
    body: JSON.stringify({
      text,
      model_id: process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2'
    })
  });
  if (!res.ok) throw new Error('ElevenLabs TTS failed');
  return Buffer.from(await res.arrayBuffer());
}

async function openaiSpeak(text) {
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TTS_MODEL || 'tts-1-hd',
      voice: process.env.OPENAI_TTS_VOICE || 'nova',
      input: text
    })
  });
  if (!res.ok) throw new Error('OpenAI TTS failed');
  return Buffer.from(await res.arrayBuffer());
}

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function synthesize(rawText) {
  const text = normalize(rawText);
  if (!text) throw new Error('Empty text');
  const provider = detectProvider();
  if (!provider) {
    const err = new Error('No TTS provider configured');
    err.code = 'NO_PROVIDER';
    throw err;
  }
  const cacheKey = provider + ':' + text;
  const hit = cacheGet(cacheKey);
  if (hit) return hit;

  let buffer;
  if (provider === 'google') buffer = await googleSpeak(text);
  else if (provider === 'azure') buffer = await azureSpeak(text);
  else if (provider === 'elevenlabs') buffer = await elevenSpeak(text);
  else if (provider === 'openai') buffer = await openaiSpeak(text);
  else {
    const err = new Error('Unknown TTS provider');
    err.code = 'NO_PROVIDER';
    throw err;
  }

  const result = { buffer, contentType: 'audio/mpeg', provider };
  cacheSet(cacheKey, result);
  return result;
}
