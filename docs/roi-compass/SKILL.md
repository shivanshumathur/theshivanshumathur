# skill.md — AI ROI Compass Build Spec

**Purpose:** This file is the engineering spec for building AI ROI Compass in Cursor. It is written to be fed to Cursor phase by phase — do not build ahead of the current phase, and do not skip acceptance criteria. Each phase should end in a working, demoable state before moving to the next.

Companion doc: [`README.md`](./README.md) (product framing, problem statement, methodology overview).

---

## 0. Ground Rules for Cursor

1. **Work phase by phase.** Complete Phase 0 fully (including acceptance criteria) before starting Phase 1. Never build Phase 3 UI while Phase 2 calculation logic is unfinished.
2. **Calculation logic is framework-agnostic.** Everything in `roi-compass/src/lib/roi-compass/` must be pure TypeScript — no React imports, no Next.js/Vite imports. This keeps it unit-testable and portable if this ever needs a server-side API route.
3. **Types first.** Whenever a phase introduces new data, update `types.ts` before writing the function or component that uses it.
4. **No silent defaults.** If a calculation needs an assumption (e.g. "verification tax = 20%"), it must live in `constants.ts` as a named, commented constant — never a magic number inline.
5. **Every phase ships a visible UI state**, even if rough. Don't build three phases of calc logic with no UI to see it — validate as you go.
6. **Commit at the end of each phase** with a message matching the phase name (e.g. `feat: phase 1 — simple mode MVP`).

---

## 1. Tech Stack & Conventions

- **Host:** Express portfolio — live route `/ai-lab/roi-compass/`
- **App:** Vite + React + TypeScript (island under `roi-compass/`; builds into `src/ai-lab/roi-compass/`)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **State:** React state / context — no external state library needed for v1 (no backend, no persistence beyond session)
- **File naming:** `PascalCase.tsx` for components, `camelCase.ts` for logic/utils
- **Folder structure:**

```
/roi-compass
  index.html
  package.json
  vite.config.ts
  /src
    main.tsx                   → Vite entry
    App.tsx                    → app shell / page composition
    index.css                  → Tailwind entry
    /components/roi-compass/
      ModeToggle.tsx
      CostInputForm.tsx
      MetricInputForm.tsx
      MetricPresetPicker.tsx
      JCurveChart.tsx
      ResultsSummary.tsx
      ScenarioComparison.tsx
      ShareExport.tsx
    /lib/roi-compass/
      types.ts
      constants.ts
      calculations.ts
      jcurve.ts
      scenarios.ts
      hiddenCosts.ts
      presets/
        metrics.ts
        costTemplates.ts
      __tests__/
        calculations.test.ts
        jcurve.test.ts
        scenarios.test.ts
        smoke.test.ts          → Phase 0 placeholder
```

> Path note: The original Next.js `/app/ai-lab/roi-compass/page.tsx` shape is mapped to `roi-compass/src/App.tsx` because this portfolio is Express + static HTML, not App Router.

---

## 2. Core Data Models (`lib/roi-compass/types.ts`)

