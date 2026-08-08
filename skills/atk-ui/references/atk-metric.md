# `<atk-metric>`

A labelled value with its recent trend and normal range.

**Use it when:** Showing one measurement that a reader needs to judge at a glance: is it normal, and which way is it moving. Lab results, system metrics, counts tracked over time.

**Do not use it when:** Do not use it to show several measurements at once — use a record list, or a table if they need comparing. Do not use it for a value with no history and no normal range; that is a definition list, not a metric.

## Attributes

| Name | Description |
|---|---|
| `label` | What is being measured. Always set this. |
| `value` | The current value, shown as given. Not reformatted. |
| `unit` | Unit shown after the value, for example `g/dL`. |
| `low` | Lower bound of the normal range. |
| `high` | Upper bound of the normal range. |

## Slots

| Name | Description |
|---|---|
| `(default)` | Optional footnote shown under the value. Keep it to a few words. |

## CSS parts

| Name | Description |
|---|---|
| `value` | The number and its unit. |
| `chart` | The sparkline SVG. |

## CSS custom properties

| Name | Description |
|---|---|
| `--atk-metric-chart-width` | Width of the sparkline. Defaults to 6rem. |

## Notes

A single measured value, with its recent history and normal range.

Pass the history as a JSON array in a `<script type="application/json">`
child. Scalars go in attributes. This is how every atk-ui component takes
complex data — it works in plain HTML, in templates, and in AI-generated
markup, with nothing to serialise.
