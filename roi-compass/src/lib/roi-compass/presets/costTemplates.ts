import type { CostInputs } from "../types";

export interface CostTemplate {
  key: string;
  label: string;
  description: string;
  /** Partial cost fields applied on top of the user's current seat count when selected. */
  apply: (current: CostInputs) => CostInputs;
}

/**
 * Starter templates so users aren't staring at blank hidden-cost fields.
 * Values are illustrative defaults — always editable after apply.
 */
export const COST_TEMPLATES: CostTemplate[] = [
  {
    key: "coding-assistant",
    label: "Coding assistant",
    description:
      "Copilot / Cursor-style tools — deeper workflow integration, higher upfront change cost.",
    apply: (current) => ({
      ...current,
      costPerSeatPerMonth: current.costPerSeatPerMonth || 40,
      oneTimeImplementationCost: 25000,
      usageBasedCostPerMonth: 18 * current.seatCount,
      hiddenInfraCostPerMonth: 200,
      verificationHoursPerWeekPerSeat: 3,
      fullyLoadedHourlyRate: 95,
    }),
  },
  {
    key: "design-ux",
    label: "Design / UX tool",
    description: "Generative design or research assists — mid-size rollout / training investment.",
    apply: (current) => ({
      ...current,
      costPerSeatPerMonth: current.costPerSeatPerMonth || 35,
      oneTimeImplementationCost: 8000,
      usageBasedCostPerMonth: 8 * current.seatCount,
      hiddenInfraCostPerMonth: 120,
      verificationHoursPerWeekPerSeat: 2.5,
      fullyLoadedHourlyRate: 85,
    }),
  },
  {
    key: "content-writing",
    label: "Content / writing tool",
    description: "Drafting assistants — lighter integration, still needs editorial onboarding.",
    apply: (current) => ({
      ...current,
      costPerSeatPerMonth: current.costPerSeatPerMonth || 30,
      oneTimeImplementationCost: 5000,
      usageBasedCostPerMonth: 12 * current.seatCount,
      hiddenInfraCostPerMonth: 80,
      verificationHoursPerWeekPerSeat: 4,
      fullyLoadedHourlyRate: 70,
    }),
  },
];
