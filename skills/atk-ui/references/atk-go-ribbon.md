<!-- Generated from the component source. Do not edit; run `make generate`. -->

# `<atk-go-ribbon>`

Gene Ontology annotations for a gene or protein.

**Use it when:** Showing GO annotations for one gene or protein, when the reader wants to see which functional categories are annotated at a glance.

**Do not use it when:** Do not use it as a general chart. It only understands Gene Ontology subject identifiers. For arbitrary category data, use a table.

## Example

```html
<atk-go-ribbon subject="UniProtKB:Q8NER5"></atk-go-ribbon>
```

## Attributes

| Name | Description |
|---|---|
| `subject` | The subject identifier, for example `UniProtKB:Q8NER5`. Several may be
given, separated by commas, as the upstream component expects. |

## CSS parts

| Name | Description |
|---|---|
| `fallback` | The message shown while loading or after a failure. |

## Notes

Gene Ontology annotations for a gene or protein, shown as a ribbon.

This wraps `<wc-go-ribbon>` from the Gene Ontology consortium. We do not
draw the ribbon ourselves — the people who own the data maintain the
visualisation, and that is the right arrangement.

The upstream component is large and most pages that can show a ribbon do not
show one on first paint, so it is loaded on demand rather than bundled.
