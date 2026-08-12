import type { JCurveParams } from "../../lib/roi-compass/types";

interface JCurveControlsProps {
  value: JCurveParams;
  onChange: (next: JCurveParams) => void;
}

export function JCurveControls({ value, onChange }: JCurveControlsProps) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-medium tracking-tight">Adoption J-curve</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Real rollouts dip before they climb — tune the shape, or leave the defaults.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Dip duration (months)</span>
          <input
            type="number"
            min={0}
            max={12}
            step={1}
            value={value.dipDurationMonths}
            onChange={(event) =>
              onChange({
                ...value,
                dipDurationMonths: Math.max(0, Number(event.target.value) || 0),
              })
            }
            className="rounded-xl border border-[var(--color-line)] bg-white px-3 py-2.5 outline-none focus:border-[var(--color-accent)]"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="flex items-center justify-between font-medium">
            Dip severity
            <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
              {Math.round(value.dipSeverity * 100)}%
            </span>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={value.dipSeverity}
            onChange={(event) =>
              onChange({
                ...value,
                dipSeverity: Number(event.target.value),
              })
            }
            className="mt-2 accent-[var(--color-accent)]"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Ramp duration (months)</span>
          <input
            type="number"
            min={0}
            max={12}
            step={1}
            value={value.rampDurationMonths}
            onChange={(event) =>
              onChange({
                ...value,
                rampDurationMonths: Math.max(0, Number(event.target.value) || 0),
              })
            }
            className="rounded-xl border border-[var(--color-line)] bg-white px-3 py-2.5 outline-none focus:border-[var(--color-accent)]"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="flex items-center justify-between font-medium">
            Steady-state multiplier
            <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
              {value.steadyStateMultiplier.toFixed(2)}×
            </span>
          </span>
          <input
            type="range"
            min={1}
            max={1.5}
            step={0.05}
            value={value.steadyStateMultiplier}
            onChange={(event) =>
              onChange({
                ...value,
                steadyStateMultiplier: Number(event.target.value),
              })
            }
            className="mt-2 accent-[var(--color-accent)]"
          />
        </label>
      </div>
    </section>
  );
}
