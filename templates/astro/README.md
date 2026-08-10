# atk-ui Astro starter

Scaffolded by `atk-ui start astro`. Builds, runs, and is already themed —
`src/pages/index.astro` is a real page, not a placeholder, so it doubles as
a worked example.

```
make install
make run
```

`make help` lists every other target — `build` (production build + search
index), `test` (type-check), `preview` (serve the production build, needed
for search), `clean`/`distclean`.

## What's on the page

- **Web Awesome components** (`<wa-badge>`) — the upstream library. Use these
  directly for anything generic: buttons, inputs, dialogs, layout.
- **atk-ui components and patterns** (`<atk-metric>`, the record list) —
  Aganitha's additions, for what Web Awesome does not cover. See the `atk-ui`
  skill for the full catalog.
- **A local component** (`<site-note>`, in `src/components/site-note.ts`) —
  this project's own, not part of the shared catalog. Copy this file's shape
  for anything specific to what you're building: a plain `.ts` file exporting
  an `AganithaComponent` subclass, imported into an `.astro` file like any
  other module. No special Astro configuration needed. Rename the `site-`
  prefix to your own project's.
- **Search** (`/search`, `Ctrl+K`/`⌘K` from anywhere) — Pagefind, indexing the
  built site. It only works after `make build` (then `make preview` to serve
  it); `make run`'s dev server has no index to query yet, since Pagefind reads
  static HTML output, not live content.

## Writing content, not just pages

`src/pages/example-report.md` is plain Markdown using atk-ui and Web Awesome
components — copy its front matter (`layout: ../layouts/Content.astro`) for
any content page. A page built this way can't declare its own imports the
way `index.astro` does, so `Content.astro` registers every atk-ui component
up front and lets Web Awesome's own autoloader find whichever `wa-*`
elements are actually used — see that file's comments for why the two
libraries need different answers here.

## Theme

`@aganitha/atk-ui/theme.css` carries Aganitha's brand as overrides on Web
Awesome's own tokens — see `theme.css`'s own comments. The `atk-theme` class
on `<html>` in `src/pages/index.astro` (and inside `src/layouts/Content.astro`
for Markdown pages) is what turns it on.
