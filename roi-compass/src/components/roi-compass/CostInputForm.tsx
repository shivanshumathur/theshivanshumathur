import { useState } from "react";
import { COST_TEMPLATES } from "../../lib/roi-compass/presets/costTemplates";
import type { CostInputs } from "../../lib/roi-compass/types";

interface CostInputFormProps {
  value: CostInputs;
  onChange: (next: CostInputs) => void;
}

function optionalNumber(value: number | undefined): string {
  return value === undefined ? "" : String(value);
}

export function CostInputForm({ value, onChange }: CostInputFormProps) {
  const [showHidden, setShowHidden] = useState(
    () =>
      value.usageBasedCostPerMonth !== undefined ||
      value.hiddenInfraCostPerMonth !== undefined ||
      value.verificationHoursPerWeekPerSeat !== undefined ||
      value.fullyLoadedHourlyRate !== undefined,
  );
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  function patch(partial: Partial<CostInputs>) {
    onChange({ ...value, ...partial });
  }

  function applyTemplate(key: string) {
    const template = COST_TEMPLATES.find((item) => item.key === key);
    if (!template) return;
    onChange(template.apply(value));
    setActiveTemplate(key);
    setShowHidden(true);
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-medium tracking-tight">Cost</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Seat price is the sticker. Most AI spend hides in usage, infra, and verification time.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {COST_TEMPLATES.map((template) => (
          <button
            key={template.key}
            type="button"
            title={template.description}
            onClick={() => applyTemplate(template.key)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              activeTemplate === template.key
                ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                : "border-[var(--color-line)] bg-white hover:border-[var(--color-accent)]"
            }`}
          >
            {template.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Seat count"
          value={value.seatCount}
          onChange={(seatCount) => {
            setActiveTemplate(null);
            patch({ seatCount });
          }}
        />
        <NumberField
          label="Cost per seat / month ($)"
          value={value.costPerSeatPerMonth}
          onChange={(costPerSeatPerMonth) => {
            setActiveTemplate(null);
            patch({ costPerSeatPerMonth });
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => setShowHidden((open) => !open)}
        className="self-start text-sm font-medium text-[var(--color-accent)] underline-offset-4 hover:underline"
        aria-expanded={showHidden}
      >
        {showHidden ? "Hide hidden costs" : "Show hidden costs"}
      </button>

      {showHidden ? (
        <div className="grid gap-4 rounded-2xl border border-[var(--color-line)] bg-white/70 p-4 sm:grid-cols-2">
          <OptionalNumberField
            label="Usage / token overage / month ($)"
            value={value.usageBasedCostPerMonth}
            onChange={(usageBasedCostPerMonth) => {
              setActiveTemplate(null);
              patch({ usageBasedCostPerMonth });
            }}
          />
          <OptionalNumberField
            label="Hidden infra / month ($)"
            value={value.hiddenInfraCostPerMonth}
            onChange={(hiddenInfraCostPerMonth) => {
              setActiveTemplate(null);
              patch({ hiddenInfraCostPerMonth });
            }}
          />
          <OptionalNumberField
            label="Verification hours / week / seat"
            value={value.verificationHoursPerWeekPerSeat}
            step={0.5}
            onChange={(verificationHoursPerWeekPerSeat) => {
              setActiveTemplate(null);
              patch({ verificationHoursPerWeekPerSeat });
            }}
          />
          <OptionalNumberField
            label="Fully loaded hourly rate ($)"
            value={value.fullyLoadedHourlyRate}
            onChange={(fullyLoadedHourlyRate) => {
              setActiveTemplate(null);
              patch({ fullyLoadedHourlyRate });
            }}
          />
          <p className="sm:col-span-2 text-xs leading-relaxed text-[var(--color-muted)]">
            Verification cost = seats × hours/week × 4.33 weeks × hourly rate. Templates pre-fill
            these fields; edit freely afterward.
          </p>
        </div>
      ) : null}
    </section>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <input
        type="number"
        min={0}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
        className="rounded-xl border border-[var(--color-line)] bg-white px-3 py-2.5 outline-none focus:border-[var(--color-accent)]"
      />
    </label>
  );
}

function OptionalNumberField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  step?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <input
        type="number"
        min={0}
        step={step}
        value={optionalNumber(value)}
        placeholder="0"
        onChange={(event) => {
          const raw = event.target.value;
          if (raw === "") {
            onChange(undefined);
            return;
          }
          onChange(Number(raw) || 0);
        }}
        className="rounded-xl border border-[var(--color-line)] bg-white px-3 py-2.5 outline-none focus:border-[var(--color-accent)]"
      />
    </label>
  );
}
