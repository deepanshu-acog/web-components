<!-- Generated from the component source. Do not edit; run `make generate`. -->

# `<atk-step>`

A single numbered step in an atk-process sequence.

**Use it when:** Specifying an individual step with a title and description inside an `<atk-process>`.

**Do not use it when:** Do not use outside of an `<atk-process>`. For a chronological or status-tracked milestone, use `<atk-timeline-item>` instead.

## Example

```html
<atk-step title="Select a subtype">
  Choose the patient subtype that matches the presenting phenotype.
</atk-step>
```

## Attributes

| Name | Description |
|---|---|
| `title` |  |
| `tag` | Optional short tag shown after the title (e.g. "Optional", "5 min"). |

## Slots

| Name | Description |
|---|---|
| `(default)` | Description or details for this step. |

## Notes

A declarative step item child for `<atk-process>`.
