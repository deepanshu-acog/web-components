<!-- Generated from the component source. Do not edit; run `make generate`. -->

# `<atk-sidenote>`

A marginalia callout for contextual notes and references.

**Use it when:** Highlighting secondary details, definitions, or reference notes alongside main paragraph text in scientific reports and documentation.

**Do not use it when:** Do not use for primary page warnings or alert banners; use `<wa-callout>` instead.

## Example

```html
<atk-sidenote type="Note" label="Pharmacokinetics">
  Cmax was reached 2.5 hours post-dose across all Phase I cohorts.
</atk-sidenote>
```

## Attributes

| Name | Description |
|---|---|
| `type` | Category or type label shown above the note text (e.g. "Note", "Reference"). |
| `label` | Optional detailed label or title for the note. |

## Slots

| Name | Description |
|---|---|
| `(default)` | The note content text. |

## CSS parts

| Name | Description |
|---|---|
| `container` | The outer sidenote wrapper. |
| `type` | The optional badge label for note classification. |

## Notes

A side note or marginalia callout for contextual annotations.

Placed inline or alongside main prose text to highlight secondary details,
definitions, or reference notes without interrupting the core reading flow.
