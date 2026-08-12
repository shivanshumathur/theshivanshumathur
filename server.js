import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5173;
const root = path.join(__dirname, "src");

const app = express();
app.use(express.json({ limit: '8kb' }));

app.get("/api/speak", async (req, res) => {
  const { ttsReady } = await import("./lib/tts.js");
  res.setHeader("Cache-Control", "no-store");
  res.json({ ready: ttsReady() });
});

app.get("/api/ask", async (req, res) => {
  const { llmReady } = await import("./lib/ask-rag.js");
  res.setHeader("Cache-Control", "no-store");
  res.json({ ready: true, llm: llmReady() });
});

app.post("/api/ask", async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const { answer } = await import("./lib/ask-rag.js");
    const result = await answer((req.body && (req.body.message || req.body.text)) || "");
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || "Ask failed" });
  }
});

app.post("/api/speak", async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const { synthesize } = await import("./lib/tts.js");
    const { buffer, contentType } = await synthesize(req.body && req.body.text);
    res.setHeader("Content-Type", contentType);
    res.send(buffer);
  } catch (err) {
    const status = err.code === "NO_PROVIDER" ? 503 : 502;
    res.status(status).json({ error: err.message || "TTS failed" });
  }
});

// Required for AI Lab WebGL workers / SharedArrayBuffer
app.use((req, res, next) => {
  if (req.path.startsWith("/ai-lab")) {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    // Allow homepage (and other same-site pages) to fetch AI Lab assets
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  }
  next();
});

app.use(express.static(root, { index: "index.html", extensions: ["html"] }));

app.get(/^\/ai-lab(\/.*)?$/, (req, res, next) => {
  if (path.extname(req.path)) return next();
  res.sendFile(path.join(root, "ai-lab", "index.html"));
});

// Unknown routes — branded 404 with homepage CTA
app.use((req, res) => {
  res.status(404).sendFile(path.join(root, "404.html"));
});

app.listen(PORT, () => {
  console.log(`Dashboard: http://localhost:${PORT}/`);
  console.log(`AI Lab:    http://localhost:${PORT}/ai-lab/`);
});
