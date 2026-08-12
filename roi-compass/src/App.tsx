import { useMemo, useState } from "react";
import { CostInputForm } from "./components/roi-compass/CostInputForm";
import { JCurveChart } from "./components/roi-compass/JCurveChart";
import { JCurveControls } from "./components/roi-compass/JCurveControls";
import { MetricInputForm } from "./components/roi-compass/MetricInputForm";
import { MetricPresetPicker } from "./components/roi-compass/MetricPresetPicker";
import { ModeToggle } from "./components/roi-compass/ModeToggle";
import { ResultsSummary } from "./components/roi-compass/ResultsSummary";
import { ScenarioComparison } from "./components/roi-compass/ScenarioComparison";
import {
  calculateTotalMonthlyCost,
  calculateTotalMonthlyValue,
  runJCurveProjection,
  runSimpleProjection,
} from "./lib/roi-compass/calculations";
import {
  DEFAULT_COST_INPUTS,
  DEFAULT_JCURVE,
  PRODUCT_NAME,
  PRODUCT_TAGLINE,
} from "./lib/roi-compass/constants";
import { METRIC_PRESETS } from "./lib/roi-compass/presets/metrics";
import {
  cloneScenarioPresets,
  runAdvancedProjection,
} from "./lib/roi-compass/scenarios";
import type {
  CalculatorMode,
  CostInputs,
  JCurveParams,
  ScenarioAssumptions,
  ScenarioType,
  UXMetric,
} from "./lib/roi-compass/types";

export default function App() {
  const [mode, setMode] = useState<CalculatorMode>("simple");
  const [costs, setCosts] = useState<CostInputs>({ ...DEFAULT_COST_INPUTS });
  const [metrics, setMetrics] = useState<UXMetric[]>(() => [
    METRIC_PRESETS[1]!.create(),
  ]);
  const [jCurve, setJCurve] = useState<JCurveParams>({ ...DEFAULT_JCURVE });
  const [scenarios, setScenarios] = useState(() => cloneScenarioPresets());

  const simpleResult = useMemo(() => {
    if (metrics.length === 0) return null;
    return runJCurveProjection(costs, metrics, jCurve);
  }, [costs, metrics, jCurve]);

  const advancedResult = useMemo(() => {
    if (metrics.length === 0) return null;
    return runAdvancedProjection(costs, metrics, scenarios);
  }, [costs, metrics, scenarios]);

  const linearPaybackMonth = useMemo(() => {
    if (metrics.length === 0) return null;
    return runSimpleProjection(costs, metrics).paybackMonth;
  }, [costs, metrics]);

  const monthlyCost = calculateTotalMonthlyCost(costs);
  const monthlyValue = calculateTotalMonthlyValue(metrics);

  function updateScenario(type: ScenarioType, next: ScenarioAssumptions) {
    setScenarios((current) => ({ ...current, [type]: next }));
  }

  return (
    <div className="min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-[var(--color-line)] pb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.14em] text-[var(--color-muted)] uppercase">
              AI Lab · ROI Compass
            </p>
            <ModeToggle mode={mode} onChange={setMode} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{PRODUCT_NAME}</h1>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
            {PRODUCT_TAGLINE}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="flex flex-col gap-8 rounded-2xl border border-[var(--color-line)] bg-white/70 p-5 backdrop-blur-sm sm:p-7">
            <CostInputForm value={costs} onChange={setCosts} />
            {mode === "simple" ? (
              <JCurveControls value={jCurve} onChange={setJCurve} />
            ) : (
              <p className="rounded-xl border border-dashed border-[var(--color-line)] px-4 py-3 text-sm text-[var(--color-muted)]">
                Advanced mode uses best / likely / worst scenario assumptions — edit them beside
                the chart. Cost and metrics stay shared when you toggle modes.
              </p>
            )}
            <MetricPresetPicker
              metrics={metrics}
              onAdd={(metric) => setMetrics((current) => [...current, metric])}
            />
            <MetricInputForm metrics={metrics} onChange={setMetrics} />
          </div>

          <div className="flex flex-col gap-6">
            <ResultsSummary
              mode={mode}
              result={simpleResult}
              advancedResult={advancedResult}
              hasMetrics={metrics.length > 0}
              monthlyCost={monthlyCost}
              monthlyValue={monthlyValue}
              jCurve={jCurve}
              linearPaybackMonth={linearPaybackMonth}
            />

            {mode === "simple" && simpleResult ? (
              <JCurveChart
                projections={simpleResult.monthlyProjections}
                paybackMonth={simpleResult.paybackMonth}
                jCurve={jCurve}
              />
            ) : null}

            {mode === "advanced" && advancedResult ? (
              <ScenarioComparison
                result={advancedResult}
                scenarios={scenarios}
                onChangeScenario={updateScenario}
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
