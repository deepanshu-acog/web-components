---
title: Example report
layout: ../layouts/Content.astro
---

# Example report

Plain Markdown, not `.astro` — this is the recipe for content pages: add
`layout: ../layouts/Content.astro` to the front matter and every atk-ui
component and Web Awesome element works, themed, with no per-page imports.
`src/layouts/Content.astro` explains why that layout can do this and
`src/pages/index.astro` cannot (short version: content authors can't declare
imports, so the layout registers everything up front instead).

<atk-metric label="Hemoglobin" value="10.2" unit="g/dL" low="13.5" high="17.5">
  <script type="application/json">[11.8, 11.2, 10.9, 10.4, 10.2]</script>
</atk-metric>

<wa-badge variant="warning">Moderate</wa-badge> — never explicitly imported
anywhere in this file. Web Awesome's own autoloader finds it.
