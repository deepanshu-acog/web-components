<!-- Generated from the component source. Do not edit; run `make generate`. -->

# `<atk-mermaid>`

Lazy-loaded Mermaid.js flowchart and diagram renderer.

**Use it when:** Visualizing clinical pathways, biochemical reaction cascades, software architectures, or procedural flowcharts in reports.

**Do not use it when:** Do not use for simple static lists or key-value data; use a timeline or table instead.

## Example

```html
<atk-mermaid code="graph LR; Screening --> Phase1; Phase1 --> Phase2;"></atk-mermaid>
```

## Attributes

| Name | Description |
|---|---|
| `code` | Mermaid diagram definition string (e.g. "graph TD; A-->B;"). |

## Notes

Renders flowcharts, sequence diagrams, and process graphs using Mermaid.js.

Uses `IntersectionObserver` to lazy-load the Mermaid rendering engine on demand
when scrolled into view. Diagram code can be passed via the `code` attribute
or as text child content.
