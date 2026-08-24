# Standard Hugo Markdown Report Templates

Use these standard layouts when writing or transforming reports in `atk-ui`: `docs`, `tabbed`, `dashboard`, `dossier`, `landing`, and the default (`single`/empty). Always declare your desired layout in YAML frontmatter instead of writing custom layout wrappers or HTML boilerplate.

The top navbar and footer are **not** part of any layout — they're the site
shell (`baseof.html`), driven by `hugo.toml`'s `[[menu.main]]`/`[[menu.footer]]`,
and appear on every page automatically.

---

## 1. Docsy Documentation (`layout: docs`)

**Best for:** Reference documentation, multi-page guides, technical dossiers organized as a section.
**Layout:** Left navigation tree, auto-built from the `content/docs/` folder hierarchy and each page's `weight` — add a page under `content/docs/`, it appears in the tree automatically, no config edit. Center reading column. **Right sticky "On This Page" TOC** generated from `##` headings. A previous/next pager at the bottom of the page, ordered by `weight` within the section.

Place the file under `content/docs/<section>/<page>.md`. Set `weight` in frontmatter to control its order among siblings; nest folders for sub-sections.

```markdown
---
title: "Target Dossier: Janus Kinase 1 (JAK1)"
layout: docs
date: 2026-08-20
tags: ["Immunology", "Kinase Inhibitors", "Target Dossier"]
icon: "dna"
---

<wa-callout variant="brand" appearance="subtle">
  <wa-icon slot="icon" name="circle-nodes"></wa-icon>
  <div class="wa-stack wa-gap-2xs">
    <strong>Executive Dossier & Technical Reference</strong>
    <span>Comprehensive synthesis of target biology, 3D macromolecular binding domains, approved therapies, and late-stage clinical trials.</span>
  </div>
</wa-callout>

## 1. Target Overview & Biology

Janus Kinase 1 (JAK1) is a critical tyrosine kinase mediating signal transduction down the JAK-STAT pathway across inflammatory and immune cascades.

<div class="wa-grid wa-gap-m" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-block: var(--wa-space-m);">
<wa-card appearance="filled-outlined">
<atk-metric label="Approved Drugs" value="12" unit="Therapeutics" low="1" high="20">
<script type="application/json">[8, 9, 10, 11, 12]</script>
FDA/EMA approved JAK inhibitors
</atk-metric>
</wa-card>

<wa-card appearance="filled-outlined">
<atk-metric label="Active Trials" value="55" unit="Studies" low="10" high="100">
<script type="application/json">[35, 42, 48, 51, 55]</script>
Phase II/III active evaluations
</atk-metric>
</wa-card>
</div>

## 2. Macromolecular Structure & 3D Binding

The human JAK1 kinase domain (JH1) is targeted by small-molecule ATP-competitive inhibitors.

<atk-molstar pdb-id="6SM8" height="420"></atk-molstar>

## 3. Approved Therapeutics & Pipeline

<atk-data-table title="JAK1 Clinical Landscape" page-size="5">
<script type="text/csv">
Drug,Sponsor,Selectivity,Status,Indication
Upadacitinib (Rinvoq),AbbVie,JAK1 Selective,Approved,Rheumatoid Arthritis / Atopic Derm.
Abrocitinib (Cibinqo),Pfizer,JAK1 Selective,Approved,Moderate-to-Severe Atopic Dermatitis
Filgotinib (Jyseleca),Galapagos,JAK1 Selective,Approved (EU/JP),Ulcerative Colitis
</script>
</atk-data-table>

## 4. Multi-Year Trial Timeline

<atk-timeline title="JAK1 Development Milestones">
<div class="step" data-status="complete">
<span class="date">2019</span>
<strong>First-in-Class Selective Approval</strong>
<p>FDA approves Upadacitinib for moderate-to-severe RA.</p>
</div>
<div class="step" data-status="active">
<span class="date">2026</span>
<strong>Next-Gen Dual Degraders</strong>
<p>Phase II PROTAC and allosteric selective inhibitors enter trial phase.</p>
</div>
</atk-timeline>
```

---

## 2. Executive Tabbed Briefing (`layout: tabbed`)

**Best for:** Multi-perspective executive summaries where stakeholders need to switch between Clinical, Device, Payer, and Strategic views without scrolling a massive page.

