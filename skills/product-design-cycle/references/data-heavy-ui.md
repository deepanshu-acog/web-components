# Stage 5: Presentation — Data-Heavy & Scientific Content

**Purpose:** Decide how each content/data type is actually shown, based on the user's task and the nature of the information — not a default template applied uniformly.

**Do not automatically turn dense content into a dashboard, a card grid, or a table.** Each content type below gets its own reasoning.

## Handoff check, first

If the deliverable is a **prose synthesis paired with structured data, sources, and absence semantics** (an evidence artifact, a research dossier, a case summary that must show where every claim came from) — stop here and hand off to `aganitha-ui-ux-design-cycle`. That skill owns provenance classing, absence semantics, and per-figure visualization-safety decisions for that specific content shape, and this skill should not re-derive them. This skill's presentation guidance below is for general product UI — tables, metadata, files, images — not for provenance-bearing scientific claims.

## Content-type presentation rules

- **Tables.** Use when the user's task is compare-across-rows or scan-for-a-specific-value. A table with more columns than fit a comfortable read width needs column prioritization (primary columns visible, secondary columns behind a toggle/expand), not horizontal scroll as the default answer.
- **Metadata.** Secondary to the primary content — a labeled key/value list or a compact side rail, not competing visually with the main content. Don't turn three or four metadata fields into their own card grid.
- **Charts.** See "Deciding whether and how to visualize" below.
- **Images.** Full content when the image *is* the content (a figure, a diagram); thumbnail-plus-expand when it's supporting/secondary.
- **Long-form content.** Constrained reading width, real typographic hierarchy (headings, not bolded paragraphs), not crammed into a narrow card or sidebar.
- **References / evidence / structured outputs / files.** A plain list with clear labels and access affordances (open/download), not a decorative card per item unless each item genuinely needs a distinct visual identity (e.g., different file type icons carrying real information).
- **Empty states.** Every list/table/search result needs an explicit empty state — never a bare blank area. These are three different states with three different jobs; don't collapse them into one generic message:
  - **Zero results.** The user did something (searched, filtered) and got nothing back. State what was searched/filtered and offer a clear way to undo or broaden it ("No clients match this filter — clear filters"). Don't apologize; this isn't an error.
  - **First-run / onboarding (nothing added yet).** Nothing exists here yet because the user hasn't created anything. Explain what this space is for and give a primary CTA to create the first item ("No batches yet — start your first batch"). This is a teaching moment, not a dead end — treat it as part of onboarding, not an afterthought.
  - **Error.** The data couldn't load. State that plainly, distinguish a retryable failure from one that isn't, and give a concrete next action (retry button, contact/support link) rather than a generic "something went wrong."
- **Microcopy.** Button labels, form field labels/placeholders, error/validation text, empty-state copy, confirmation and toast messages, and tooltip text are a Stage 5 content type in their own right — they don't default to placeholder text ("Submit", "Error occurred") left for someone else to fill in later. Decide microcopy against the actual action/state it names: a button label states the action's result in a verb + object ("Save changes", not "OK"); a destructive action's label and any confirmation text should make the consequence explicit ("Delete 3 clients — this can't be undone", not "Are you sure?"); error/validation text says what's wrong and how to fix it, not just that something failed. Validation timing: validate on blur/submit for most fields, not on every keystroke — inline-per-keystroke validation is reserved for cases with a genuine real-time payoff (password strength, character-count limits), since keystroke-level errors on ordinary fields read as the interface scolding the user before they've finished typing.

## Deciding whether and how to visualize

Before choosing a chart type, answer:

1. **Is this actually the kind of thing a chart clarifies?** A single number, a short list, or a two-item comparison usually doesn't need a chart — stating it in a sentence, or a compact table, is often clearer.
2. **What is the analytical purpose?** Match the purpose to a shape, not to whatever chart looks good:
   - **Comparison** across a handful of categories → bar chart.
   - **Trend over time** → line chart (or sparkline if space-constrained and only the shape matters).
   - **Distribution** → histogram or box plot, not a pie chart.
   - **Ranking** → sorted bar chart (horizontal, if labels are long).
   - **Composition / part-to-whole** → stacked bar or a small number of segments; avoid a pie chart with more than ~5 slices.
   - **Relationship between two variables** → scatter plot.
   - **Network / connections** → node-link diagram, only when the relationships themselves (not just a count of them) are the point.
   - **Timeline of discrete events** → a timeline/Gantt shape, not a line chart with events forced onto a continuous axis.
3. **Is a table actually safer than a chart here?** If the audience needs exact values (not shape/trend), or the dataset is small enough to read directly, a table communicates more precisely than a chart approximates.
4. **Where is this implemented?** On a Web Awesome/ATK UI project, check the native chart components (Bar, Bubble, Data Grid, Doughnut, Line, Pie, Polar Area, Radar, Scatter, Sparkline — confirmed present in Web Awesome, Pro-gated) before reaching for an external charting library, so the visualization stays on the same token/theme system as the rest of the page.

## Rules that apply regardless of chart type

- Bar charts start at zero — never truncate the axis to exaggerate a difference.
- Give every visualization room to breathe — don't cram multiple charts edge-to-edge.
- A color-only distinction in a chart must also carry a label or pattern (colorblind-safe by default, not as an afterthought).
- If a claim in the surrounding text depends on the chart, the chart's data source and as-of date belong next to it, not only in a caption three scrolls away.
