import { describe, expect, it } from "vitest";
import { PRODUCT_NAME, PROJECTION_WINDOW_MONTHS } from "../constants";

describe("roi-compass phase 0 smoke", () => {
  it("exports named constants", () => {
    expect(PRODUCT_NAME).toBe("AI ROI Compass");
    expect(PROJECTION_WINDOW_MONTHS).toBe(24);
  });
});
