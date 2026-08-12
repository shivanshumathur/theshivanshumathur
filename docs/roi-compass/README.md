# AI ROI Compass

**A payback-timeline calculator for AI tool spend — built on the J-curve, not a spreadsheet fantasy.**

> Status: 🚧 In Progress · [Live demo →](/ai-lab/roi-compass/) · [Case study →](#) · [Build spec →](./SKILL.md)

---

## The Problem

Enterprises are spending heavily on AI tools — Claude, Cursor, Copilot, and dozens of others — with almost no rigor around whether that spend is paying off, or *when* it will.

The calculators that already exist make this worse, not better:

- **They're linear.** Every existing tool (DX, User Interviews, WRITER, PM Toolkit) assumes savings start accruing from day one. Real adoption follows a **J-curve**: a measurable productivity *dip* during rollout — driven by the learning curve, a "verification tax" on AI output, and pipeline adaptation — before any real uplift shows up. Teams that measure ROI at the dip conclude the tool failed. It didn't; they measured too early.
- **They undercount cost.** Most tools stop at seat price. Real AI spend is 50–80% *hidden* cost: token overages, orchestration tooling, vector infra, and — the one nobody models — the human time spent verifying and correcting AI output.
- **They stop at "hours saved."** Hours saved is a proxy, not a UX outcome. It says nothing about whether the product actually got *better* — task success rate, error rate, time-on-task, support deflection, CSAT/NPS.
- **They report false precision.** A single ROI percentage or a single "payback in 6 months" number hides the fact that real payback timelines vary wildly — published vendor case studies claim ~6-month payback; independent multi-industry benchmarks put realistic full payback at 5–6 *years* for at least half of firms. A serious calculator should show a range and say why.

**AI ROI Compass** is built to fix all four problems in one model: real cost (incl. hidden spend), a J-curve-adjusted timeline, UX/product metrics as the actual value signal, and a range instead of a false-precision point estimate.

---

## What Makes This Different

| | Typical AI ROI calculators | AI ROI Compass |
|---|---|---|
| Cost input | Seat price only | Seat + usage/token + hidden infra + verification time |
| Timeline | Linear, savings from month 1 | J-curve: dip → recovery slope → compounding gain |
| Value signal | "Hours saved" | Task success rate, error rate, time-on-task, support deflection, CSAT/NPS — each mapped to $ |
| Output | Single ROI % / single payback month | Best / likely / worst payback range with stated confidence |
| Depth | One-size-fits-all | Simple mode (fast, transparent) *and* Advanced mode (scenario bands, adjustable assumptions) |

---

## Core Features

### 1. Full-Stack Cost Modeling
Captures direct cost (per-seat, per-token/API) and indirect cost (orchestration, vector DB, observability, and — critically — human review/verification time), rather than defaulting to sticker price.

### 2. J-Curve Adoption Timeline
Models a configurable dip period (learning curve + verification tax) before productivity gains ramp in, instead of assuming savings start on day one. Payback date is calculated against the *realistic* curve, not a straight line.

### 3. UX & Product Metrics as ROI Inputs
Two entry paths:
- **Preset library** — task success rate, time-on-task, error/defect rate, support ticket deflection, CSAT/NPS delta, conversion lift — each with a default $-conversion methodology.
- **Custom metric fallback** — define your own metric, unit, and value formula for use cases the presets don't cover.

### 4. Simple / Advanced Mode
- **Simple mode:** transparent weighted formula → one clear number, fast, defensible in a 5-minute stakeholder conversation.
- **Advanced mode:** best / likely / worst scenario bands with adjustable confidence intervals → a payback *range*, for teams that need to pressure-test assumptions before a budget conversation.

---

## How It Works (Methodology)

```
Net Monthly Value = Σ(UX/Product metric deltas × $ conversion) − Total Monthly AI Cost

Total Monthly AI Cost = Seat cost + Usage/token cost + Hidden infra cost + Verification time cost

J-Curve Adjustment:
  Months 0–N (dip phase):   Net Value × dip_factor   (dip_factor < 1, often negative)
  Months N–M (recovery):    Net Value × ramp_factor   (ramp_factor: dip_factor → 1)
  Months M+ (compounding):  Net Value × 1.0+           (steady-state or growing)

Payback Month = first month where cumulative Net Monthly Value ≥ Total Investment
```

Advanced mode runs this three times (best/likely/worst assumption sets) and reports the spread, not just the midpoint.

---

## Tech Stack

- **Host:** Express static portfolio (`theshivanshumathur`) — route `/ai-lab/roi-compass/`
- **App:** Vite + React + TypeScript island (not a full Next.js rewrite of the site)
- **Styling:** Tailwind CSS
- **Calculation engine:** Client-side TS module under `roi-compass/src/lib/roi-compass/` — framework-agnostic (no React/Next imports)
- **Charting:** Recharts (from Phase 1)
- **Data:** No backend for v1 — session-local state; presets as static modules

> Stack note: The original skill assumed Next.js App Router. This portfolio is Express + static HTML, so ROI Compass ships as a Vite React island mounted at `/ai-lab/roi-compass/`. Pure calc logic stays portable if an API route is needed later.

---

## Roadmap

- [x] **v1 — Simple Mode MVP:** cost inputs, preset metric library, linear payback calc, single-number output
- [ ] **v2 — J-Curve Engine:** dip/recovery/compounding phases, configurable curve shape
- [ ] **v3 — Advanced Mode:** best/likely/worst scenario bands, confidence intervals, custom metric input
- [ ] **v4 — Hidden Cost Layer:** token/usage estimator, verification-time capture, infra cost presets by tool category
- [ ] **v5 — Shareable Reports:** exportable summary (PDF/link) for stakeholder/CFO conversations

Build phases map 1:1 to the [SKILL.md](./SKILL.md) Phase 0–5 checklist. Do not build ahead of the current phase.

---

## Why This Exists

Built as part of an ongoing exploration into enterprise AI governance and measurement — a companion to the [Four-Tier Human Oversight Framework](#) and [Design Sync](#) work. Where those focus on *how* AI gets governed and integrated, this focuses on *whether it's actually working* — with the rigor product and UX leaders need to make that case credibly.

---

## Local development

```bash
# from repo root
cd roi-compass && npm install && npm run dev
# → http://localhost:5174/ai-lab/roi-compass/

# or build into the portfolio and serve via Express
cd roi-compass && npm run build
cd .. && npm run dev
# → http://localhost:5173/ai-lab/roi-compass/
```

---

## License

TBD
