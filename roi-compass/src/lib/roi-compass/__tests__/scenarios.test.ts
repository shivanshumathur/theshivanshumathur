import { describe, expect, it } from "vitest";
import {
  cloneScenarioPresets,
  paybackRank,
  runAdvancedProjection,
  SCENARIO_PRESETS,
} from "../scenarios";
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

describe("runAdvancedProjection", () => {
  it("orders payback months best ≤ likely ≤ worst for the same base inputs", () => {
    // Seat cost high enough that adoption + dip spread the payback timeline
    const costs: CostInputs = { seatCount: 20, costPerSeatPerMonth: 80 }; // $1,600
    const metrics = [manualMetric(3500)];

    const result = runAdvancedProjection(costs, metrics, cloneScenarioPresets());

    expect(paybackRank(result.best.paybackMonth)).toBeLessThanOrEqual(
      paybackRank(result.likely.paybackMonth),
    );
    expect(paybackRank(result.likely.paybackMonth)).toBeLessThanOrEqual(
      paybackRank(result.worst.paybackMonth),
    );
  });

  it("produces three distinct projection series from scenario presets", () => {
    const costs: CostInputs = { seatCount: 10, costPerSeatPerMonth: 100 };
    const metrics = [manualMetric(2000)];
    const result = runAdvancedProjection(costs, metrics, SCENARIO_PRESETS);

    const bestM1 = result.best.monthlyProjections[0]!.monthlyNetValue;
    const likelyM1 = result.likely.monthlyProjections[0]!.monthlyNetValue;
    const worstM1 = result.worst.monthlyProjections[0]!.monthlyNetValue;

    expect(bestM1).not.toBe(likelyM1);
    expect(likelyM1).not.toBe(worstM1);
    expect(bestM1).toBeGreaterThan(worstM1);
  });
});
