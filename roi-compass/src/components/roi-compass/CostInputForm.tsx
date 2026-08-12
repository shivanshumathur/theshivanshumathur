import type { CostInputs } from "../../lib/roi-compass/types";

interface CostInputFormProps {
  value: CostInputs;
  onChange: (next: CostInputs) => void;
}

export function CostInputForm({ value, onChange }: CostInputFormProps) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-medium tracking-tight">Cost</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Seat licenses for now. Hidden usage, infra, and verification costs land in a later phase.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Seat count</span>
          <input
            type="number"
            min={0}
            step={1}
            value={value.seatCount}
            onChange={(event) =>
              onChange({
                ...value,
                seatCount: Number(event.target.value) || 0,
              })
            }
            className="rounded-xl border border-[var(--color-line)] bg-white px-3 py-2.5 outline-none focus:border-[var(--color-accent)]"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Cost per seat / month ($)</span>
          <input
            type="number"
            min={0}
            step={1}
            value={value.costPerSeatPerMonth}
            onChange={(event) =>
              onChange({
                ...value,
                costPerSeatPerMonth: Number(event.target.value) || 0,
              })
            }
            className="rounded-xl border border-[var(--color-line)] bg-white px-3 py-2.5 outline-none focus:border-[var(--color-accent)]"
          />
        </label>
      </div>
    </section>
  );
}
