# Installation

The fastest path is `atk-ui start astro` — a themed, running project in one
command. This page is for adding atk-ui to a project that already exists.

## npm

```bash
npm install @aganitha/atk-ui @awesome.me/webawesome lit
```

`@awesome.me/webawesome` and `lit` are peer dependencies — atk-ui builds on
top of Web Awesome rather than bundling it (see the `webawesome` skill).

## Styles

Import Web Awesome's own theme first, then atk-ui's — atk-ui only overrides
the tokens where Aganitha's brand differs from the default:

```js
import "@awesome.me/webawesome/dist/styles/themes/default.css";
import "@aganitha/atk-ui/theme.css";
import "@aganitha/atk-ui/patterns.css";
```

Add the theme class to `<html>`:

```html
<html class="wa-theme-default atk-theme"></html>
```

## Components

Import what you use — components register themselves on import, there is no
separate setup step:

```js
import "@aganitha/atk-ui/components/metric";
```

`import "@aganitha/atk-ui"` (no subpath) registers every component in one
import, at the cost of bundle size — use it for a quick prototype, not a
production page.

## Server-rendered frameworks (Astro, Next.js)

Import component modules from a place that only runs in the browser — a
`<script>` tag in an Astro page's body, not its frontmatter; a client
component in Next.js. Component modules touch browser-only globals
(`customElements`, `MutationObserver`) at import time, which crashes
server-side rendering. CSS imports are safe anywhere; they do not execute
code. `templates/astro/src/pages/index.astro` in this repo is a worked
example.
