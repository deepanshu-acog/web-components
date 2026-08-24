<!-- Generated from the component source. Do not edit; run `make generate`. -->

# `<atk-process>`

A numbered sequence of steps, connected in order.

**Use it when:** Explaining a procedure, workflow, or "how to use this" sequence — lab protocols, a multi-step interaction model, an onboarding flow.

**Do not use it when:** Do not use for dated milestones or anything with a status (complete/active/delayed); use `<atk-timeline>` instead. Do not use for unordered items; use a record list or `wa-card` grid instead.

## Example

```html
<atk-process title="How to read this figure">
  <atk-step title="Select a subtype">Choose the patient subtype that matches the presenting phenotype.</atk-step>
  <atk-step title="Filter by problem">Narrow the list using the symptom filters.</atk-step>
  <atk-step title="Click a step">Open the detail panel for the chosen entry.</atk-step>
</atk-process>
```

## Attributes

| Name | Description |
|---|---|
| `title` | Section title for the process. |
| `subtitle` | Optional subtitle or description. |

## Slots

| Name | Description |
|---|---|
| `(default)` | Child `<atk-step>` elements, or `<script type="application/json">`. |

## Notes

A numbered, directionally-connected sequence of steps — an ordered
procedure or interaction model, not a chronology.

Unlike `<atk-timeline>` (dated milestones with status), `<atk-process>` has
no dates and no status — every step is equally "done"; only order matters.
