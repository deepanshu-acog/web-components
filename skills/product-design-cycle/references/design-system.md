# Design System Guidance

## Aganitha design language

This is the default direction used whenever Stage 1.5 or Stage 4 needs a default and nothing more specific (request, existing code, ATK UI convention) overrides it:

- **Direction:** modern, professional, scientific enterprise — not marketing-polished, not playful.
- **Density:** medium by default; dense for expert/monitoring/comparison tools; spacious only for rare single-decision consumer-style flows. Minimal, but not empty — don't strip a screen of useful structure in the name of minimalism.
- **Hierarchy:** one strong, clear hierarchy per screen — the thing the task needs first draws the eye first.
- **Color:** neutral surfaces, borders, and body text by default. Brand color is reserved for primary actions, active/selected states, and meaningful emphasis on data — never applied as decoration or to non-meaningful elements. If more than a small minority of a screen is brand-colored, that's a signal the color is being used as decoration, not meaning.
- **Elevation/borders:** subtle borders and restrained elevation (a token-driven shadow, not a heavy drop shadow) — elevation should read as "this floats above the page" (a dialog, a menu), not as default styling on flat content.
- **Contrast:** WCAG 2.1 AA is the floor for every surface, not an aspiration checked only for the "important" ones.
- **Spacing:** consistent, token-driven — the same spacing scale used everywhere, not tuned per-screen.

These defaults resolve *ties* — they never override something the request states explicitly, an existing repo convention shows, or a task-driven rule elsewhere in this skill (e.g., the layout-selection or navigation rules) already decides.

## The hierarchy

**Design principles → Design tokens → Components → Patterns → Layouts → Pages.**

Work top-down. Don't invent a page layout before checking whether an existing pattern covers it; don't invent a component before checking the token/component library; don't hand-write a raw color/spacing value before checking whether a token already means what's needed.

## Before designing: check what exists

1. **Is there existing project code/design system?** Inspect it. Understand its tokens, components, and conventions before proposing anything. Reuse it. Extend it only when a real gap exists, and name the extension as custom.
2. **Is ATK UI accessible in this session** (via a connected repository/environment)? If yes, inspect its components, tokens, and conventions and prefer them over Web Awesome's raw defaults — ATK UI is presumably a themed/extended layer built for this product family. **If ATK UI is not accessible, say so explicitly.** Do not guess at its component names, tokens, or conventions. Fall back to Web Awesome's own documented defaults instead, and flag that the fallback happened.
3. **Is Web Awesome the implementation foundation?** Use its existing tokens, themes, and components as the foundation — the following is confirmed directly from Web Awesome's own documentation and is safe to rely on. Anything about Web Awesome not stated here should be checked against its actual docs (`webawesome.com/docs/`) before being asserted, rather than guessed.

## Web Awesome: confirmed specifics

### Theming is layered, not monolithic
A theme is stacked from four independent layers applied as classes on `<html>`: a **theme** (overall look — fonts, borders, space, shadows, how variants are used), a **color palette** (hue shifts and chroma), **variant colors** (brand/neutral/success/warning/danger), and a **light/dark color scheme**. Example: `<html class="wa-theme-default wa-palette-default wa-brand-blue wa-neutral-gray wa-success-green wa-warning-yellow wa-danger-red">`. Two themes can share a palette and variants and still look completely different — don't conflate "change the palette" with "change the theme."

### Design tokens by category
Border, Color, Component Group, Focus, Shadow, Space, Transition, and Typography tokens exist as `--wa-*` custom properties. Prefer these over raw CSS values in every case:
- **Space** tokens are rem-based and scale together via `--wa-space-scale` — use this for a project-wide density adjustment rather than editing individual spacing values.
- **Typography** tokens include role-based weights (referencing named weights by default) and unitless line-heights (paragraph text should be ≥1.5 for readability).
- **Border** tokens (width and radius) scale via `--wa-border-width-scale` and `--wa-border-radius-scale`.
- **Shadow** tokens are built from modular offset/blur/spread primitives, usable as size-based shorthands or as `inset` shadows.
- **Component Group** tokens (e.g., `--wa-form-control-*`) style a whole family of related components at once — prefer these over overriding each component individually.

### Customization hooks, in order of preference
1. Design tokens (`--wa-*` custom properties) — highest-level, most maintainable.
2. CSS parts (`::part(...)`) — for styling a component's internals beyond what tokens expose.
3. Custom states — for state-based styling hooks.
Never target shadow-DOM internals with ordinary descendant selectors — they won't reach. Never apply `wa-invert`, `wa-light`, or `wa-dark` classes directly to an individual component — these reset that element's own variant tokens and will fight the surrounding theme.

### Light/dark mode
Web Awesome ships both light and dark styles in every theme but does **not** auto-detect the user's OS preference. Implement this at the application level: check `prefers-color-scheme` for the default, let the user override it, and persist their choice.

### Layout: two official Agent Skills exist and are authoritative
Web Awesome itself ships two companion Agent Skills, confirmed live from `webawesome.com/docs/ai/agent-skills`:
- **`webawesome`** — the component reference (generated from the library's Custom Elements Manifest on every release, so it always matches the current API). Use it for a specific component's properties/slots/events/parts.
- **`webawesome-design`** — the design companion (hand-authored, but every tag/attribute/slot/CSS-custom-property it cites is cross-checked against the library on every build). Use it for layout, theming, and composition decisions: when and how to use `<wa-page>` for full-page layouts (it has an explicit landing-page-vs-app-shell branch — check it before assuming a sidebar layout), spacing rhythm, the layout-utility decision guide (`wa-stack`, `wa-cluster`, `wa-grid`), typography, surfaces, and a 7-point custom-CSS playbook for the rare cases custom CSS is genuinely needed.

**If both skills are available in a given environment, load both** — they cross-reference each other and cover the full range of a real design+implementation task. If only one can be loaded, `webawesome` for component-heavy work, `webawesome-design` for design-heavy work.

### Data visualization inside Web Awesome
Web Awesome ships native chart components (Bar, Bubble, Data Grid, Doughnut, Line, Pie, Polar Area, Radar, Scatter, Sparkline) — confirmed present in its documented component list, gated to Web Awesome Pro. **Before reaching for an external charting library on a Web Awesome/ATK UI project, check whether one of these native components already covers the need** — it keeps the visualization on the same token/theme system as everything else on the page. See `data-heavy-ui.md` for the chart-selection reasoning itself (Web Awesome's components are the implementation layer; the decision of *whether and how* to chart something is a separate step covered there).

## Naming custom decisions

Any token, component, or pattern used that is **not** confirmed in the existing project code, ATK UI (if accessible), or Web Awesome's own documentation must be labeled explicitly: *"this is a custom/new decision — not part of the existing system — because [reason]."* Never present an invented API, token name, or component as if it were a standard, documented one.

