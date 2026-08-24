<!-- Generated from the component source. Do not edit; run `make generate`. -->

# core pack

General-purpose components and patterns — not tied to one domain.

## data-display

- [`<atk-chart>`](atk-chart.md) — Web Awesome themed ECharts visualization element.
  - Use when: Visualizing multi-series trends, clinical trial metrics, distributions, market shares, or comparative data in reports and dashboards.
- [`<atk-data-table>`](atk-data-table.md) — AG-Grid enterprise data table themed to brand tokens.
  - Use when: Displaying multi-column tabular data, clinical trial patient lists, gene expression matrices, or large datasets requiring sorting and filtering.
- [`<atk-go-ribbon>`](atk-go-ribbon.md) — Gene Ontology annotations for a gene or protein.
  - Use when: Showing GO annotations for one gene or protein, when the reader wants to see which functional categories are annotated at a glance.
- [`<atk-mermaid>`](atk-mermaid.md) — Lazy-loaded Mermaid.js flowchart and diagram renderer.
  - Use when: Visualizing clinical pathways, biochemical reaction cascades, software architectures, or procedural flowcharts in reports.
- [`<atk-metric>`](atk-metric.md) — A labelled value with its recent trend and normal range.
  - Use when: Showing one measurement that a reader needs to judge at a glance: is it normal, and which way is it moving. Lab results, system metrics, counts tracked over time.
- [`<atk-process>`](atk-process.md) — A numbered sequence of steps, connected in order.
  - Use when: Explaining a procedure, workflow, or "how to use this" sequence — lab protocols, a multi-step interaction model, an onboarding flow.
- [`<atk-sidenote>`](atk-sidenote.md) — A marginalia callout for contextual notes and references.
  - Use when: Highlighting secondary details, definitions, or reference notes alongside main paragraph text in scientific reports and documentation.
- [`<atk-step>`](atk-step.md) — A single numbered step in an atk-process sequence.
  - Use when: Specifying an individual step with a title and description inside an `<atk-process>`.
- [`<atk-timeline>`](atk-timeline.md) — A chronological milestone or pipeline timeline display.
  - Use when: Displaying multi-phase clinical trial progressions, drug development milestones, regulatory roadmaps, or chronological project history.
- [`<atk-timeline-item>`](atk-timeline-item.md) — A single milestone item in an atk-timeline.
  - Use when: Specifying an individual milestone with date, title, status, and description.
- [`record-list`](record-list.md) — A list of records, each with a name, a status, secondary detail, and a category.
  - Use when: Showing a set of similar records where each one has a name, some kind of status or severity, and a short supporting detail. Medicines, problems, alerts, tasks, findings, activity. Use it whenever the alternative would be a table with two or three columns.
- [`swot-grid`](swot-grid.md) — A real 2x2 quadrant grid for Strengths, Weaknesses, Opportunities, and Threats analysis.
  - Use when: Presenting a SWOT analysis in an entity or company dossier, strategy memo, or competitive assessment — anywhere the four categories are genuinely fixed and the reader expects a quadrant layout.
