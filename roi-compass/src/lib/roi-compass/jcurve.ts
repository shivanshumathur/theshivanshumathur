import type { JCurveParams, MonthlyProjection } from "./types";

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

/** 1-indexed inclusive month ranges for J-curve adoption phases. */
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

/**
 * Contiguous months (from first negative) where cumulative net value is still < 0.
 * Used for chart "Dip" shading — the underwater payback period.
 */
export function getUnderwaterMonthRange(
  projections: MonthlyProjection[],
): { start: number; end: number } | null {
  const ordered = projections.filter((row) => row.month >= 0);
  const firstNegative = ordered.find((row) => row.cumulativeNetValue < 0);
  if (!firstNegative) return null;

  let end = firstNegative.month;
  for (const row of ordered) {
    if (row.month < firstNegative.month) continue;
    if (row.cumulativeNetValue < 0) {
      end = row.month;
    } else {
      break;
    }
  }

  return { start: firstNegative.month, end };
}

/**
 * Chart bands: Dip = underwater (cumulative < 0); Ramp / Compounding follow J-curve
 * phases but start after the underwater region so bands stay distinct.
 */
export function getChartPhaseBands(
  projections: MonthlyProjection[],
  params: JCurveParams,
): {
  dip: { start: number; end: number } | null;
  ramp: { start: number; end: number } | null;
  compound: { start: number; end: number } | null;
} {
  const phases = getJCurvePhaseRanges(params);
  const lastMonth = projections[projections.length - 1]?.month ?? 24;
  const underwater = getUnderwaterMonthRange(projections);
  const afterDip = underwater ? underwater.end + 1 : 1;

  let ramp: { start: number; end: number } | null = null;
  if (phases.ramp) {
    const start = Math.max(phases.ramp.start, afterDip);
    const end = phases.ramp.end;
    if (start <= end) {
      ramp = { start, end };
    }
  }

  const compoundStart = Math.max(phases.compoundStart, afterDip, ramp ? ramp.end + 1 : afterDip);
  const compound =
    compoundStart <= lastMonth ? { start: compoundStart, end: lastMonth } : null;

  return {
    dip: underwater,
    ramp,
    compound,
  };
}
