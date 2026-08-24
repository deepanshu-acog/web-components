---
name: swot-grid
kind: pattern
group: data-display
summary: A real 2x2 quadrant grid for Strengths, Weaknesses, Opportunities, and Threats analysis.
uses: [wa-icon]
use: >
  Presenting a SWOT analysis in an entity or company dossier, strategy memo,
  or competitive assessment — anywhere the four categories are genuinely
  fixed and the reader expects a quadrant layout.
avoid: >
  Do not use this for any other 2x2 or four-item grouping — the quadrant
  colors (success/warning/brand/danger) are specific to Strengths/Weaknesses/
  Opportunities/Threats and would carry the wrong meaning elsewhere. For a
  generic four-card layout, use `wa-grid` with plain `wa-card` elements.
---

Each quadrant is tinted with the semantic token matching its meaning —
strengths as success, weaknesses as warning, opportunities as brand,
threats as danger — so it reads correctly in dark mode and after a rebrand
without touching this markup.

## Markup

```html
<div class="atk-swot-grid">
  <div class="atk-swot-quadrant" data-kind="strengths">
    <div class="atk-swot-quadrant-header">
      <wa-icon name="shield-check"></wa-icon>
      <h3>Strengths</h3>
    </div>
    <ul class="atk-swot-list">
      <li>Market leadership in the core therapeutic sector.</li>
    </ul>
  </div>

  <div class="atk-swot-quadrant" data-kind="weaknesses">
    <div class="atk-swot-quadrant-header">
      <wa-icon name="triangle-exclamation"></wa-icon>
      <h3>Weaknesses</h3>
    </div>
    <ul class="atk-swot-list">
      <li>High dependency on venture funding cycles.</li>
    </ul>
  </div>

  <div class="atk-swot-quadrant" data-kind="opportunities">
    <div class="atk-swot-quadrant-header">
      <wa-icon name="bullseye"></wa-icon>
      <h3>Opportunities</h3>
    </div>
    <ul class="atk-swot-list">
      <li>Cross-portfolio digital telemetry adoption.</li>
    </ul>
  </div>

  <div class="atk-swot-quadrant" data-kind="threats">
    <div class="atk-swot-quadrant-header">
      <wa-icon name="bolt"></wa-icon>
      <h3>Threats</h3>
    </div>
    <ul class="atk-swot-list">
      <li>Regulatory and interest rate contraction.</li>
    </ul>
  </div>
</div>
```

## Notes

`data-kind` selects the quadrant's color — it must be exactly one of
`strengths`, `weaknesses`, `opportunities`, `threats`. In Hugo, the
`{{< swot >}}` shortcode emits this markup from `swot.strengths` /
`.weaknesses` / `.opportunities` / `.threats` frontmatter arrays; in Astro or
plain HTML, write the markup directly.
