/**
 * Named assumptions for AI ROI Compass.
 * Every calculation assumption lives here — never as a magic number inline.
 */

/** How far ahead we calculate before giving up on payback. */
export const PROJECTION_WINDOW_MONTHS = 24;

/** Seconds in an hour — used when converting time-on-task deltas to hours. */
export const SECONDS_PER_HOUR = 3600;

/**
 * When a percent metric uses time_saved conversion, each improved task instance
 * is valued as this many hours of labor (rework / recovery avoided).
 */
export const TIME_SAVED_HOURS_PER_IMPROVED_TASK = 1;

/**
 * Average weeks per month — used to convert weekly verification hours to monthly $.
 * Named constant (not a magic 4.33 inline).
 */
export const WEEKS_PER_MONTH = 4.33;

export const PRODUCT_NAME = "AI ROI Compass";

export const PRODUCT_TAGLINE =
  "A payback-timeline calculator for AI tool spend — built on the J-curve, not a spreadsheet fantasy.";

/** Default starter costs so Simple mode is fillable in under a minute. */
export const DEFAULT_COST_INPUTS = {
  seatCount: 25,
  costPerSeatPerMonth: 40,
} as const;

/**
 * Default J-curve adoption shape.
 * Dip reduces realized value (not cost); ramp recovers to 1.0; then compounding uplift.
 */
export const DEFAULT_JCURVE = {
  dipDurationMonths: 2,
  dipSeverity: 0.4, // during the dip, value is reduced by 40%
  rampDurationMonths: 3,
  steadyStateMultiplier: 1.1, // 10% compounding uplift once fully ramped
} as const;