```markdown
---
title: "Sleep Apnea Strategic Market Intelligence"
layout: tabbed
date: 2026-08-20
tags: ["Executive Briefing", "Market Forecast", "Commercial Strategy"]
icon: "chart-pie"
---

<wa-callout variant="brand" appearance="subtle">
  <wa-icon slot="icon" name="circle-nodes"></wa-icon>
  <div class="wa-stack wa-gap-2xs">
    <strong>Executive Strategic Briefing</strong>
    <span>Multi-tab analysis of market valuation ($10.8B), GLP-1 combination therapies, and reimbursement policies.</span>
  </div>
</wa-callout>

<wa-tab-group>
<wa-tab panel="overview">
  <wa-icon name="chart-pie"></wa-icon> Overview & KPIs
</wa-tab>
<wa-tab panel="therapeutics">
  <wa-icon name="pills"></wa-icon> Therapeutics & Pipeline
</wa-tab>
<wa-tab panel="devices">
  <wa-icon name="microchip"></wa-icon> Device Ecosystem
</wa-tab>

<wa-tab-panel name="overview">

### Market Valuation & Key Metrics

<div class="wa-grid wa-gap-l" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin-block: var(--wa-space-m);">
<wa-card appearance="filled-outlined">
<atk-metric label="Market Size" value="10.8" unit="$ Billion" low="8.0" high="15.0">
<script type="application/json">[7.8, 8.5, 9.4, 10.1, 10.8]</script>
7.2% CAGR through 2033
</atk-metric>
</wa-card>
</div>

</wa-tab-panel>

<wa-tab-panel name="therapeutics">

### FDA Approved Drugs & Pipeline

<atk-data-table title="Sleep Apnea Therapeutics" page-size="5">
<script type="text/csv">
Asset,Sponsor,Mechanism,Status,Benchmark
Tirzepatide (Zepbound),Eli Lilly,Dual GLP-1/GIP Agonist,Approved,25.3 events/hr AHI reduction
AD109,Apnimed,Noradrenergic + Antimuscarinic,NDA Accepted,PDUFA Feb 28 2027
</script>
</atk-data-table>

</wa-tab-panel>

<wa-tab-panel name="devices">

### Hardware & Cloud Telemetry

<wa-card appearance="filled">
<strong slot="header">Positive Airway Pressure (CPAP / APAP)</strong>
<p>Gold-standard therapy with remote compliance streaming via cellular modems.</p>
</wa-card>

</wa-tab-panel>
</wa-tab-group>
```

---

## 3. Real-Time Executive KPI Dashboard (`layout: dashboard`)

**Best for:** Operational pipeline surveillance, portfolio health checks, and quarterly clinical metrics.

**For a single 0–100% completion KPI** (not a trend over time), prefer `<wa-progress-ring>` or `<wa-progress-bar>` over an `<atk-metric>` sparkline — `<atk-metric>` is for a value with history; the progress components are for a value with a target.

```markdown
---
title: "Clinical Trial Portfolio Surveillance Dashboard"
layout: dashboard
date: 2026-08-20
tags: ["Live Dashboard", "Portfolio KPIs", "Clinical Operations"]
icon: "chart-line"
---

<wa-callout variant="brand" appearance="subtle">
  <wa-icon slot="icon" name="circle-nodes"></wa-icon>
  <div class="wa-stack wa-gap-2xs">
    <strong>Clinical Operations Surveillance Dashboard</strong>
    <span>Active monitoring across 42 clinical studies, patient enrollment targets, and milestone delivery.</span>
  </div>
</wa-callout>

## Key Operational Metrics

<div class="wa-grid wa-gap-l" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin-block: var(--wa-space-m);">
<wa-card appearance="filled-outlined">
<atk-metric label="Active Studies" value="42" unit="Trials" low="20" high="60">
<script type="application/json">[30, 34, 38, 40, 42]</script>
8 Global Phase III trials
</atk-metric>
</wa-card>

<wa-card appearance="filled-outlined">
<atk-metric label="Enrollment Rate" value="89.4" unit="%" low="70" high="100">
<script type="application/json">[72.1, 78.4, 83.0, 87.2, 89.4]</script>
On track for Q4 milestone
</atk-metric>
</wa-card>
</div>

## Clinical Milestone Progression

<atk-timeline title="2026–2027 Pipeline Deliverables">
<div class="step" data-status="complete">
<span class="date">Q1 2026</span>
<strong>Phase II Data Readout</strong>
<p>Primary endpoint met with statistical significance (p &lt; 0.001).</p>
</div>
<div class="step" data-status="active">
<span class="date">Q3 2026</span>
<strong>Global Phase III Initiation</strong>
<p>Site recruitment initiated across 12 countries.</p>
</div>
</atk-timeline>
```

