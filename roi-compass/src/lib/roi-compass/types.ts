// --- Cost side ---
export interface CostInputs {
  seatCount: number;
  costPerSeatPerMonth: number;
  usageBasedCostPerMonth?: number; // token/API overage — added Phase 4
  hiddenInfraCostPerMonth?: number; // vector DB, orchestration, observability — Phase 4
  verificationHoursPerWeekPerSeat?: number; // human review time — Phase 4
  fullyLoadedHourlyRate?: number; // used to convert verification hours to $ — Phase 4
  /** Training, migration, integration, change management — recouped before payback. */
  oneTimeImplementationCost?: number;
}

// --- Value side ---
export type MetricUnit = "percent" | "seconds" | "count" | "score" | "currency";

export type DollarConversionMethod =
  | { type: "time_saved"; avgVolumePerMonth: number; hourlyValue: number }
  | { type: "conversion_lift"; avgVolumePerMonth: number; avgOrderValue: number }
  | { type: "deflection"; avgVolumePerMonth: number; costPerIncident: number }
  | { type: "manual"; dollarValuePerMonth: number };

export interface UXMetric {
  id: string;
  label: string;
  unit: MetricUnit;
  baselineValue: number;
  projectedValue: number;
  dollarConversionMethod: DollarConversionMethod;
  isCustom: boolean;
}

// --- J-Curve ---
export interface JCurveParams {
  dipDurationMonths: number; // how long the dip phase lasts
  dipSeverity: number; // 0–1, how deep the dip goes (0 = no dip, 1 = full negative)
  rampDurationMonths: number; // months to recover from dip to steady state
  steadyStateMultiplier: number; // >1 once compounding gains kick in (default 1.0)
}

// --- Mode & Scenario ---
export type CalculatorMode = "simple" | "advanced";
export type ScenarioType = "best" | "likely" | "worst";

export interface ScenarioAssumptions {
  jCurve: JCurveParams;
  adoptionRate: number; // 0–1, % of seats actively using the tool
}

// --- Output ---
export interface MonthlyProjection {
  month: number;
  cumulativeNetValue: number;
  monthlyNetValue: number;
}

export interface ROIResult {
  paybackMonth: number | null; // null if never pays back within projection window
  totalCostOverWindow: number;
  totalValueOverWindow: number;
  monthlyProjections: MonthlyProjection[];
}

export interface AdvancedROIResult {
  best: ROIResult;
  likely: ROIResult;
  worst: ROIResult;
}
