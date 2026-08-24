<!-- Generated from the component source. Do not edit; run `make generate`. -->

# `<atk-well-plate>`

High-throughput 96-well or 384-well microplate heatmap visualizer.

**Use it when:** Use when displaying assay screening data, compound concentration layouts, or biological quality control across standard 96-well or 384-well microplates.

**Do not use it when:** Do not use for simple 1D lists, sequence data, or generic tabular records.

## Example

```html
<atk-well-plate format="96" title="Compound Screening Plate">
  <script type="application/json">
    [
      { "well": "A1", "state": "control", "label": "POS" },
      { "well": "A2", "state": "filled", "label": "0.1uM" },
      { "well": "H12", "state": "blank" }
    ]
  </script>
</atk-well-plate>
```

## Attributes

| Name | Description |
|---|---|
| `format` | Plate format: 96-well (8x12) or 384-well (16x24). |
| `title` | Optional title shown in the plate header. |
| `src` | Optional external JSON endpoint URL. |
