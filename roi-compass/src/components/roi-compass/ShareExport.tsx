import { CostBreakdown } from "./CostBreakdown";
import { JCurveChart } from "./JCurveChart";
import { ResultsSummary } from "./ResultsSummary";
import { ScenarioComparison } from "./ScenarioComparison";
import { PRODUCT_NAME } from "../../lib/roi-compass/constants";
import type {
  AdvancedROIResult,
  CalculatorMode,
  CostInputs,
  JCurveParams,
  ROIResult,
  ScenarioAssumptions,
  ScenarioType,
  UXMetric,
} from "../../lib/roi-compass/types";

interface ShareExportProps {
  mode: CalculatorMode;
  costs: CostInputs;
  metrics: UXMetric[];
  jCurve: JCurveParams;
  scenarios: Record<ScenarioType, ScenarioAssumptions>;
  simpleResult: ROIResult | null;
  advancedResult: AdvancedROIResult | null;
  monthlyCost: number;
  monthlyValue: number;
  linearPaybackMonth: number | null;
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ShareExport({
  mode,
  costs,
  metrics,
  jCurve,
  scenarios,
  simpleResult,
  advancedResult,
  monthlyCost,
  monthlyValue,
  linearPaybackMonth,
}: ShareExportProps) {
  return (
    <article className="share-export mx-auto flex w-full max-w-4xl flex-col gap-8 print:max-w-none">
      <header className="border-b border-[var(--color-line)] pb-6">
        <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.14em] text-[var(--color-muted)] uppercase">
          AI ROI Compass · Stakeholder summary
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{PRODUCT_NAME}</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          {mode === "advanced" ? "Advanced scenario bands" : "Simple J-curve projection"} ·
          generated for review — no interactive controls.
        </p>
      </header>

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

      <section className="rounded-2xl border border-[var(--color-line)] bg-white/80 p-5 sm:p-6">
        <h2 className="text-lg font-medium tracking-tight">Inputs used</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
              Cost
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>
                {costs.seatCount} seats × {formatMoney(costs.costPerSeatPerMonth)}/seat
              </li>
              {costs.usageBasedCostPerMonth !== undefined ? (
                <li>Usage / tokens: {formatMoney(costs.usageBasedCostPerMonth)}/mo</li>
              ) : null}
              {costs.hiddenInfraCostPerMonth !== undefined ? (
                <li>Hidden infra: {formatMoney(costs.hiddenInfraCostPerMonth)}/mo</li>
              ) : null}
              {costs.verificationHoursPerWeekPerSeat !== undefined ? (
                <li>
                  Verification: {costs.verificationHoursPerWeekPerSeat} hrs/week/seat @{" "}
                  {formatMoney(costs.fullyLoadedHourlyRate ?? 0)}/hr
                </li>
              ) : null}
              <li className="font-medium">Total monthly cost: {formatMoney(monthlyCost)}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
              Value metrics
            </h3>
            {metrics.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--color-muted)]">None selected.</p>
            ) : (
              <ul className="mt-2 space-y-1.5 text-sm">
                {metrics.map((metric) => (
                  <li key={metric.id}>
                    <span className="font-medium">{metric.label}</span>
                    <span className="text-[var(--color-muted)]">
                      {" "}
                      · {metric.baselineValue} → {metric.projectedValue} ({metric.unit})
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {mode === "simple" ? (
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            J-curve: {jCurve.dipDurationMonths}-mo dip at {Math.round(jCurve.dipSeverity * 100)}%
            severity, {jCurve.rampDurationMonths}-mo ramp, {jCurve.steadyStateMultiplier}× steady
            state.
          </p>
        ) : null}
      </section>

      <CostBreakdown costs={costs} />

      {mode === "simple" && simpleResult ? (
        <JCurveChart
          projections={simpleResult.monthlyProjections}
          paybackMonth={simpleResult.paybackMonth}
          jCurve={jCurve}
        />
      ) : null}

      {mode === "advanced" && advancedResult ? (
        <ScenarioComparison result={advancedResult} scenarios={scenarios} readOnly />
      ) : null}

      <footer className="border-t border-[var(--color-line)] pt-4 text-xs text-[var(--color-muted)]">
        Methodology: net monthly value = UX metric dollar conversions − full monthly AI cost,
        adjusted by an adoption J-curve. Advanced mode reports a best / likely / worst range.
      </footer>
    </article>
  );
}
