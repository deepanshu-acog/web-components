# Standard Page Layout Shapes

`atk-ui` provides 4 standard page layout shapes using Web Awesome's `<wa-page>` component and CSS Grid/Flex utilities.

---

## 1. App Shell / Dashboard (`App.astro`)

Used for project homepages, analytical dashboards, and multi-tool portals.

```html
<wa-page mobile-breakpoint="768">
  <header slot="header" class="wa-split">
    <a href="/" class="brand"><wa-icon name="layer-group"></wa-icon> Project Dashboard</a>
    <span class="wa-cluster">
      <a class="search-link" href="/search">Search <kbd>⌘K</kbd></a>
      <wa-button href="/help" appearance="plain">Help</wa-button>
    </span>
  </header>

  <nav slot="navigation" class="wa-stack">
    <a href="/">Dashboard</a>
    <small class="nav-heading">Reports</small>
    <a href="/reports/obesity">Obesity Report</a>
  </nav>

  <main>
    <!-- Primary Dashboard Cards & Metrics Grid -->
  </main>

  <footer slot="footer">
    <small>v0.2.0 · Built 2026-08-11</small>
  </footer>
</wa-page>
```

---

## 2. Report / Document (`Content.astro`)

Used for clinical intelligence reports, lab summaries, and longform Markdown articles.

```html
<html class="wa-theme-default atk-theme">
  <head>
    <title>Report Title</title>
  </head>
  <body>
    <main style="max-width: 52rem; margin-inline: auto; padding: var(--wa-space-xl) var(--wa-space-l);">
      <h1>Report Title</h1>
      <wa-callout variant="brand">Executive Summary...</wa-callout>
      <!-- Markdown Content -->
    </main>
  </body>
</html>
```

---

## 3. Workbench / Split View (`Workbench.astro`)

Used for interactive data exploration, split-panel visualization, and side-by-side analysis views.

```html
<main class="workbench-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--wa-space-l); min-height: calc(100vh - 10rem);">
  <section class="panel panel-primary">
    <!-- Primary Panel Content (e.g. 3D Viewer, Primary Chart, Main Form) -->
    <slot name="primary" />
  </section>
  <section class="panel panel-secondary">
    <!-- Secondary Panel Content (e.g. Data Grid, Sequence Table, Inspector) -->
    <slot name="secondary" />
  </section>
</main>
```

---

## 4. Help Manual / Knowledge Base (`Docs.astro`)

Used for documentation, API references, and user guides with left sidebar navigation.

```html
<wa-page mobile-breakpoint="768">
  <header slot="header">Documentation</header>

  <nav slot="navigation" class="wa-stack">
    <a href="/help">Getting Started</a>
    <a href="/search">Search</a>
  </nav>

  <main style="max-width: 52rem; margin-inline: auto;">
    <!-- Documentation Article Body -->
  </main>
</wa-page>
```
