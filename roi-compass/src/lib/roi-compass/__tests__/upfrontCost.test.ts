import { describe, expect, it } from "vitest";
import {
  runJCurveProjection,
  runSimpleProjection,
} from "../calculations";
import { DEFAULT_JCURVE } from "../constants";
import { getChartPhaseBands, getUnderwaterMonthRange } from "../jcurve";
import { runAdvancedProjection, cloneScenarioPresets } from "../scenarios";
import type { CostInputs, UXMetric } from "../types";

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

describe("one-time implementation cost (Phase 2.5)", () => {
  it("matches prior behavior when oneTimeImplementationCost is 0 / undefined (regression)", () => {
    const base: CostInputs = { seatCount: 10, costPerSeatPerMonth: 100 };
    const withZero: CostInputs = { ...base, oneTimeImplementationCost: 0 };
    const metrics = [manualMetric(1500)];

    const undefinedResult = runSimpleProjection(base, metrics);
    const zeroResult = runSimpleProjection(withZero, metrics);
    const undefinedJ = runJCurveProjection(base, metrics, { ...DEFAULT_JCURVE });
    const zeroJ = runJCurveProjection(withZero, metrics, { ...DEFAULT_JCURVE });

    expect(zeroResult).toEqual(undefinedResult);
    expect(zeroJ).toEqual(undefinedJ);
    expect(undefinedResult.monthlyProjections[0]?.month).toBe(1);
  });

  it("delays payback past month 1 for realistic seat costs with nonzero upfront", () => {
    const costs: CostInputs = {
      seatCount: 25,
      costPerSeatPerMonth: 40,
      oneTimeImplementationCost: 12000,
    };
    const metrics = [manualMetric(2500)];

    const linear = runSimpleProjection(costs, metrics);
    const jcurve = runJCurveProjection(costs, metrics, { ...DEFAULT_JCURVE });

    expect(linear.paybackMonth).not.toBeNull();
    expect(linear.paybackMonth!).toBeGreaterThan(1);
    expect(jcurve.paybackMonth).not.toBeNull();
    expect(jcurve.paybackMonth!).toBeGreaterThanOrEqual(linear.paybackMonth!);

    // Starts underwater
    expect(jcurve.monthlyProjections[0]?.cumulativeNetValue).toBeLessThan(0);
    expect(getUnderwaterMonthRange(jcurve.monthlyProjections)).not.toBeNull();
  });

  it("includes upfront cost in totalCostOverWindow", () => {
    const costs: CostInputs = {
      seatCount: 10,
      costPerSeatPerMonth: 100,
      oneTimeImplementationCost: 5000,
    };
    const result = runSimpleProjection(costs, [manualMetric(2000)]);
    expect(result.totalCostOverWindow).toBe(1000 * 24 + 5000);
  });

  it("applies the same upfront logic across advanced scenarios", () => {
    const costs: CostInputs = {
      seatCount: 20,
      costPerSeatPerMonth: 80,
      oneTimeImplementationCost: 15000,
    };
    const metrics = [manualMetric(4000)];
    const advanced = runAdvancedProjection(costs, metrics, cloneScenarioPresets());

    for (const key of ["best", "likely", "worst"] as const) {
      const series = advanced[key];
      expect(series.monthlyProjections.some((row) => row.cumulativeNetValue < 0)).toBe(true);
      expect(series.totalCostOverWindow).toBeGreaterThanOrEqual(15000);
      if (series.paybackMonth !== null) {
        expect(series.paybackMonth).toBeGreaterThan(1);
      }
    }
  });

  it("exposes a Dip chart band when cumulative is underwater", () => {
    const costs: CostInputs = {
      seatCount: 25,
      costPerSeatPerMonth: 40,
      oneTimeImplementationCost: 12000,
    };
    const result = runJCurveProjection(costs, [manualMetric(2000)], { ...DEFAULT_JCURVE });
    const bands = getChartPhaseBands(result.monthlyProjections, { ...DEFAULT_JCURVE });
    expect(bands.dip).not.toBeNull();
    expect(bands.dip!.end).toBeGreaterThanOrEqual(bands.dip!.start);
  });
});
