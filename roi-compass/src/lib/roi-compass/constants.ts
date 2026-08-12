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

export const PRODUCT_NAME = "AI ROI Compass";

export const PRODUCT_TAGLINE =
  "A payback-timeline calculator for AI tool spend — built on the J-curve, not a spreadsheet fantasy.";

/** Default starter costs so Simple mode is fillable in under a minute. */
export const DEFAULT_COST_INPUTS = {
  seatCount: 25,
  costPerSeatPerMonth: 40,
} as const;
