import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyProjection } from "../../lib/roi-compass/types";

interface JCurveChartProps {
  projections: MonthlyProjection[];
  paybackMonth: number | null;
}

function formatAxisMoney(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${value < 0 ? "-" : ""}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${value < 0 ? "-" : ""}$${Math.round(abs / 1_000)}k`;
  return `$${Math.round(value)}`;
}

export function JCurveChart({ projections, paybackMonth }: JCurveChartProps) {
  if (projections.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-[var(--color-line)] bg-white/80 p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-medium tracking-tight">Cumulative net value</h2>
          <p className="text-sm text-[var(--color-muted)]">
            Linear timeline — straight line until the J-curve engine lands in Phase 2.
          </p>
        </div>
        {paybackMonth !== null ? (
          <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-accent)]">
            Payback @ month {paybackMonth}
          </p>
        ) : (
          <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
            No payback in window
          </p>
        )}
      </div>

      <div className="h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={projections} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
            <CartesianGrid stroke="rgba(10,10,10,0.08)" strokeDasharray="4 4" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#525252", fontSize: 12 }}
              label={{ value: "Month", position: "insideBottom", offset: -2, fill: "#525252" }}
            />
            <YAxis
              tickFormatter={formatAxisMoney}
              tickLine={false}
              axisLine={false}
              width={56}
              tick={{ fill: "#525252", fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number) => [
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(value),
                "Cumulative net",
              ]}
              labelFormatter={(month) => `Month ${month}`}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid rgba(10,10,10,0.12)",
                fontSize: 13,
              }}
            />
            <ReferenceLine y={0} stroke="rgba(10,10,10,0.35)" strokeDasharray="3 3" />
            {paybackMonth !== null ? (
              <ReferenceLine
                x={paybackMonth}
                stroke="#2563eb"
                strokeDasharray="4 4"
                label={{
                  value: "Payback",
                  fill: "#2563eb",
                  fontSize: 11,
                  position: "insideTopRight",
                }}
              />
            ) : null}
            <Line
              type="linear"
              dataKey="cumulativeNetValue"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
