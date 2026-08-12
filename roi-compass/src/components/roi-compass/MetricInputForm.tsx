import type { DollarConversionMethod, UXMetric } from "../../lib/roi-compass/types";

interface MetricInputFormProps {
  metrics: UXMetric[];
  onChange: (metrics: UXMetric[]) => void;
}

export function MetricInputForm({ metrics, onChange }: MetricInputFormProps) {
  if (metrics.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--color-line)] px-4 py-6 text-sm text-[var(--color-muted)]">
        No metrics yet — pick a preset above to start estimating value.
      </p>
    );
  }

  function updateMetric(id: string, patch: Partial<UXMetric>) {
    onChange(metrics.map((metric) => (metric.id === id ? { ...metric, ...patch } : metric)));
  }

  function updateMethod(id: string, method: DollarConversionMethod) {
    updateMetric(id, { dollarConversionMethod: method });
  }

  function removeMetric(id: string) {
    onChange(metrics.filter((metric) => metric.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      {metrics.map((metric) => (
        <article
          key={metric.id}
          className="rounded-2xl border border-[var(--color-line)] bg-white/80 p-4 sm:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {metric.isCustom ? (
                <input
                  type="text"
                  value={metric.label}
                  onChange={(event) => updateMetric(metric.id, { label: event.target.value })}
                  className="w-full rounded-lg border border-transparent bg-transparent px-0 py-1 text-base font-medium outline-none focus:border-[var(--color-line)] focus:px-2"
                  aria-label="Custom metric label"
                />
              ) : (
                <h3 className="text-base font-medium">{metric.label}</h3>
              )}
              <p className="mt-0.5 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)] uppercase tracking-wide">
                {metric.unit} · {metric.dollarConversionMethod.type.replaceAll("_", " ")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => removeMetric(metric.id)}
              className="shrink-0 text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            >
              Remove
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <NumberField
              label="Baseline"
              value={metric.baselineValue}
              onChange={(baselineValue) => updateMetric(metric.id, { baselineValue })}
            />
            <NumberField
              label="Projected"
              value={metric.projectedValue}
              onChange={(projectedValue) => updateMetric(metric.id, { projectedValue })}
            />
          </div>

          <ConversionFields
            method={metric.dollarConversionMethod}
            onChange={(next) => updateMethod(metric.id, next)}
          />
        </article>
      ))}
    </div>
  );
}

function ConversionFields({
  method,
  onChange,
}: {
  method: DollarConversionMethod;
  onChange: (next: DollarConversionMethod) => void;
}) {
  if (method.type === "manual") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <NumberField
          label="Monthly dollar value ($)"
          value={method.dollarValuePerMonth}
          onChange={(dollarValuePerMonth) => onChange({ ...method, dollarValuePerMonth })}
        />
      </div>
    );
  }

  if (method.type === "time_saved") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <NumberField
          label="Avg volume / month"
          value={method.avgVolumePerMonth}
          onChange={(avgVolumePerMonth) => onChange({ ...method, avgVolumePerMonth })}
        />
        <NumberField
          label="Hourly value ($)"
          value={method.hourlyValue}
          onChange={(hourlyValue) => onChange({ ...method, hourlyValue })}
        />
      </div>
    );
  }

  if (method.type === "conversion_lift") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <NumberField
          label="Avg volume / month"
          value={method.avgVolumePerMonth}
          onChange={(avgVolumePerMonth) => onChange({ ...method, avgVolumePerMonth })}
        />
        <NumberField
          label="Avg order value ($)"
          value={method.avgOrderValue}
          onChange={(avgOrderValue) => onChange({ ...method, avgOrderValue })}
        />
      </div>
    );
  }

  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-2">
      <NumberField
        label="Avg volume / month"
        value={method.avgVolumePerMonth}
        onChange={(avgVolumePerMonth) => onChange({ ...method, avgVolumePerMonth })}
      />
      <NumberField
        label="Cost per incident ($)"
        value={method.costPerIncident}
        onChange={(costPerIncident) => onChange({ ...method, costPerIncident })}
      />
    </div>
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
      <span className="text-[var(--color-muted)]">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
        className="rounded-xl border border-[var(--color-line)] bg-white px-3 py-2 outline-none focus:border-[var(--color-accent)]"
      />
    </label>
  );
}
