import { DEFAULT_JCURVE } from "./constants";
import { runJCurveProjection } from "./calculations";
import type {
  AdvancedROIResult,
  CostInputs,
  ScenarioAssumptions,
  ScenarioType,
  UXMetric,
} from "./types";

/** Default best / likely / worst assumption sets for Advanced mode. */
export const SCENARIO_PRESETS: Record<ScenarioType, ScenarioAssumptions> = {
  best: {
    jCurve: {
      dipDurationMonths: 1,
      dipSeverity: 0.2,
      rampDurationMonths: 2,
      steadyStateMultiplier: 1.15,
    },
    adoptionRate: 0.9,
  },
  likely: {
    jCurve: { ...DEFAULT_JCURVE },
    adoptionRate: 0.7,
  },
  worst: {
    jCurve: {
      dipDurationMonths: 4,
      dipSeverity: 0.7,
      rampDurationMonths: 5,
      steadyStateMultiplier: 1.0,
    },
    adoptionRate: 0.4,
  },
};

export function cloneScenarioPresets(): Record<ScenarioType, ScenarioAssumptions> {
  return {
    best: {
      adoptionRate: SCENARIO_PRESETS.best.adoptionRate,
      jCurve: { ...SCENARIO_PRESETS.best.jCurve },
    },
    likely: {
      adoptionRate: SCENARIO_PRESETS.likely.adoptionRate,
      jCurve: { ...SCENARIO_PRESETS.likely.jCurve },
    },
    worst: {
      adoptionRate: SCENARIO_PRESETS.worst.adoptionRate,
      jCurve: { ...SCENARIO_PRESETS.worst.jCurve },
    },
  };
}

/**
 * Run best / likely / worst projections.
 * Each scenario scales raw monthly value by adoptionRate, then applies its J-curve.
 */
export function runAdvancedProjection(
  costs: CostInputs,
  metrics: UXMetric[],
  scenarios: Record<ScenarioType, ScenarioAssumptions>,
): AdvancedROIResult {
  return {
    best: runJCurveProjection(
      costs,
      metrics,
      scenarios.best.jCurve,
      scenarios.best.adoptionRate,
    ),
    likely: runJCurveProjection(
      costs,
      metrics,
      scenarios.likely.jCurve,
      scenarios.likely.adoptionRate,
    ),
    worst: runJCurveProjection(
      costs,
      metrics,
      scenarios.worst.jCurve,
      scenarios.worst.adoptionRate,
    ),
  };
}

/** Treat null (never pays back) as later than any finite month for ordering checks. */
export function paybackRank(paybackMonth: number | null): number {
  return paybackMonth === null ? Number.POSITIVE_INFINITY : paybackMonth;
}
