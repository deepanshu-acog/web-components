---
name: atk-ui-design
description: >-
  Design guidelines, page layout shapes, and visual token customization rules for
  building Aganitha applications and reports with atk-ui and Web Awesome.
allowed-tools: Read
---

# atk-ui Design Guidelines & Layout Shapes

This skill defines the visual composition, page layout shapes, and token customization rules for `atk-ui`.

## 4 Standard Layout Shapes

Use the standard layout shapes documented in `references/layouts.md`:

1. **App Shell / Dashboard (`App.astro`):** Header chrome + sidebar navigation + main grid.
2. **Report / Document (`Content.astro`):** Centered longform reading layout for Markdown.
3. **Workbench / Split View (`Workbench.astro`):** Side-by-side 3D viewer & tabular data grid.
4. **Help Manual / Docs (`Docs.astro`):** Left navigation + article body + search bar.

Detailed copy-pasteable HTML snippets: [Layout Shapes](references/layouts.md).

## Visual Token Rules

- **Use `--wa-` tokens directly:** Always use Web Awesome design tokens (`var(--wa-space-m)`, `var(--wa-color-brand-fill-loud)`, `var(--wa-border-radius-m)`).
- **No hardcoded colors:** Never write literal hex colors like `#0071ec` in CSS or inline styles.
- **Dark Mode:** Dark mode is toggled by adding `.wa-dark` to `<html>`. All components inherit color variables automatically.
