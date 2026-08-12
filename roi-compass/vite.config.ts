import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const base = "/ai-lab/roi-compass/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5174,
    strictPort: true,
  },
  build: {
    outDir: fileURLToPath(new URL("../src/ai-lab/roi-compass", import.meta.url)),
    emptyOutDir: true,
  },
  test: {
    environment: "node",
    include: ["src/lib/roi-compass/__tests__/**/*.test.ts"],
  },
});
