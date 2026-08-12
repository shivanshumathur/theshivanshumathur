import {
  createCustomMetric,
  METRIC_PRESETS,
} from "../../lib/roi-compass/presets/metrics";
import type { UXMetric } from "../../lib/roi-compass/types";

interface MetricPresetPickerProps {
  metrics: UXMetric[];
  onAdd: (metric: UXMetric) => void;
}

export function MetricPresetPicker({ metrics, onAdd }: MetricPresetPickerProps) {
  const selectedKeys = new Set(
    metrics.filter((metric) => !metric.isCustom).map((metric) => metric.label),
  );

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-medium tracking-tight">Value metrics</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Add a preset UX outcome, or a custom metric with a manual dollar value.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {METRIC_PRESETS.map((preset) => {
          const alreadyAdded = selectedKeys.has(preset.label);
          return (
            <button
              key={preset.key}
              type="button"
              disabled={alreadyAdded}
              title={preset.description}
              onClick={() => onAdd(preset.create())}
              className="rounded-full border border-[var(--color-line)] bg-white px-3 py-1.5 text-sm transition enabled:hover:border-[var(--color-accent)] enabled:hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              + {preset.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onAdd(createCustomMetric())}
          className="rounded-full border border-dashed border-[var(--color-line)] bg-transparent px-3 py-1.5 text-sm text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          + Custom metric
        </button>
      </div>
    </section>
  );
}
