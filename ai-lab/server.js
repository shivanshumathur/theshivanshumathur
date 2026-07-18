import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const PORT = process.env.PORT || 3000;
const TARGET = "https://www.igloo.inc";

const app = express();

app.use(
  "/",
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    secure: true,
    ws: true,
    onProxyRes(proxyRes) {
      delete proxyRes.headers["content-security-policy"];
      delete proxyRes.headers["x-frame-options"];
    },
  })
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`\nIgloo Inc. (exact copy) running at:`);
  console.log(`  http://localhost:${PORT}/\n`);
  console.log(`Proxying live site from ${TARGET}`);
});
