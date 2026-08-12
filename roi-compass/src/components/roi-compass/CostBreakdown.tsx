import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { breakDownMonthlyCosts } from "../../lib/roi-compass/hiddenCosts";
import type { CostInputs } from "../../lib/roi-compass/types";

const SLICE_META = [
  { key: "seat" as const, label: "Seat licenses", color: "#2563eb" },
  { key: "usage" as const, label: "Usage / tokens", color: "#0f766e" },
  { key: "infra" as const, label: "Hidden infra", color: "#64748b" },
  { key: "verification" as const, label: "Verification time", color: "#b45309" },
];

interface CostBreakdownProps {
  costs: CostInputs;
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function CostBreakdown({ costs }: CostBreakdownProps) {
  const breakdown = breakDownMonthlyCosts(costs);
  const data = SLICE_META.map((slice) => ({
    ...slice,
    value: breakdown[slice.key],
  })).filter((slice) => slice.value > 0);

  if (breakdown.total <= 0) {
    return null;
  }

  const hiddenShare =
    breakdown.total > 0
      ? ((breakdown.usage + breakdown.infra + breakdown.verification) / breakdown.total) * 100
      : 0;

  return (
    <section className="rounded-2xl border border-[var(--color-line)] bg-white/80 p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-medium tracking-tight">Monthly cost breakdown</h2>
          <p className="text-sm text-[var(--color-muted)]">
            {hiddenShare >= 50
              ? `${Math.round(hiddenShare)}% of spend is outside seat price — the hidden layer.`
              : "Seat price plus usage, infra, and verification time."}
          </p>
        </div>
        <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
          Total {formatMoney(breakdown.total)}/mo
        </p>
      </div>

      <div className="grid items-center gap-6 sm:grid-cols-[180px_minmax(0,1fr)]">
        <div className="mx-auto h-44 w-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={2}
                stroke="none"
                isAnimationActive={false}
              >
                {data.map((slice) => (
                  <Cell key={slice.key} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [formatMoney(value), name]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(10,10,10,0.12)",
                  fontSize: 13,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="flex flex-col gap-2.5 text-sm">
          {SLICE_META.map((slice) => {
            const amount = breakdown[slice.key];
            const share = breakdown.total > 0 ? (amount / breakdown.total) * 100 : 0;
            return (
              <li key={slice.key} className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span
                    className={
                      slice.key === "verification" ? "font-medium text-[#b45309]" : undefined
                    }
                  >
                    {slice.label}
                  </span>
                </span>
                <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
                  {formatMoney(amount)} · {Math.round(share)}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
