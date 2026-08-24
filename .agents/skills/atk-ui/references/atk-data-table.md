<!-- Generated from the component source. Do not edit; run `make generate`. -->

# `<atk-data-table>`

AG-Grid enterprise data table themed to brand tokens.

**Use it when:** Displaying multi-column tabular data, clinical trial patient lists, gene expression matrices, or large datasets requiring sorting and filtering.

**Do not use it when:** Do not use for simple key-value pairs or small 2-3 row lists; use a definition list or record list instead.

## Example

```html
<atk-data-table title="Phase III Patient Cohorts" page-size="10">
  <script type="text/csv">
    Cohort,Dose,Patients,Status
    Cohort A,15 mg,120,Active
    Cohort B,30 mg,115,Active
  </script>
</atk-data-table>
```

## Attributes

| Name | Description |
|---|---|
| `title` | Section or table title shown in the header bar. |
| `page-size` | Number of rows per page. Defaults to 10. |

## Notes

Enterprise data table component powered by AG-Grid themed to Web Awesome tokens.

Pass CSV data in a `<script type="text/csv">` child or JSON rows in a
`<script type="application/json">` child. Supports column sorting, filtering,
pagination, and CSV exports.
