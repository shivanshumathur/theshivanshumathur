import { describe, expect, it } from "vitest";
import {
  calculateTotalMonthlyCost,
  calculateTotalMonthlyValue,
  convertMetricToDollarValue,
  runSimpleProjection,
} from "../calculations";
import { PROJECTION_WINDOW_MONTHS, SECONDS_PER_HOUR } from "../constants";
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

describe("convertMetricToDollarValue", () => {
  it("converts time-on-task seconds via volume and hourly value", () => {
    const metric: UXMetric = {
      id: "tot",
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
    };

    // (60s saved / 3600) * 1200 volume * $75 = $1,500
    expect(convertMetricToDollarValue(metric)).toBe(
      ((180 - 120) / SECONDS_PER_HOUR) * 1200 * 75,
    );
  });

  it("converts manual metrics to the stated dollar amount", () => {
    expect(convertMetricToDollarValue(manualMetric(2500))).toBe(2500);
  });

  it("converts deflection count as additional tickets avoided", () => {
    const metric: UXMetric = {
      id: "def",
      label: "Support deflection",
      unit: "count",
      baselineValue: 40,
      projectedValue: 120,
      dollarConversionMethod: {
        type: "deflection",
        avgVolumePerMonth: 0,
        costPerIncident: 28,
      },
      isCustom: false,
    };

    expect(convertMetricToDollarValue(metric)).toBe((120 - 40) * 28);
  });
});

describe("runSimpleProjection", () => {
  it("handles zero-cost: pays back in month 1 when value is positive", () => {
    const costs: CostInputs = { seatCount: 0, costPerSeatPerMonth: 40 };
    const metrics = [manualMetric(1000)];
    const result = runSimpleProjection(costs, metrics);

    expect(calculateTotalMonthlyCost(costs)).toBe(0);
    expect(result.paybackMonth).toBe(1);
    expect(result.monthlyProjections[0]?.cumulativeNetValue).toBe(1000);
    expect(result.totalCostOverWindow).toBe(0);
    expect(result.totalValueOverWindow).toBe(1000 * PROJECTION_WINDOW_MONTHS);
  });

  it("never pays back when monthly value stays below monthly cost", () => {
    const costs: CostInputs = { seatCount: 10, costPerSeatPerMonth: 100 }; // $1,000 / mo
    const metrics = [manualMetric(250)]; // $250 / mo
    const result = runSimpleProjection(costs, metrics);

    expect(result.paybackMonth).toBeNull();
    expect(result.monthlyProjections.every((row) => row.cumulativeNetValue < 0)).toBe(true);
    expect(result.monthlyProjections.at(-1)?.cumulativeNetValue).toBe(
      (250 - 1000) * PROJECTION_WINDOW_MONTHS,
    );
  });

  it("matches a hand-calculated known-good linear scenario", () => {
    // Seat cost: 10 × $100 = $1,000 / month
    // Time-on-task value: ((180-120)/3600) × 1200 × $75 = $1,500 / month
    // Monthly net = $500 → cumulative crosses ≥ 0 in month 1
    const costs: CostInputs = { seatCount: 10, costPerSeatPerMonth: 100 };
    const metrics: UXMetric[] = [
      {
        id: "tot",
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
      },
    ];

    expect(calculateTotalMonthlyCost(costs)).toBe(1000);
    expect(calculateTotalMonthlyValue(metrics)).toBe(1500);

    const result = runSimpleProjection(costs, metrics);

    expect(result.paybackMonth).toBe(1);
    expect(result.totalCostOverWindow).toBe(1000 * PROJECTION_WINDOW_MONTHS);
    expect(result.totalValueOverWindow).toBe(1500 * PROJECTION_WINDOW_MONTHS);
    expect(result.monthlyProjections).toHaveLength(PROJECTION_WINDOW_MONTHS);
    expect(result.monthlyProjections[6]?.cumulativeNetValue).toBe(500 * 7);
  });

  it("keeps the projection linear — equal monthly net every month", () => {
    const result = runSimpleProjection(
      { seatCount: 5, costPerSeatPerMonth: 20 },
      [manualMetric(200)],
    );

    const nets = result.monthlyProjections.map((row) => row.monthlyNetValue);
    expect(new Set(nets).size).toBe(1);
    expect(nets[0]).toBe(100);

    // Straight cumulative line: month n cumulative = n * monthlyNet
    result.monthlyProjections.forEach((row, index) => {
      expect(row.cumulativeNetValue).toBe((index + 1) * 100);
    });
  });
});
