import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5173;
const root = path.join(__dirname, "src");

const app = express();

// Required for AI Lab WebGL workers / SharedArrayBuffer
app.use((req, res, next) => {
  if (req.path.startsWith("/ai-lab")) {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  }
  next();
});

app.use(express.static(root, { index: "index.html", extensions: ["html"] }));

app.get(/^\/ai-lab(\/.*)?$/, (req, res, next) => {
  if (path.extname(req.path)) return next();
  res.sendFile(path.join(root, "ai-lab", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Dashboard: http://localhost:${PORT}/`);
  console.log(`AI Lab:    http://localhost:${PORT}/ai-lab/`);
});
