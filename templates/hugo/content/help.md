---
title: "Help"
layout: "single"
toc: false
---

## Reading a report

Every report picks one layout in its frontmatter (`layout: dossier`,
`dashboard`, `tabbed`, `split`, `landing`, or `docs`, or none for a plain
document). Use the sidebar to jump between reports, or `⌘K` / `Ctrl+K` to
search.

## Search

The header search box filters the current sidebar's report list as you type.
Press `Enter`, or open [Search](/search/) directly, for full-text search
across every report.

## Building your own report

Ask your assistant to transform your notes using atk-ui's components — it
reads the `atk-ui` skill's report-templates reference to pick a layout. To
preview what you're writing locally, with live reload:

```bash
atk-ui preview <report.md> --watch
```
