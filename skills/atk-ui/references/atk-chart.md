<!-- Generated from the component source. Do not edit; run `make generate`. -->

# `<atk-chart>`

Web Awesome themed ECharts visualization element.

**Use it when:** Visualizing multi-series trends, clinical trial metrics, distributions, market shares, or comparative data in reports and dashboards.

**Do not use it when:** Do not use for a single scalar value; use `<atk-metric>` instead.

## Example

```html
<atk-chart height="320px">
  <script type="application/json">
    {
      "xAxis": { "type": "category", "data": ["Q1", "Q2", "Q3", "Q4"] },
      "yAxis": { "type": "value" },
      "series": [{ "name": "Adoption", "type": "bar", "data": [45, 68, 85, 94] }]
    }
  </script>
</atk-chart>
```

## Attributes

| Name | Description |
|---|---|
| `height` | Height of the chart container (e.g., '300px', '400px'). |

## Notes

Interactive charting component powered by Apache ECharts, fully integrated
with Web Awesome design tokens and themes.

Uses `IntersectionObserver` to lazy-load ECharts. Chart configuration is
passed via a child `<script type="application/json">` tag.
