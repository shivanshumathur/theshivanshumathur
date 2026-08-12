import { WEEKS_PER_MONTH } from "./constants";
import type { CostInputs } from "./types";

/**
 * Human verification / review time cost per month.
 * Missing fields degrade to $0 so Phase 1–3 inputs keep working.
 */
export function calculateVerificationCost(costs: CostInputs): number {
  const hoursPerWeek = costs.verificationHoursPerWeekPerSeat ?? 0;
  const hourlyRate = costs.fullyLoadedHourlyRate ?? 0;
  return costs.seatCount * hoursPerWeek * WEEKS_PER_MONTH * hourlyRate;
}

export function calculateSeatCost(costs: CostInputs): number {
  return costs.seatCount * costs.costPerSeatPerMonth;
}

export function calculateUsageCost(costs: CostInputs): number {
  return costs.usageBasedCostPerMonth ?? 0;
}

export function calculateInfraCost(costs: CostInputs): number {
  return costs.hiddenInfraCostPerMonth ?? 0;
}

export interface CostBreakdownSlices {
  seat: number;
  usage: number;
  infra: number;
  verification: number;
  total: number;
}

/** Split monthly cost into labeled slices for the breakdown chart. */
export function breakDownMonthlyCosts(costs: CostInputs): CostBreakdownSlices {
  const seat = calculateSeatCost(costs);
  const usage = calculateUsageCost(costs);
  const infra = calculateInfraCost(costs);
  const verification = calculateVerificationCost(costs);
  return {
    seat,
    usage,
    infra,
    verification,
    total: seat + usage + infra + verification,
  };
}
