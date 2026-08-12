import {
  PROJECTION_WINDOW_MONTHS,
  SECONDS_PER_HOUR,
  TIME_SAVED_HOURS_PER_IMPROVED_TASK,
} from "./constants";
import type { CostInputs, MonthlyProjection, ROIResult, UXMetric } from "./types";

/**
 * Convert a single UX metric into an estimated monthly dollar value.
 * Directionality: seconds and error-style percent (deflection) treat lower projected as better;
 * other units treat higher projected as better.
 */
export function convertMetricToDollarValue(metric: UXMetric): number {
  const method = metric.dollarConversionMethod;

  switch (method.type) {
    case "manual":
      return method.dollarValuePerMonth;

    case "time_saved": {
      const hoursSaved = hoursSavedFromMetric(metric, method.avgVolumePerMonth);
      return hoursSaved * method.hourlyValue;
    }

    case "conversion_lift": {
      const extraConversions = positiveDeltaFraction(metric) * method.avgVolumePerMonth;
      return extraConversions * method.avgOrderValue;
    }

    case "deflection": {
      const incidentsAvoided = incidentsAvoidedFromMetric(metric, method.avgVolumePerMonth);
      return incidentsAvoided * method.costPerIncident;
    }

    default: {
      const _exhaustive: never = method;
      return _exhaustive;
    }
  }
}

export function calculateTotalMonthlyCost(costs: CostInputs): number {
  // Phase 1: seat license only. Optional Phase 4 fields are ignored when undefined.
  return costs.seatCount * costs.costPerSeatPerMonth;
}

export function calculateTotalMonthlyValue(metrics: UXMetric[]): number {
  return metrics.reduce((sum, metric) => sum + convertMetricToDollarValue(metric), 0);
}

/**
 * Linear month-over-month projection (no J-curve).
 * Payback = first 1-indexed month where cumulative net value ≥ 0.
 */
export function runSimpleProjection(costs: CostInputs, metrics: UXMetric[]): ROIResult {
  const monthlyCost = calculateTotalMonthlyCost(costs);
  const monthlyValue = calculateTotalMonthlyValue(metrics);
  const monthlyNetValue = monthlyValue - monthlyCost;

  const monthlyProjections: MonthlyProjection[] = [];
  let cumulativeNetValue = 0;
  let paybackMonth: number | null = null;

  for (let month = 1; month <= PROJECTION_WINDOW_MONTHS; month += 1) {
    cumulativeNetValue += monthlyNetValue;
    monthlyProjections.push({
      month,
      monthlyNetValue,
      cumulativeNetValue,
    });

    if (paybackMonth === null && cumulativeNetValue >= 0) {
      paybackMonth = month;
    }
  }

  return {
    paybackMonth,
    totalCostOverWindow: monthlyCost * PROJECTION_WINDOW_MONTHS,
    totalValueOverWindow: monthlyValue * PROJECTION_WINDOW_MONTHS,
    monthlyProjections,
  };
}

function hoursSavedFromMetric(metric: UXMetric, avgVolumePerMonth: number): number {
  if (metric.unit === "seconds") {
    const secondsSavedPerInstance = metric.baselineValue - metric.projectedValue;
    return (secondsSavedPerInstance / SECONDS_PER_HOUR) * avgVolumePerMonth;
  }

  // percent and other "higher is better" units: improved share of volume × hours per task
  const improvedShare = positiveDeltaFraction(metric);
  return improvedShare * avgVolumePerMonth * TIME_SAVED_HOURS_PER_IMPROVED_TASK;
}

function incidentsAvoidedFromMetric(metric: UXMetric, avgVolumePerMonth: number): number {
  if (metric.unit === "count") {
    // Support ticket deflection: additional tickets deflected vs baseline
    return metric.projectedValue - metric.baselineValue;
  }

  // Error / defect rate (percent): lower projected is better
  const rateImprovement = (metric.baselineValue - metric.projectedValue) / 100;
  return rateImprovement * avgVolumePerMonth;
}

/** Fraction of volume improved when higher projected values are better (clamped at 0 for declines). */
function positiveDeltaFraction(metric: UXMetric): number {
  if (metric.unit === "percent" || metric.unit === "score") {
    return Math.max(0, (metric.projectedValue - metric.baselineValue) / 100);
  }
  return Math.max(0, metric.projectedValue - metric.baselineValue);
}