---

## 4. Comparative Evaluation (`wa-grid`, no dedicated layout)

**Best for:** Head-to-head asset comparisons (*Drug A vs. Drug B*), 3D Structure + Sequence alignment, or Pre-clinical vs. Clinical side-by-side data.

There is no dedicated `layout: split` — use the default layout (leave `layout` empty, or set `single`) and lay two `<wa-card>` elements out yourself with `wa-grid`. For a genuinely interactive two-pane comparison with a draggable divider, `<wa-split-panel>` is the real component — see its reference in the `webawesome` skill — but that needs exactly two named slots (`slot="start"`/`slot="end"`), so prefer the plain grid below unless you specifically want the drag interaction.

```markdown
---
title: "Comparative Evaluation: Tirzepatide vs. AD109"
date: 2026-08-20
tags: ["Head-to-Head", "Comparative Evaluation", "Sleep Apnea"]
icon: "scale-balanced"
---

<div class="wa-grid wa-gap-l" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">

<wa-card appearance="outlined">
<div class="wa-split" slot="header">
  <strong>💊 Tirzepatide (Zepbound)</strong>
  <wa-badge variant="brand">Approved (Dec 2024)</wa-badge>
</div>
<div class="wa-stack wa-gap-s">
  <p><strong>Mechanism:</strong> Dual GLP-1 / GIP receptor co-agonist.</p>
  <p><strong>Primary Efficacy:</strong> -25.3 events/hr mean reduction in AHI via weight loss and pharyngeal fat debulking.</p>
  <p><strong>Patient Population:</strong> Moderate-to-severe OSA with obesity (BMI &ge; 30).</p>
  <p><strong>Route of Admin:</strong> Once-weekly subcutaneous injection.</p>
</div>
</wa-card>

<wa-card appearance="outlined">
<div class="wa-split" slot="header">
  <strong>💊 AD109 (Aroxybutynin / Atomoxetine)</strong>
  <wa-badge variant="warning">PDUFA Feb 28, 2027</wa-badge>
</div>
<div class="wa-stack wa-gap-s">
  <p><strong>Mechanism:</strong> Noradrenergic + antimuscarinic oral combination.</p>
  <p><strong>Primary Efficacy:</strong> Direct neuromuscular activation of upper airway genioglossus dilator muscle tone during sleep.</p>
  <p><strong>Patient Population:</strong> Mild-to-severe OSA regardless of BMI phenotype.</p>
  <p><strong>Route of Admin:</strong> Once-daily oral capsule before bedtime.</p>
</div>
</wa-card>

</div>
```

---

## 5. Standard Scientific Report (`single` / default)

**Best for:** A straightforward, linear write-up — a literature summary, a single-topic brief — with no need for tabs, dashboards, or side-by-side comparison.

**Layout:** Optimal reading width, breadcrumbs, and a metadata strip. No left nav, no TOC unless the page has enough `##` headings to warrant one.

```markdown
---
title: "Obesity and Pharyngeal Fat Redistribution: A Brief"
date: 2026-08-20
tags: ["Obesity", "Sleep Apnea", "Mechanism"]
icon: "notes-medical"
---

<wa-callout variant="brand" appearance="subtle">
  <wa-icon slot="icon" name="circle-nodes"></wa-icon>
  <span>Incretin mimetics produce significant weight-loss-dependent debulking of soft tissue structures surrounding the pharynx, particularly the base of the tongue and lateral pharyngeal fat pads.</span>
</wa-callout>

## Pathophysiology & Anatomical Fat Redistribution

Incretin mimetics produce significant weight-loss-dependent debulking of soft tissue structures surrounding the pharynx, particularly the base of the tongue and lateral pharyngeal fat pads, which reduces upper airway collapsibility during sleep.

<atk-sidenote>
Pharyngeal fat volume, not neck circumference alone, is now understood to be the better predictor of OSA severity in obese patients.
</atk-sidenote>

## Summary

<wa-card appearance="filled-outlined">
<p>Weight-loss-driven pharyngeal debulking is mechanistically distinct from — and additive to — the neuromuscular mechanisms targeted by oral OSA therapeutics.</p>
</wa-card>
```