Define these before Phase 1 begins. Extend (don't rewrite) as later phases need more fields.

```typescript
// --- Cost side ---
export interface CostInputs {
  seatCount: number;
  costPerSeatPerMonth: number;
  usageBasedCostPerMonth?: number;      // token/API overage — added Phase 4
  hiddenInfraCostPerMonth?: number;     // vector DB, orchestration, observability — Phase 4
  verificationHoursPerWeekPerSeat?: number; // human review time — Phase 4
  fullyLoadedHourlyRate?: number;       // used to convert verification hours to $ — Phase 4
}

// --- Value side ---
export type MetricUnit = "percent" | "seconds" | "count" | "score" | "currency";

export interface UXMetric {
  id: string;
  label: string;
  unit: MetricUnit;
  baselineValue: number;
  projectedValue: number;
  dollarConversionMethod: DollarConversionMethod;
  isCustom: boolean;
}

export type DollarConversionMethod =
  | { type: "time_saved"; avgVolumePerMonth: number; hourlyValue: number }
  | { type: "conversion_lift"; avgVolumePerMonth: number; avgOrderValue: number }
  | { type: "deflection"; avgVolumePerMonth: number; costPerIncident: number }
  | { type: "manual"; dollarValuePerMonth: number };

// --- J-Curve ---
export interface JCurveParams {
  dipDurationMonths: number;     // how long the dip phase lasts
  dipSeverity: number;           // 0–1, how deep the dip goes (0 = no dip, 1 = full negative)
  rampDurationMonths: number;    // months to recover from dip to steady state
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
```

---

## Phase 0 — Project Scaffolding

**Goal:** Empty but running calculator page, wired into the existing portfolio, with the folder structure and types in place.

**Tasks:**
1. Create Vite React app entry that renders a title + placeholder at `/ai-lab/roi-compass/`.
2. Create the full `components/roi-compass/` and `lib/roi-compass/` folder structure per Section 1 (empty files with just exports are fine for now).
3. Add `types.ts` with the full model from Section 2.
4. Add `constants.ts` with placeholder named constants (see Phase 1 for the first real ones).
5. Set up Vitest with a trivial placeholder test.
6. Wire Express so `/ai-lab/roi-compass` is served from the built island and is **excluded** from AI Lab COEP/`SharedArrayBuffer` headers (those break a normal React page).

**Acceptance criteria:**
- [ ] `/ai-lab/roi-compass` route loads with no console errors
- [ ] `types.ts` compiles with no TS errors
- [ ] Test runner executes a trivial placeholder test successfully
- [ ] Folder structure matches Section 1 exactly

---

## Phase 1 — Simple Mode MVP

**Goal:** A working single-number calculator. User enters basic cost + one or more UX metrics, sees a monthly payback timeline (linear, no J-curve yet) and a single payback month.

**Constants to add (`constants.ts`):**
```typescript
export const PROJECTION_WINDOW_MONTHS = 24; // how far ahead we calculate before giving up
```

**Logic to build (`calculations.ts`):**
- `convertMetricToDollarValue(metric: UXMetric): number` — applies the `dollarConversionMethod` to return a $/month value. Implement all four conversion types from Section 2.
- `calculateTotalMonthlyCost(costs: CostInputs): number` — Phase 1 only uses `seatCount × costPerSeatPerMonth` (ignore optional Phase 4 fields if undefined).
- `calculateTotalMonthlyValue(metrics: UXMetric[]): number` — sum of `convertMetricToDollarValue` across all metrics.
- `runSimpleProjection(costs: CostInputs, metrics: UXMetric[]): ROIResult` — linear month-over-month projection (no J-curve applied yet), find first month where cumulative net value ≥ 0. This is the "payback month."

**Preset metrics (`presets/metrics.ts`):**
Ship at least these five as selectable presets, each with a sensible default `dollarConversionMethod`:
1. Task success rate (`percent`, `time_saved`)
2. Time on task (`seconds`, `time_saved`)
3. Error / defect rate (`percent`, `deflection`)
4. Support ticket deflection (`count`, `deflection`)
5. CSAT/NPS delta (`score`, `manual` — hard to auto-convert, default to manual $ entry)

**Components to build:**
- `CostInputForm.tsx` — seat count, cost per seat. Simple, no hidden-cost fields yet (those come Phase 4 — but leave visual room / don't hardcode assumptions that block extension).
- `MetricPresetPicker.tsx` — pick from the 5 presets above, or add a custom metric (custom = `isCustom: true`, uses `manual` conversion by default).
- `MetricInputForm.tsx` — baseline value + projected value per selected metric.
- `ResultsSummary.tsx` — shows payback month, total cost, total value over the projection window, in plain language ("Pays back in month 7").
- `JCurveChart.tsx` — build now but feed it linear data (no dip yet); this avoids a rework in Phase 2.
- Wire all of the above into `App.tsx`.

**Acceptance criteria:**
- [ ] User can input cost + at least one preset metric and get a payback month
- [ ] User can add a custom metric with manual $ value and see it reflected in the total
- [ ] Chart renders a monthly cumulative value line
- [ ] `calculations.test.ts` covers: zero-cost edge case, never-pays-back edge case (value < cost every month), and a known-good scenario with a hand-calculated expected payback month
- [ ] No J-curve behavior yet — confirm the line is straight/linear

---

## Phase 2 — J-Curve Adoption Engine

**Goal:** Replace the linear projection with a J-curve-adjusted one. This is the core differentiator — do not rush it.

**Constants to add:**
```typescript
export const DEFAULT_JCURVE: JCurveParams = {
  dipDurationMonths: 2,
  dipSeverity: 0.4,        // during the dip, net value is reduced by 40% (can go negative if cost > discounted value)
  rampDurationMonths: 3,
  steadyStateMultiplier: 1.1, // 10% compounding uplift once fully ramped
};
```

**Logic to build (`jcurve.ts`):**
- `getJCurveMultiplier(month: number, params: JCurveParams): number` — returns the multiplier to apply to that month's *raw* net value:
  - During `dipDurationMonths`: multiplier = `1 - dipSeverity` (a partial or full offset of gains — this is what produces the "dip")
  - During the ramp window (from end of dip to `dipDurationMonths + rampDurationMonths`): linearly interpolate multiplier from `(1 - dipSeverity)` up to `1.0`
  - After ramp: multiplier = `steadyStateMultiplier`
- `applyJCurve(rawMonthlyValues: number[], params: JCurveParams): number[]` — maps the multiplier function over each month.
- Update `runSimpleProjection` → rename conceptually or add `runJCurveProjection(costs, metrics, jCurveParams): ROIResult` that applies `applyJCurve` to the raw monthly *value* (not cost — cost is assumed to start immediately and fully, since you pay for seats whether or not people have ramped up).

**Components to update:**
- `JCurveChart.tsx` — now show the actual dip visually (the line should dip before recovering — this is the single most important visual in the whole product, spend real design time here: annotate the dip/ramp/compound phases directly on the chart).
- Add a `JCurveControls.tsx` (or fold into `CostInputForm.tsx`) letting users adjust `dipDurationMonths`, `dipSeverity`, `rampDurationMonths` — with `DEFAULT_JCURVE` pre-filled so it works out of the box without tuning.
- `ResultsSummary.tsx` — update copy to explain *why* payback might be later than a naive calculation would suggest ("Includes a 2-month adoption dip").

**Acceptance criteria:**
- [ ] Chart visibly dips before recovering, matching input params
- [ ] `jcurve.test.ts` covers: multiplier at month 0 (should equal `1 - dipSeverity`), multiplier mid-ramp (should be strictly between dip and 1.0), multiplier after ramp (should equal `steadyStateMultiplier`)
- [ ] Payback month with default J-curve params is later than or equal to the Phase 1 linear payback month for the same inputs (sanity check — the dip should never make payback *faster*)
- [ ] Adjusting dip severity to 0 reproduces the Phase 1 linear result (regression check that J-curve is a strict generalization, not a separate code path)

---

## Phase 3 — Advanced Mode (Scenario Bands)

**Goal:** Add a mode toggle. Advanced mode runs three scenarios (best/likely/worst) and shows a range instead of one number.

**Logic to build (`scenarios.ts`):**
- `SCENARIO_PRESETS: Record<ScenarioType, ScenarioAssumptions>` — three variants of J-curve + adoption rate, e.g.:
  - `best`: shorter/shallower dip, 90% adoption
  - `likely`: `DEFAULT_JCURVE`, 70% adoption
  - `worst`: longer/deeper dip, 40% adoption
- `runAdvancedProjection(costs, metrics, scenarios: Record<ScenarioType, ScenarioAssumptions>): AdvancedROIResult` — runs `runJCurveProjection` three times, additionally scaling raw monthly value by each scenario's `adoptionRate` before applying the J-curve multiplier.

**Components to build:**
- `ModeToggle.tsx` — Simple / Advanced switch at the top of the page.
- `ScenarioComparison.tsx` — side-by-side or overlaid chart of all three scenario lines, plus a summary table (payback month per scenario).
- Update `ResultsSummary.tsx` to branch: Simple mode shows one number, Advanced mode shows the range ("Payback: 5–11 months, most likely month 7").
- Advanced mode should expose the underlying scenario assumptions (dip severity, adoption rate, etc.) as editable — Simple mode should hide this complexity entirely.

**Acceptance criteria:**
- [ ] Toggling modes doesn't lose the user's cost/metric inputs — only the calculation depth changes
- [ ] Advanced mode renders three distinct lines on the chart, clearly labeled
- [ ] `scenarios.test.ts` confirms `best` payback month ≤ `likely` payback month ≤ `worst` payback month for the same base inputs (ordering sanity check)
- [ ] Editing a scenario's assumptions live-updates that scenario's line without recalculating the other two unnecessarily (basic perf sanity, not a hard requirement)

---

## Phase 4 — Hidden Cost Layer

**Goal:** Expand cost inputs beyond seat price to match the "50–80% of AI spend is hidden" thesis from the README.

**Logic to build (`hiddenCosts.ts`):**
- `calculateVerificationCost(costs: CostInputs): number` — `seatCount × verificationHoursPerWeekPerSeat × 4.33 × fullyLoadedHourlyRate`
- Update `calculateTotalMonthlyCost` to sum: seat cost + `usageBasedCostPerMonth` + `hiddenInfraCostPerMonth` + `calculateVerificationCost`
- `presets/costTemplates.ts` — starter templates for common tool categories (e.g. "Coding assistant," "Design/UX tool," "Content/writing tool") with sensible defaults for hidden infra cost and typical verification hours, so users aren't starting from a blank field.

**Components to build/update:**
- `CostInputForm.tsx` — add collapsible "Show hidden costs" section with the new fields, defaulting to a picked cost template if the user selects a tool category.
- `ResultsSummary.tsx` / new `CostBreakdown.tsx` — a stacked bar or donut showing seat cost vs usage vs infra vs verification time, so the "hidden cost" story is visually obvious, not just a bigger number.

**Acceptance criteria:**
- [ ] Selecting a cost template pre-fills hidden cost fields, which remain editable
- [ ] Cost breakdown visual clearly shows verification time as a distinct, often-large slice
- [ ] Payback month recalculates correctly (later) when hidden costs are added vs. seat-only cost
- [ ] All Phase 1–3 tests still pass with hidden cost fields left `undefined` (must degrade gracefully, not error)

---

## Phase 5 — Shareable Reports

**Goal:** Let a user export/share their result for a stakeholder or CFO conversation — this is the "so what" moment of the whole tool.

**Tasks:**
1. `ShareExport.tsx` — generate a clean, presentation-ready summary view (inputs used + chart + payback range + cost breakdown) suitable for screenshotting or printing to PDF.
2. Add a "Copy shareable link" feature that encodes current inputs into the URL query string (no backend needed — pure client-side state serialization) so a link reproduces the exact scenario.
3. Optional stretch: "Export as PDF" using a client-side PDF library, styled to match the portfolio's visual identity.

**Acceptance criteria:**
- [ ] Shareable link round-trips correctly (open link in new tab → same inputs and result appear)
- [ ] Export view has no interactive controls visible — it's a clean, static-looking summary
- [ ] Print/PDF output is legible at standard page width, no cut-off charts

---

## Testing Strategy Summary

- `lib/roi-compass/` must have unit test coverage for every exported function before its consuming phase is marked complete.
- Every phase's acceptance criteria includes at least one regression check against the previous phase's behavior (see Phase 2 and Phase 4 examples) — this is intentional. The calculation engine should be a strict superset at each phase, not a rewrite.
- No snapshot testing needed for charts — assert on the underlying data arrays instead (`JCurveChart` should receive already-correct data; test `jcurve.ts`, not the chart).

---

## Design Notes for Cursor

- Match the existing portfolio's design tokens/typography — don't introduce a new visual system for this tool.
- The J-curve chart (Phase 2 onward) is the single most important visual asset in this product — treat it as a first-class design surface, not a default Recharts line chart. Annotate phases directly on the chart (dip / ramp / compounding) when reasonable.
- Simple mode should feel like it takes under a minute to fill out. If Simple mode ever feels like it's asking Advanced-mode questions, that's a bug in the phase boundary, not just a UX nit.

---

## Out of Scope for v1 (do not build unless explicitly asked)

- User accounts / saved calculations server-side
- Multi-currency support
- Team/org-wide dashboards
- Integrations with actual usage data (e.g. pulling real token spend from an API)
