import { describe, expect, it } from "vitest";
import {
  calculateTotalMonthlyCost,
  runJCurveProjection,
  runSimpleProjection,
} from "../calculations";
import { DEFAULT_JCURVE, WEEKS_PER_MONTH } from "../constants";
import {
  breakDownMonthlyCosts,
  calculateVerificationCost,
} from "../hiddenCosts";
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

describe("hidden costs", () => {
  it("calculates verification cost from weekly hours and loaded rate", () => {
    const costs: CostInputs = {
      seatCount: 10,
      costPerSeatPerMonth: 40,
      verificationHoursPerWeekPerSeat: 2,
      fullyLoadedHourlyRate: 100,
    };

    expect(calculateVerificationCost(costs)).toBe(10 * 2 * WEEKS_PER_MONTH * 100);
  });

  it("degrades to seat-only cost when Phase 4 fields are undefined", () => {
    const costs: CostInputs = { seatCount: 10, costPerSeatPerMonth: 40 };
    expect(calculateTotalMonthlyCost(costs)).toBe(400);
    expect(calculateVerificationCost(costs)).toBe(0);
    expect(breakDownMonthlyCosts(costs)).toEqual({
      seat: 400,
      usage: 0,
      infra: 0,
      verification: 0,
      total: 400,
    });
  });

  it("pushes payback later when hidden costs are added vs seat-only", () => {
    const seatOnly: CostInputs = { seatCount: 10, costPerSeatPerMonth: 100 };
    const withHidden: CostInputs = {
      ...seatOnly,
      usageBasedCostPerMonth: 200,
      hiddenInfraCostPerMonth: 150,
      verificationHoursPerWeekPerSeat: 2,
      fullyLoadedHourlyRate: 80,
    };
    const metrics = [manualMetric(2000)];

    const linearSeat = runSimpleProjection(seatOnly, metrics);
    const linearHidden = runSimpleProjection(withHidden, metrics);
    const jcurveSeat = runJCurveProjection(seatOnly, metrics, { ...DEFAULT_JCURVE });
    const jcurveHidden = runJCurveProjection(withHidden, metrics, { ...DEFAULT_JCURVE });

    expect(calculateTotalMonthlyCost(withHidden)).toBeGreaterThan(
      calculateTotalMonthlyCost(seatOnly),
    );

    // null (never) ranks later than any finite month
    const rank = (month: number | null) => month ?? Number.POSITIVE_INFINITY;
    expect(rank(linearHidden.paybackMonth)).toBeGreaterThanOrEqual(rank(linearSeat.paybackMonth));
    expect(rank(jcurveHidden.paybackMonth)).toBeGreaterThanOrEqual(rank(jcurveSeat.paybackMonth));
  });

  it("surfaces verification as its own breakdown slice", () => {
    const costs: CostInputs = {
      seatCount: 10,
      costPerSeatPerMonth: 40,
      usageBasedCostPerMonth: 100,
      hiddenInfraCostPerMonth: 50,
      verificationHoursPerWeekPerSeat: 3,
      fullyLoadedHourlyRate: 90,
    };
    const slices = breakDownMonthlyCosts(costs);
    expect(slices.verification).toBe(10 * 3 * WEEKS_PER_MONTH * 90);
    expect(slices.verification).toBeGreaterThan(slices.seat);
    expect(slices.total).toBe(slices.seat + slices.usage + slices.infra + slices.verification);
  });
});
