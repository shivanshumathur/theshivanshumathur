import { PROJECTION_WINDOW_MONTHS } from "../../lib/roi-compass/constants";
import type {
  AdvancedROIResult,
  CalculatorMode,
  JCurveParams,
  ROIResult,
} from "../../lib/roi-compass/types";

interface ResultsSummaryProps {
  mode: CalculatorMode;
  result: ROIResult | null;
  advancedResult: AdvancedROIResult | null;
  hasMetrics: boolean;
  monthlyCost: number;
  monthlyValue: number;
  jCurve: JCurveParams;
  linearPaybackMonth: number | null;
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMonth(month: number | null): string {
  if (month === null) return `>${PROJECTION_WINDOW_MONTHS}`;
  return String(month);
}

export function ResultsSummary({
  mode,
  result,
  advancedResult,
  hasMetrics,
  monthlyCost,
  monthlyValue,
  jCurve,
  linearPaybackMonth,
}: ResultsSummaryProps) {
  if (!hasMetrics) {
    return (
      <section className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white/50 p-6">
        <h2 className="text-lg font-medium tracking-tight">Results</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Add at least one metric to see payback timing.
        </p>
      </section>
    );
  }

  if (mode === "advanced" && advancedResult) {
    return (
      <AdvancedSummary
        advancedResult={advancedResult}
        monthlyCost={monthlyCost}
        monthlyValue={monthlyValue}
      />
    );
  }

  if (!result) {
    return null;
  }

  const headline =
    result.paybackMonth === null
      ? `Does not pay back within ${PROJECTION_WINDOW_MONTHS} months`
      : result.paybackMonth === 1
        ? "Pays back in month 1"
        : `Pays back in month ${result.paybackMonth}`;

  const dipLabel =
    jCurve.dipDurationMonths === 1
      ? "1-month adoption dip"
      : `${jCurve.dipDurationMonths}-month adoption dip`;

  const delayedVsLinear =
    linearPaybackMonth !== null &&
    result.paybackMonth !== null &&
    result.paybackMonth > linearPaybackMonth;

  return (
    <section className="rounded-2xl border border-[var(--color-line)] bg-white/80 p-6 sm:p-7">
      <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.14em] text-[var(--color-muted)] uppercase">
        Simple mode · J-curve projection
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{headline}</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--color-muted)]">
        Includes a {dipLabel}
        {jCurve.dipSeverity > 0
          ? ` (${Math.round(jCurve.dipSeverity * 100)}% value reduction while teams learn and verify)`
          : ""}
        .
        {delayedVsLinear
          ? ` A naive linear model would have said month ${linearPaybackMonth}.`
          : ""}
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
            Monthly cost (full)
          </dt>
          <dd className="mt-1 text-xl font-medium">{formatMoney(monthlyCost)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
            Steady-state monthly value
          </dt>
          <dd className="mt-1 text-xl font-medium">{formatMoney(monthlyValue)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
            Total cost ({PROJECTION_WINDOW_MONTHS} mo)
          </dt>
          <dd className="mt-1 text-xl font-medium">{formatMoney(result.totalCostOverWindow)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
            Total value ({PROJECTION_WINDOW_MONTHS} mo, curve-adjusted)
          </dt>
          <dd className="mt-1 text-xl font-medium">{formatMoney(result.totalValueOverWindow)}</dd>
        </div>
      </dl>
    </section>
  );
}

function AdvancedSummary({
  advancedResult,
  monthlyCost,
  monthlyValue,
}: {
  advancedResult: AdvancedROIResult;
  monthlyCost: number;
  monthlyValue: number;
}) {
  const { best, likely, worst } = advancedResult;
  const ranks = [best.paybackMonth, likely.paybackMonth, worst.paybackMonth];
  const finite = ranks.filter((month): month is number => month !== null);

  let headline: string;
  if (finite.length === 0) {
    headline = `Does not pay back within ${PROJECTION_WINDOW_MONTHS} months in any scenario`;
  } else {
    const low = Math.min(...finite);
    const high =
      worst.paybackMonth === null
        ? `>${PROJECTION_WINDOW_MONTHS}`
        : String(Math.max(...finite));
    const likelyLabel = formatMonth(likely.paybackMonth);
    headline =
      low === Number(high)
        ? `Payback: month ${low} across scenarios`
        : `Payback: ${low}–${high} months, most likely month ${likelyLabel}`;
  }

  return (
    <section className="rounded-2xl border border-[var(--color-line)] bg-white/80 p-6 sm:p-7">
      <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.14em] text-[var(--color-muted)] uppercase">
        Advanced mode · scenario bands
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{headline}</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--color-muted)]">
        Range reflects best / likely / worst adoption and J-curve assumptions — not false
        precision on a single number.
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wide text-[#0f766e]">Best</dt>
          <dd className="mt-1 text-xl font-medium">Month {formatMonth(best.paybackMonth)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--color-accent)]">Likely</dt>
          <dd className="mt-1 text-xl font-medium">Month {formatMonth(likely.paybackMonth)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[#b45309]">Worst</dt>
          <dd className="mt-1 text-xl font-medium">Month {formatMonth(worst.paybackMonth)}</dd>
        </div>
      </dl>

      <dl className="mt-6 grid gap-4 border-t border-[var(--color-line)] pt-5 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
            Monthly cost (full seats)
          </dt>
          <dd className="mt-1 text-lg font-medium">{formatMoney(monthlyCost)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
            Full-adoption monthly value
          </dt>
          <dd className="mt-1 text-lg font-medium">{formatMoney(monthlyValue)}</dd>
        </div>
      </dl>
    </section>
  );
}
