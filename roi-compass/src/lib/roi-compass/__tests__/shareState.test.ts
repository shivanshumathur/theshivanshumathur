import { describe, expect, it } from "vitest";
import {
  buildShareUrl,
  deserializeShareState,
  parseShareStateFromSearch,
  serializeShareState,
  SHARE_QUERY_KEY,
  type ShareableState,
} from "../shareState";
import type { UXMetric } from "../types";

function sampleState(): ShareableState {
  const metric: UXMetric = {
    id: "tot-1",
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

  return {
    v: 1,
    mode: "advanced",
    costs: {
      seatCount: 12,
      costPerSeatPerMonth: 42,
      usageBasedCostPerMonth: 150,
      verificationHoursPerWeekPerSeat: 2,
      fullyLoadedHourlyRate: 90,
    },
    metrics: [metric],
    jCurve: {
      dipDurationMonths: 2,
      dipSeverity: 0.35,
      rampDurationMonths: 3,
      steadyStateMultiplier: 1.05,
    },
    scenarios: {
      best: {
        adoptionRate: 0.9,
        jCurve: {
          dipDurationMonths: 1,
          dipSeverity: 0.1,
          rampDurationMonths: 2,
          steadyStateMultiplier: 1.2,
        },
      },
      likely: {
        adoptionRate: 0.7,
        jCurve: {
          dipDurationMonths: 2,
          dipSeverity: 0.4,
          rampDurationMonths: 3,
          steadyStateMultiplier: 1.1,
        },
      },
      worst: {
        adoptionRate: 0.4,
        jCurve: {
          dipDurationMonths: 4,
          dipSeverity: 0.7,
          rampDurationMonths: 5,
          steadyStateMultiplier: 1,
        },
      },
    },
  };
}

describe("shareState", () => {
  it("round-trips serialize → deserialize with the same inputs", () => {
    const original = sampleState();
    const encoded = serializeShareState(original);
    const restored = deserializeShareState(encoded);
    expect(restored).toEqual(original);
  });

  it("parses state from a query string and rejects garbage", () => {
    const original = sampleState();
    const encoded = serializeShareState(original);
    const fromSearch = parseShareStateFromSearch(`?${SHARE_QUERY_KEY}=${encoded}&x=1`);
    expect(fromSearch).toEqual(original);
    expect(deserializeShareState("not-valid")).toBeNull();
    expect(parseShareStateFromSearch("")).toBeNull();
  });

  it("builds a share URL that embeds the encoded state", () => {
    const original = sampleState();
    const url = buildShareUrl(original, "https://example.com/ai-lab/roi-compass/");
    const parsed = new URL(url);
    expect(parsed.pathname).toContain("/ai-lab/roi-compass");
    expect(deserializeShareState(parsed.searchParams.get(SHARE_QUERY_KEY))).toEqual(original);
  });
});