---

## 6. Company & Entity Intelligence Dossier (`layout: dossier`)

**Best for:** In-depth, 3,000–8,000 word single-entity research reports mixing financial history, SWOT analysis, risk register, legal entity mapping, citable claims, and estimated vs. disclosed metrics.

### Frontmatter Schema
```yaml
---
title: "Company Name: Strategic & Financial Dossier"
subtitle: "One-line thesis statement or market positioning lede"
layout: dossier
date: 2026-08-20
as_of_date: "Q3 2025"
sector: "Digital Health / Biotechnology"
hq_location: "San Francisco, CA"
founding_year: "2010"
legal_status: "Delaware C-Corp / Multi-Entity"
confidence_rating: "High (Disclosed)"
icon: "building-columns"

source_classes:
  - "SEC Form 10-K / Form D"
  - "IRS Form 990 Disclosures"
  - "Proprietary Advisory Benchmarks"

key_facts:
  - label: "Founding Year"
    value: "2010 (San Francisco, CA)"
  - label: "Estimated Core Headcount"
    value: "~45 FTEs"
    estimated: true
    note: "Derived from LinkedIn & operational benchmarks"
  - label: "Cumulative Capital"
    value: "$2.4B"
    source: 1

entities:
  - name: "Operating Corp LLC"
    type: "Operating Entity"
    jurisdiction: "Delaware"
    disclosed: "Financial audits and commercial filings"
    sources: [1, 2]

swot:
  strengths:
    - "**Brand Equity:** Market leadership in core therapeutic sector {{< cite 1 >}}."
  weaknesses:
    - "**Early-Stage Concentration:** High dependency on venture funding cycles."
  opportunities:
    - "**AI Platform Expansion:** Cross-portfolio digital telemetry adoption."
  threats:
    - "**Macro Headwinds:** Regulatory and interest rate contraction."

risks:
  - risk: "Venture Liquidity Compression"
    category: "Macro / Financial"
    severity: "High"
    likelihood: "Moderate"
    impact: "Delayed fund distributions."
    mitigation: "Secondary M&A strategy."

sources:
  - id: 1
    title: "Annual Regulatory & Venture Filing"
    url: "https://sec.gov"
    publisher: "US Securities and Exchange Commission"
    date: "2025-10-02"
    type: "SEC Filing"
---
```

### Available Shortcodes:
- `{{< key-facts >}}` — Renders the structured key facts table from frontmatter.
- `{{< cite 1 2 >}}` — Superscript clickable citation badges mapped to the sources list.
- `{{< estimated "$14.5M" "Methodology note" >}}` — Inferred data badge with amber styling and hover explanation.
- `{{< swot >}}` — Real **2x2 visual quadrant grid** (Strengths / Weaknesses / Opportunities / Threats).
- `{{< entity-map >}}` — Multi-entity legal disclosure map.
- `{{< risk-register >}}` — Severity/Likelihood risk matrix table.

---

## 7. Marketing Landing Page (`layout: landing`)

**Best for:** A platform or portfolio's own front page — not a report. Use this only when the page's job is to introduce and link elsewhere, not to present findings.

Driven entirely by frontmatter, not body content — there is no left nav or TOC on this layout.

```yaml
---
title: "Oncology Precision Intelligence Platform"
subtitle: "One-line description of what this platform does."
layout: landing
date: 2026-08-21
badge: "Platform Intelligence Hub"
icon: "globe"

cta_primary:
  label: "Explore Target Pipeline"
  url: "#pipeline"
  icon: "pills"
cta_secondary:
  label: "Device Ecosystem"
  url: "#devices"
  icon: "microchip"
cta_tertiary:
  label: "Market Analytics"
  url: "#market"
  icon: "chart-line"
---
```

The body's `##` sections become anchor targets for the CTA links above (`#pipeline`, `#devices`, `#market`) — pick section headings that match the anchors you declare.
