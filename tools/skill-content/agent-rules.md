> **MANDATORY RULES FOR AGENTS:**
>
> 1. **Check Web Awesome Skills & Tokens First:**
>    Always check and use Web Awesome components (`<wa-card>`, `<wa-callout>`,
>    `<wa-badge>`, `<wa-tag>`, `<wa-button>`, `<wa-input>`), layout classes
>    (`wa-stack`, `wa-grid`, `wa-split`, `wa-cluster`), and `--wa-*` design tokens
>    (`var(--wa-space-*)`, `var(--wa-color-*)`, `var(--wa-border-radius-*)`) —
>    walk the `webawesome` skill's `choosing-components` reference before
>    picking anything. Only reach for `atk-*` for a domain-specific gap Web
>    Awesome does not cover — see the [Packs](#packs) section above for what
>    exists; do not assume the list from memory, it changes.
>
> 2. **Always Preview with `atk-ui preview <file.md>`, NEVER Create Custom HTML Files:**
>    When asked to preview a Markdown report, run `atk-ui preview <path/to/report.md>`
>    (or `atk-ui preview <report.md> --watch`). Never author throwaway `.html` preview
>    files. The CLI compiles Hugo, bundles components, and launches a local server at `http://localhost:1313/`.
>
> 3. **Pick a Standard Hugo Layout in Frontmatter (Never Write Custom Layout Wrappers):**
>    - `layout: docs` — **Docsy-style Documentation:** Left navigation tree (auto-built from the `content/docs/` section hierarchy — put a page there, it appears, no config needed) + center reading column + **right sticky "On This Page" TOC**, plus a previous/next pager at the bottom of each page.
>    - `layout: tabbed` — **Executive Tabbed Briefing:** Hero KPI cards + Web Awesome tabs with smooth panel switching.
>    - `layout: dashboard` — **Live Executive KPI Dashboard:** Real-time metrics grid and status badges.
>    - `layout: dossier` — **Company & Entity Intelligence Dossier:** Comprehensive deep-dive with hero metadata header.
>    - `layout: landing` — **Marketing / Homepage:** Frontmatter-driven hero, CTAs, and stat cards, for a platform's own front page — not for reports. No left sidebar and no right TOC.
>    - *(leave empty)* — **Clean Linear Document:** Optimal reading width, breadcrumbs, and metadata strip.
>    *(See [Report Templates](references/report-templates.md) for full copy-paste ready examples).* 
>
>    **The top navbar and footer are not a layout choice** — they're the site
>    shell (`baseof.html`) and appear on every page automatically, driven by
>    `hugo.toml`'s `[[menu.main]]` / `[[menu.footer]]`. Never hand-write nav
>    markup in a page's content.
>
> 4. **Strict Zero Indentation for Nested HTML:**
>    In Markdown reports, every HTML tag and Web Component must start at column 0 (flush left).
>    Never indent tags by 2 or 4+ spaces, or Hugo's Markdown parser will convert them into escaped `<pre><code>` blocks.
>
> 5. **Content Transformation Workflow:**
>    When a user provides markdown or research text, **do not lose any information**. Transform existing text into rich domain components:
>    - Numbers/trends → `<atk-metric>` with sparkline JSON
>    - Multi-series trends / distributions → `<atk-chart>` with inline ECharts JSON
>    - Tabular data → `<atk-data-table>` with inline CSV
>    - Timelines/milestones → `<atk-timeline>`
>    - Key takeaways → `<wa-callout>`
>    - Categories/cards → `<wa-card>` inside `wa-grid`
>    - Decision flows → `<atk-mermaid>`
>    - Escape angle brackets in body prose as `&lt;` and `&gt;` (e.g. `AHI &gt;15`).
>
> 6. **Verify Against Current Source Before Building — Never From Memory:**
>    Every mistake in this project traced back to the same root cause: assuming
>    something (a component, a layout, a token, a class name) instead of
>    checking it. Names get renamed, layouts get removed, tokens get added —
>    what was true in an earlier conversation, an older doc, or training data
>    may not be true now. Before producing a page:
>    - **Components.** Don't reach for the same 5–6 familiar components out of
>      habit. Walk the `webawesome` skill's `choosing-components` reference for
>      what Web Awesome actually offers, and the current [Packs](#packs)
>      section above for what atk-ui actually offers, every time — not a list
>      remembered from a prior turn.
>    - **Layouts.** Before writing `layout: <name>` in frontmatter, confirm
>      that name is still listed in rule 3 above — a layout documented earlier
>      can be renamed or removed. If it's gone, say so and use what's actually
>      available; don't silently reference something that no longer exists.
>    - **Design, not just components.** Dropping a component into a page and
>      *designing* a page are different tasks. For hero sections, page
>      composition, color, spacing, or "make this look designed" — read the
>      `webawesome-design` skill, not just `webawesome`. It's a separate skill
>      for a reason.
>    - **Styling APIs.** Before setting a CSS custom property or `::part()` on
>      any `<wa-*>` or `<atk-*>` element, look up that exact component's
>      documented attributes / CSS custom properties / parts. Never guess a
>      token name and assume it exists — an unrecognized custom property is
>      dropped silently, with no error, which makes the mistake invisible
>      until someone looks closely.
>    - **If a check reveals something is wrong or missing**, fix the source
>      (or flag it) instead of working around it quietly — that's what keeps
>      this list from needing to be repeated to the next person who reads it.

**Do not write these from memory.** Both Web Awesome and this package appear
in training data at older versions. Read the reference file before using
anything below — the attribute names have changed.

## Standard Report Templates

When generating or rewriting a report, consult [Report Templates](references/report-templates.md) to pick the matching layout structure:
- [Docsy Documentation (`layout: docs`)](references/report-templates.md#1-docsy-documentation-layout-docs)
- [Executive Tabbed Briefing (`layout: tabbed`)](references/report-templates.md#2-executive-tabbed-briefing-layout-tabbed)
- [Real-Time Executive KPI Dashboard (`layout: dashboard`)](references/report-templates.md#3-real-time-executive-kpi-dashboard-layout-dashboard)
- [Standard Scientific Report (`single`)](references/report-templates.md#5-standard-scientific-report-single--default)
- [Company & Entity Intelligence Dossier (`layout: dossier`)](references/report-templates.md#6-company--entity-intelligence-dossier-layout-dossier)
- [Marketing / Homepage (`layout: landing`)](references/report-templates.md#7-marketing-landing-page-layout-landing)
