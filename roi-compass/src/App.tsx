import { PRODUCT_NAME, PRODUCT_TAGLINE } from "./lib/roi-compass/constants";

export default function App() {
  return (
    <div className="min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-3 border-b border-[var(--color-line)] pb-6">
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.14em] text-[var(--color-muted)] uppercase">
            AI Lab · Phase 0 scaffold
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{PRODUCT_NAME}</h1>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
            {PRODUCT_TAGLINE}
          </p>
        </header>

        <section className="rounded-2xl border border-[var(--color-line)] bg-white/70 p-6 backdrop-blur-sm sm:p-8">
          <h2 className="text-lg font-medium tracking-tight">Calculator coming online</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
            Folder structure, types, and test runner are in place. Phase 1 will wire cost inputs,
            UX metric presets, and a linear payback timeline.
          </p>
          <ul className="mt-5 space-y-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)] sm:text-sm">
            <li>· types.ts — cost, metric, J-curve, and ROI models</li>
            <li>· constants.ts — named projection assumptions</li>
            <li>· components/roi-compass — placeholder exports for Phases 1–5</li>
            <li>· Vitest smoke test green</li>
          </ul>
        </section>

        <footer className="text-sm text-[var(--color-muted)]">
          <a
            href="/"
            className="text-[var(--color-accent)] underline-offset-4 hover:underline"
          >
            ← Back to portfolio
          </a>
        </footer>
      </div>
    </div>
  );
}
