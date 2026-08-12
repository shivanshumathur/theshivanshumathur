import type { UXMetric } from "../types";

/** Factory helpers so each preset gets a fresh id when added to the calculator. */
function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export interface MetricPresetDefinition {
  key: string;
  label: string;
  description: string;
  create: () => UXMetric;
}

export const METRIC_PRESETS: MetricPresetDefinition[] = [
  {
    key: "task-success-rate",
    label: "Task success rate",
    description: "Share of tasks completed successfully — valued via time saved on rework.",
    create: () => ({
      id: createId("task-success"),
      label: "Task success rate",
      unit: "percent",
      baselineValue: 72,
      projectedValue: 88,
      dollarConversionMethod: {
        type: "time_saved",
        avgVolumePerMonth: 800,
        hourlyValue: 75,
      },
      isCustom: false,
    }),
  },
  {
    key: "time-on-task",
    label: "Time on task",
    description: "Seconds to complete a primary task — lower is better.",
    create: () => ({
      id: createId("time-on-task"),
      label: "Time on task",
      unit: "seconds",
      baselineValue: 180,
      projectedValue: 120,
      dollarConversionMethod: {
        type: "time_saved",
        avgVolumePerMonth: 1200,
        hourlyValue: 75,
      },
      isCustom: false,
    }),
  },
  {
    key: "error-defect-rate",
    label: "Error / defect rate",
    description: "Percent of outputs that need correction — valued as incident deflection.",
    create: () => ({
      id: createId("error-rate"),
      label: "Error / defect rate",
      unit: "percent",
      baselineValue: 18,
      projectedValue: 8,
      dollarConversionMethod: {
        type: "deflection",
        avgVolumePerMonth: 1000,
        costPerIncident: 45,
      },
      isCustom: false,
    }),
  },
  {
    key: "support-deflection",
    label: "Support ticket deflection",
    description: "Tickets avoided per month via self-serve / AI assist.",
    create: () => ({
      id: createId("support-deflection"),
      label: "Support ticket deflection",
      unit: "count",
      baselineValue: 40,
      projectedValue: 120,
      dollarConversionMethod: {
        type: "deflection",
        avgVolumePerMonth: 0,
        costPerIncident: 28,
      },
      isCustom: false,
    }),
  },
  {
    key: "csat-nps",
    label: "CSAT / NPS delta",
    description: "Hard to auto-convert — enter the monthly dollar value of the lift manually.",
    create: () => ({
      id: createId("csat-nps"),
      label: "CSAT / NPS delta",
      unit: "score",
      baselineValue: 32,
      projectedValue: 45,
      dollarConversionMethod: {
        type: "manual",
        dollarValuePerMonth: 2500,
      },
      isCustom: false,
    }),
  },
];

export function createCustomMetric(): UXMetric {
  return {
    id: createId("custom"),
    label: "Custom metric",
    unit: "currency",
    baselineValue: 0,
    projectedValue: 0,
    dollarConversionMethod: {
      type: "manual",
      dollarValuePerMonth: 1000,
    },
    isCustom: true,
  };
}
