import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PROJECTION_WINDOW_MONTHS } from "../../lib/roi-compass/constants";
import type {
  AdvancedROIResult,
  ScenarioAssumptions,
  ScenarioType,
} from "../../lib/roi-compass/types";

const SCENARIO_META: Record<
  ScenarioType,
  { label: string; color: string; short: string }
> = {
  best: { label: "Best", color: "#0f766e", short: "best" },
  likely: { label: "Likely", color: "#2563eb", short: "likely" },
  worst: { label: "Worst", color: "#b45309", short: "worst" },
};

const SCENARIO_ORDER: ScenarioType[] = ["best", "likely", "worst"];

interface ScenarioComparisonProps {
  result: AdvancedROIResult;
  scenarios: Record<ScenarioType, ScenarioAssumptions>;
  onChangeScenario?: (type: ScenarioType, next: ScenarioAssumptions) => void;
  /** When true, hide editable assumption controls (export / print view). */
  readOnly?: boolean;
}

function formatAxisMoney(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${value < 0 ? "-" : ""}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${value < 0 ? "-" : ""}$${Math.round(abs / 1_000)}k`;
  return `$${Math.round(value)}`;
}

function formatPayback(month: number | null): string {
  if (month === null) return `>${PROJECTION_WINDOW_MONTHS} mo`;
  return `Month ${month}`;
}

export function ScenarioComparison({
  result,
  scenarios,
  onChangeScenario,
  readOnly = false,
}: ScenarioComparisonProps) {
  const chartData = Array.from({ length: PROJECTION_WINDOW_MONTHS }, (_, index) => {
    const month = index + 1;
    return {
      month,
      best: result.best.monthlyProjections[index]?.cumulativeNetValue ?? 0,
      likely: result.likely.monthlyProjections[index]?.cumulativeNetValue ?? 0,
      worst: result.worst.monthlyProjections[index]?.cumulativeNetValue ?? 0,
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-[var(--color-line)] bg-white/80 p-4 sm:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium tracking-tight">Scenario bands</h2>
          <p className="text-sm text-[var(--color-muted)]">
            Best, likely, and worst adoption paths on the same timeline.
          </p>
        </div>

        <div className="h-72 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
              <CartesianGrid stroke="rgba(10,10,10,0.08)" strokeDasharray="4 4" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#525252", fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatAxisMoney}
                tickLine={false}
                axisLine={false}
                width={56}
                tick={{ fill: "#525252", fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(value),
                  SCENARIO_META[name as ScenarioType]?.label ?? name,
                ]}
                labelFormatter={(month) => `Month ${month}`}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(10,10,10,0.12)",
                  fontSize: 13,
                }}
              />
              <Legend
                formatter={(value) => SCENARIO_META[value as ScenarioType]?.label ?? value}
              />
              <ReferenceLine y={0} stroke="rgba(10,10,10,0.35)" strokeDasharray="3 3" />
              {SCENARIO_ORDER.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={key}
                  stroke={SCENARIO_META[key].color}
                  strokeWidth={key === "likely" ? 2.75 : 2}
                  strokeDasharray={key === "worst" ? "6 4" : undefined}
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white/80">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-line)] bg-[var(--color-surface)]/60 text-xs uppercase tracking-wide text-[var(--color-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Scenario</th>
              <th className="px-4 py-3 font-medium">Payback</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Adoption</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Dip severity</th>
            </tr>
          </thead>
          <tbody>
            {SCENARIO_ORDER.map((type) => (
              <tr key={type} className="border-b border-[var(--color-line)] last:border-0">
                <td className="px-4 py-3 font-medium" style={{ color: SCENARIO_META[type].color }}>
                  {SCENARIO_META[type].label}
                </td>
                <td className="px-4 py-3">{formatPayback(result[type].paybackMonth)}</td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  {Math.round(scenarios[type].adoptionRate * 100)}%
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  {Math.round(scenarios[type].jCurve.dipSeverity * 100)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {!readOnly && onChangeScenario ? (
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-medium tracking-tight">Scenario assumptions</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Edit one band at a time — the other two stay as-is.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {SCENARIO_ORDER.map((type) => (
              <ScenarioEditor
                key={type}
                type={type}
                value={scenarios[type]}
                onChange={(next) => onChangeScenario(type, next)}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ScenarioEditor({
  type,
  value,
  onChange,
}: {
  type: ScenarioType;
  value: ScenarioAssumptions;
  onChange: (next: ScenarioAssumptions) => void;
}) {
  const meta = SCENARIO_META[type];

  return (
    <article className="rounded-2xl border border-[var(--color-line)] bg-white/80 p-4">
      <h3 className="text-sm font-semibold" style={{ color: meta.color }}>
        {meta.label}
      </h3>

      <label className="mt-3 flex flex-col gap-1.5 text-xs">
        <span className="flex justify-between text-[var(--color-muted)]">
          Adoption
          <span className="font-[family-name:var(--font-mono)]">
            {Math.round(value.adoptionRate * 100)}%
          </span>
        </span>
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.05}
          value={value.adoptionRate}
          onChange={(event) =>
            onChange({ ...value, adoptionRate: Number(event.target.value) })
          }
          className="accent-[var(--color-accent)]"
        />
      </label>

      <label className="mt-3 flex flex-col gap-1.5 text-xs">
        <span className="flex justify-between text-[var(--color-muted)]">
          Dip severity
          <span className="font-[family-name:var(--font-mono)]">
            {Math.round(value.jCurve.dipSeverity * 100)}%
          </span>
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={value.jCurve.dipSeverity}
          onChange={(event) =>
            onChange({
              ...value,
              jCurve: { ...value.jCurve, dipSeverity: Number(event.target.value) },
            })
          }
          className="accent-[var(--color-accent)]"
        />
      </label>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1 text-xs">
          <span className="text-[var(--color-muted)]">Dip months</span>
          <input
            type="number"
            min={0}
            max={12}
            value={value.jCurve.dipDurationMonths}
            onChange={(event) =>
              onChange({
                ...value,
                jCurve: {
                  ...value.jCurve,
                  dipDurationMonths: Math.max(0, Number(event.target.value) || 0),
                },
              })
            }
            className="rounded-lg border border-[var(--color-line)] px-2 py-1.5"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="text-[var(--color-muted)]">Ramp months</span>
          <input
            type="number"
            min={0}
            max={12}
            value={value.jCurve.rampDurationMonths}
            onChange={(event) =>
              onChange({
                ...value,
                jCurve: {
                  ...value.jCurve,
                  rampDurationMonths: Math.max(0, Number(event.target.value) || 0),
                },
              })
            }
            className="rounded-lg border border-[var(--color-line)] px-2 py-1.5"
          />
        </label>
      </div>
    </article>
  );
}
