import { describe, expect, it } from "vitest";
import { runJCurveProjection, runSimpleProjection } from "../calculations";
import { DEFAULT_JCURVE } from "../constants";
import { applyJCurve, getJCurveMultiplier } from "../jcurve";
import type { CostInputs, JCurveParams, UXMetric } from "../types";

const defaultParams: JCurveParams = { ...DEFAULT_JCURVE };

function manualMetric(dollarValuePerMonth: number): UXMetric {
  return {
    id: "manual-1",
    label: "Manual",
    unit: "currency",
    baselineValue: 0,
    projectedValue: 0,
    dollarConversionMethod: { type: "manual", dollarValuePerMonth },
    isCustom: true,
  };
}

describe("getJCurveMultiplier", () => {
  it("returns 1 - dipSeverity at month 0 (dip phase)", () => {
    expect(getJCurveMultiplier(0, defaultParams)).toBe(1 - defaultParams.dipSeverity);
    expect(getJCurveMultiplier(1, defaultParams)).toBe(1 - defaultParams.dipSeverity);
  });

  it("returns a mid-ramp multiplier strictly between dip and 1.0", () => {
    // dip=2, ramp=3 → ramp months 2,3,4; month 3 is mid-ramp
    const midRamp = getJCurveMultiplier(3, defaultParams);
    const dipMultiplier = 1 - defaultParams.dipSeverity;
    expect(midRamp).toBeGreaterThan(dipMultiplier);
    expect(midRamp).toBeLessThan(1);
  });

  it("returns steadyStateMultiplier after the ramp", () => {
    // ramp ends at month index 5 (0-based): dip 0-1, ramp 2-4, steady from 5
    expect(getJCurveMultiplier(5, defaultParams)).toBe(defaultParams.steadyStateMultiplier);
    expect(getJCurveMultiplier(12, defaultParams)).toBe(defaultParams.steadyStateMultiplier);
  });
});

describe("applyJCurve", () => {
  it("scales each month's raw value by the month multiplier", () => {
    const raw = [1000, 1000, 1000, 1000, 1000, 1000];
    const adjusted = applyJCurve(raw, defaultParams);
    expect(adjusted[0]).toBe(1000 * (1 - defaultParams.dipSeverity));
    expect(adjusted[5]).toBe(1000 * defaultParams.steadyStateMultiplier);
  });
});

describe("runJCurveProjection vs linear", () => {
  it("never pays back faster than the Phase 1 linear projection for the same inputs", () => {
    // Value barely beats cost linearly; dip makes early months negative → later payback
    const costs: CostInputs = { seatCount: 10, costPerSeatPerMonth: 100 }; // $1,000
    const metrics = [manualMetric(1200)];

    const linear = runSimpleProjection(costs, metrics);
    const jcurve = runJCurveProjection(costs, metrics, defaultParams);

    expect(linear.paybackMonth).not.toBeNull();
    expect(jcurve.paybackMonth).not.toBeNull();
    expect(jcurve.paybackMonth!).toBeGreaterThanOrEqual(linear.paybackMonth!);
  });

  it("reproduces the Phase 1 linear result when dip severity is 0 and steady state is 1", () => {
    const costs: CostInputs = { seatCount: 10, costPerSeatPerMonth: 100 };
    const metrics = [manualMetric(1500)];
    const linearParams: JCurveParams = {
      dipDurationMonths: 2,
      dipSeverity: 0,
      rampDurationMonths: 3,
      steadyStateMultiplier: 1,
    };

    const linear = runSimpleProjection(costs, metrics);
    const jcurve = runJCurveProjection(costs, metrics, linearParams);

    expect(jcurve.paybackMonth).toBe(linear.paybackMonth);
    expect(jcurve.totalCostOverWindow).toBe(linear.totalCostOverWindow);
    expect(jcurve.totalValueOverWindow).toBe(linear.totalValueOverWindow);
    jcurve.monthlyProjections.forEach((row, index) => {
      expect(row.cumulativeNetValue).toBe(linear.monthlyProjections[index]!.cumulativeNetValue);
      expect(row.monthlyNetValue).toBe(linear.monthlyProjections[index]!.monthlyNetValue);
    });
  });
});
