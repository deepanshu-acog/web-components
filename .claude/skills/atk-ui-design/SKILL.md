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

## Color Roles: `brand` Is Primary, `neutral` Is Secondary

Web Awesome ships five semantic roles: `brand`, `neutral`, `success`, `warning`, `danger`. In stock Web
Awesome, `neutral` is gray — the muted, low-emphasis default. **This project overrides that.** In
[theme.css](../../../src/theme/theme.css), `--wa-color-neutral-*` is set to a real hue (teal), not gray,
so `neutral` doubles as this project's **secondary** brand color. This matters for an agent: any generic
Web Awesome guidance that assumes `neutral` means "muted gray" does not hold here.

- **Primary emphasis → `variant="brand"`.** Main CTAs, active/selected states, key metrics, links,
  anything that should draw the eye first.
- **Secondary emphasis → `variant="neutral"`.** A second action next to a primary one, secondary badges
  or tags, a complementary series in a chart — anything that should read as "also branded" but not the
  main focus. Do **not** reach for `neutral` expecting gray; it renders teal here.
- **Genuinely muted/quiet UI (disabled state, low-emphasis text, dividers, borders) → surface and text
  tokens**, not a color role: `--wa-color-surface-*`, `--wa-color-text-quiet`, `--wa-color-surface-border`.
  These are what stayed gray; `neutral` did not.
- Need the secondary hex directly, outside a component `variant`? Use the project's own
  `--wa-color-secondary` / `--wa-color-secondary-on` tokens (also defined in theme.css) rather than
  reaching into `--wa-color-neutral-*` by hand.
