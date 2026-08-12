import type { JCurveParams } from "./types";

/**
 * Multiplier applied to that month's raw monthly *value* (0-indexed month).
 * Cost is not multiplied — seats are paid in full from day one.
 */
export function getJCurveMultiplier(month: number, params: JCurveParams): number {
  const { dipDurationMonths, dipSeverity, rampDurationMonths, steadyStateMultiplier } = params;
  const dipMultiplier = 1 - dipSeverity;
  const rampEndExclusive = dipDurationMonths + rampDurationMonths;

  if (month < dipDurationMonths) {
    return dipMultiplier;
  }

  if (month < rampEndExclusive) {
    if (rampDurationMonths <= 1) {
      return 1;
    }
    // First ramp month stays at dip; last ramp month reaches 1.0
    const t = (month - dipDurationMonths) / (rampDurationMonths - 1);
    return dipMultiplier + (1 - dipMultiplier) * t;
  }

  return steadyStateMultiplier;
}

/** Map multipliers over a series of raw monthly values (index = 0-based month). */
export function applyJCurve(rawMonthlyValues: number[], params: JCurveParams): number[] {
  return rawMonthlyValues.map((value, month) => value * getJCurveMultiplier(month, params));
}

/** 1-indexed inclusive month ranges for chart phase annotations. */
export function getJCurvePhaseRanges(params: JCurveParams): {
  dip: { start: number; end: number } | null;
  ramp: { start: number; end: number } | null;
  compoundStart: number;
} {
  const dipEnd = params.dipDurationMonths;
  const rampEnd = params.dipDurationMonths + params.rampDurationMonths;

  return {
    dip: dipEnd > 0 ? { start: 1, end: dipEnd } : null,
    ramp:
      params.rampDurationMonths > 0
        ? { start: dipEnd + 1, end: rampEnd }
        : null,
    compoundStart: rampEnd + 1,
  };
}
