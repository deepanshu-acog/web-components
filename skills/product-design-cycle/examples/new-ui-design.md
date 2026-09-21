# Worked Example: New UI Design

**Request:** "Design a page where a lab tech can see the status of all running instrument batches and drill into one."

**Stage 0 — Triage:** Not a prose-plus-provenance dossier (no generated summary/sources involved) — this is operational monitoring UI. Full cycle applies; no handoff to `aganitha-ui-ux-design-cycle` needed.

**Stage 1 — UI Vision:** An internal monitoring surface for lab technicians. Not a public dashboard, not a scientific-evidence artifact. Constraint: ATK UI was referenced by the requester but is not accessible in this session — noted explicitly, falling back to Web Awesome's own documented defaults.

**Stage 1.5 — Design Alignment Checklist:**
- Visual direction: ● Scientific enterprise (Aganitha default)
- Information density: ● Dense — deviates from the Medium default because this is expert, high-frequency monitoring, not typical SaaS (per the density rule)
- Layout structure: ● Master-detail — task-driven (browse-then-inspect), not defaulted
- Responsive behavior: ● Desktop-primary — internal ops tool, Aganitha default
- Accessibility requirements: ● Standard WCAG 2.1 AA (floor, always)
- Important actions: ● Single primary action per batch (drill in) — a monitoring view, not a multi-action console
- Scientific/data visualization needs: ● Native Web Awesome charts, if a failure-trend view is added later — none needed for the base view
- *(Navigation complexity and data-heavy/content-heavy skipped — single page, and "data-heavy" is already established by the vision statement, so restating it here adds nothing.)*

**Stage 2 — UX Spec:**
- Primary user: lab tech monitoring several batches at once — inferred directly from "see the status of all running batches."
- Task: (1) spot which batch needs attention now, (2) drill into one batch's detail.
- States: running / completed / failed / awaiting-input — inferred as the minimum set for "instrument batch status"; confirmed rather than assumed silently, since a wrong state model here has real operational consequences — this crosses the "ask" threshold. [Would ask: "What are the actual batch states in your system — running/completed/failed/awaiting-input, or does your system track others?"]

**Stage 3 — UX Design:** This is the one case where "monitor several independent things at a glance" genuinely fits a dashboard — Stage 4's dashboard-layout rule applies as an exception, not the default. Master-detail: a status grid (list) plus a detail panel, not a separate page per batch, since the tech needs to keep the whole-batch context while inspecting one (comparison/monitoring task, per the layout-selection rule).

**Stage 4 — UI Design:** Layout: master-detail, two-panel on desktop. Status uses Web Awesome semantic tokens (`success`/`warning`/`danger`/neutral for awaiting-input) — not a custom color per state. Density: dense — this is an expert, high-frequency-use monitoring screen, explicitly not a sparse consumer layout. Responsive: two-panel desktop → the detail panel becomes a full-screen push on tablet/mobile rather than being squeezed into a narrow column.

**Stage 5 — Presentation:** The batch list is a table (compare-across-rows, exact task match), not a card grid — a card grid here would be the "over-carding" anti-slop failure, adding scan cost with no information gain. If a historical trend of failures over time is wanted later, that's a line chart (trend), not a dashboard metric tile.

**Stage 6 — Verification:** States checked against the confirmed list (not the assumed one). Contrast checked against Web Awesome's semantic token pairings. No custom components needed — grid, detail panel, and status tokens all map to existing Web Awesome primitives; this is noted explicitly as "no custom extension required" rather than silently building one anyway.

**What this skill changed vs. jumping straight to markup:** the batch-state model was treated as a real "ask" trigger instead of a guessed detail, because getting it wrong has operational consequences — and the dashboard layout was deliberately justified as the correct exception to the "don't default to dashboards" rule, rather than either defaulting to it or avoiding it reflexively.
