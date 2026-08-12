import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getChartPhaseBands } from "../../lib/roi-compass/jcurve";
import type { JCurveParams, MonthlyProjection } from "../../lib/roi-compass/types";

interface JCurveChartProps {
  projections: MonthlyProjection[];
  paybackMonth: number | null;
  jCurve: JCurveParams;
}

function formatAxisMoney(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${value < 0 ? "-" : ""}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${value < 0 ? "-" : ""}$${Math.round(abs / 1_000)}k`;
  return `$${Math.round(value)}`;
}

/** Ensure single-month bands still paint a visible width on the category axis. */
function areaX2(start: number, end: number): number {
  return end <= start ? start + 0.85 : end;
}

export function JCurveChart({ projections, paybackMonth, jCurve }: JCurveChartProps) {
  if (projections.length === 0) {
    return null;
  }

  const bands = getChartPhaseBands(projections, jCurve);

  return (
    <section className="rounded-2xl border border-[var(--color-line)] bg-white/80 p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-medium tracking-tight">J-curve payback timeline</h2>
          <p className="text-sm text-[var(--color-muted)]">
            Cumulative net value — underwater until upfront cost and adoption dip are recovered.
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

      <div className="mb-3 flex flex-wrap gap-3 text-xs text-[var(--color-muted)]">
        <LegendSwatch color="rgba(37, 99, 235, 0.2)" label="Dip (below $0)" />
        <LegendSwatch color="rgba(37, 99, 235, 0.32)" label="Ramp" />
        <LegendSwatch color="rgba(10, 10, 10, 0.08)" label="Compounding" />
      </div>

      <div className="h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={projections} margin={{ top: 16, right: 12, left: 4, bottom: 0 }}>
            {bands.dip ? (
              <ReferenceArea
                x1={bands.dip.start}
                x2={areaX2(bands.dip.start, bands.dip.end)}
                fill="rgba(37, 99, 235, 0.2)"
                strokeOpacity={0}
                ifOverflow="extendDomain"
                label={{ value: "Dip", position: "insideTopLeft", fill: "#525252", fontSize: 11 }}
              />
            ) : null}
            {bands.ramp ? (
              <ReferenceArea
                x1={bands.ramp.start}
                x2={areaX2(bands.ramp.start, bands.ramp.end)}
                fill="rgba(37, 99, 235, 0.32)"
                strokeOpacity={0}
                ifOverflow="extendDomain"
                label={{ value: "Ramp", position: "insideTopLeft", fill: "#525252", fontSize: 11 }}
              />
            ) : null}
            {bands.compound ? (
              <ReferenceArea
                x1={bands.compound.start}
                x2={areaX2(bands.compound.start, bands.compound.end)}
                fill="rgba(10, 10, 10, 0.08)"
                strokeOpacity={0}
                ifOverflow="extendDomain"
                label={{
                  value: "Compounding",
                  position: "insideTopLeft",
                  fill: "#525252",
                  fontSize: 11,
                }}
              />
            ) : null}

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
              type="monotone"
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

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
