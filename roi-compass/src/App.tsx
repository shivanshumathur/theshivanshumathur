import { useMemo, useState } from "react";
import { CostInputForm } from "./components/roi-compass/CostInputForm";
import { JCurveChart } from "./components/roi-compass/JCurveChart";
import { MetricInputForm } from "./components/roi-compass/MetricInputForm";
import { MetricPresetPicker } from "./components/roi-compass/MetricPresetPicker";
import { ResultsSummary } from "./components/roi-compass/ResultsSummary";
import {
  calculateTotalMonthlyCost,
  calculateTotalMonthlyValue,
  runSimpleProjection,
} from "./lib/roi-compass/calculations";
import {
  DEFAULT_COST_INPUTS,
  PRODUCT_NAME,
  PRODUCT_TAGLINE,
} from "./lib/roi-compass/constants";
import { METRIC_PRESETS } from "./lib/roi-compass/presets/metrics";
import type { CostInputs, UXMetric } from "./lib/roi-compass/types";

export default function App() {
  const [costs, setCosts] = useState<CostInputs>({ ...DEFAULT_COST_INPUTS });
  const [metrics, setMetrics] = useState<UXMetric[]>(() => [
    METRIC_PRESETS[0]!.create(),
  ]);

  const result = useMemo(() => {
    if (metrics.length === 0) return null;
    return runSimpleProjection(costs, metrics);
  }, [costs, metrics]);

  const monthlyCost = calculateTotalMonthlyCost(costs);
  const monthlyValue = calculateTotalMonthlyValue(metrics);

  return (
    <div className="min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-3 border-b border-[var(--color-line)] pb-6">
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.14em] text-[var(--color-muted)] uppercase">
            AI Lab · Simple mode
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{PRODUCT_NAME}</h1>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
            {PRODUCT_TAGLINE}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="flex flex-col gap-8 rounded-2xl border border-[var(--color-line)] bg-white/70 p-5 backdrop-blur-sm sm:p-7">
            <CostInputForm value={costs} onChange={setCosts} />
            <MetricPresetPicker
              metrics={metrics}
              onAdd={(metric) => setMetrics((current) => [...current, metric])}
            />
            <MetricInputForm metrics={metrics} onChange={setMetrics} />
          </div>

          <div className="flex flex-col gap-6">
            <ResultsSummary
              result={result}
              hasMetrics={metrics.length > 0}
              monthlyCost={monthlyCost}
              monthlyValue={monthlyValue}
            />
            {result ? (
              <JCurveChart
                projections={result.monthlyProjections}
                paybackMonth={result.paybackMonth}
              />
            ) : null}
          </div>
        </div>

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
