import { PROJECTION_WINDOW_MONTHS } from "../../lib/roi-compass/constants";
import type { ROIResult } from "../../lib/roi-compass/types";

interface ResultsSummaryProps {
  result: ROIResult | null;
  hasMetrics: boolean;
  monthlyCost: number;
  monthlyValue: number;
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ResultsSummary({
  result,
  hasMetrics,
  monthlyCost,
  monthlyValue,
}: ResultsSummaryProps) {
  if (!hasMetrics || !result) {
    return (
      <section className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white/50 p-6">
        <h2 className="text-lg font-medium tracking-tight">Results</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Add at least one metric to see payback timing.
        </p>
      </section>
    );
  }

  const headline =
    result.paybackMonth === null
      ? `Does not pay back within ${PROJECTION_WINDOW_MONTHS} months`
      : result.paybackMonth === 1
        ? "Pays back in month 1"
        : `Pays back in month ${result.paybackMonth}`;

  return (
    <section className="rounded-2xl border border-[var(--color-line)] bg-white/80 p-6 sm:p-7">
      <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.14em] text-[var(--color-muted)] uppercase">
        Simple mode · linear projection
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{headline}</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--color-muted)]">
        Assumes value accrues evenly from month one — no adoption dip yet. Phase 2 adds the J-curve.
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
            Monthly cost
          </dt>
          <dd className="mt-1 text-xl font-medium">{formatMoney(monthlyCost)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
            Monthly value
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
            Total value ({PROJECTION_WINDOW_MONTHS} mo)
          </dt>
          <dd className="mt-1 text-xl font-medium">{formatMoney(result.totalValueOverWindow)}</dd>
        </div>
      </dl>
    </section>
  );
}
