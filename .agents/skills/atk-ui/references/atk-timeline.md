<!-- Generated from the component source. Do not edit; run `make generate`. -->

# `<atk-timeline>`

A chronological milestone or pipeline timeline display.

**Use it when:** Displaying multi-phase clinical trial progressions, drug development milestones, regulatory roadmaps, or chronological project history.

**Do not use it when:** Do not use for simple un-ordered lists or key-value pairs. Use a record list or table instead.

## Example

```html
<atk-timeline title="Clinical Development Milestones">
  <div class="step" data-status="complete">
    <span class="date">Q1 2025</span>
    <strong>Phase I Safety Trial</strong>
    <p>Primary safety endpoints met with zero grade 3/4 adverse events.</p>
  </div>
  <div class="step" data-status="active">
    <span class="date">Q3 2026</span>
    <strong>Phase II Dose Finding</strong>
    <p>Active enrollment across 12 clinical sites worldwide.</p>
  </div>
</atk-timeline>
```

## Attributes

| Name | Description |
|---|---|
| `title` | Section title for the timeline. |
| `subtitle` | Optional subtitle or description. |
| `progress` | Show overall milestone progress summary. |

## Slots

| Name | Description |
|---|---|
| `(default)` | Child `<atk-timeline-item>` elements, `<div class="step">` markup, or `<script type="application/json">`. |

## Notes

A chronological milestone or pipeline timeline component.

Displays ordered milestones, clinical trial phases, or historical event progressions
with status indicators, date badges, and progress tracking.
