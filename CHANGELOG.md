# Changelog

## 2026-08-09

**What:** Renamed the skills pack from `atk-ui` to `atk-ui-skills` so the pack
name does not conflict with the generated `atk-ui` skill.

**Why:** Developers can now distinguish installing both atk-ui skills from
installing or referring to the catalog skill itself.

**Rejected:** Keeping the shared `atk-ui` name for both artifacts. It made
commands and instructions ambiguous without adding any useful grouping.

**What:** Added Phase 1 of atk-ui: the theme, generated catalog and skills,
Astro starter, local preview and project-start CLI, standalone CLI release
build, and the library publication contract.

**Why:** An engineer needs one supported path from an empty directory to a
working branded page. The npm library supplies components to applications. The
GitHub-release binary supplies project setup and catalog preview.

**Rejected:** Publishing the CLI through npm. The CLI ships as standalone
binaries through GitHub releases so it can be installed and updated by the
shared commands repository without a second npm-based command distribution
path.

**What:** Astro starter first-impression pass, guided by the `training` repo's
site. Moved the placeholder brand hue from "indigo" to "blue", added
placeholder font-family tokens naming IBM Plex Sans / JetBrains Mono (names
only, no bundled files), and added shape tokens (`--wa-border-radius-scale`,
deeper shadow offset/blur) borrowed from Web Awesome's own "awesome" theme
values. The Astro starter self-hosts the two fonts and adds Pagefind search
(`/search`, `Ctrl+K`/`⌘K`).

**Why:** All still placeholder values and still Web Awesome's own token
vocabulary (D4) — the goal was a template that makes a good impression without
growing a second design system alongside Web Awesome's.

**Rejected:** Switching the Astro starter's base theme to Web Awesome's
`themes/awesome.css` wholesale. It carries a 2x border-width, flat blur-free
shadows, its own bright color palette, and an `@import` of Crimson Pro/Quicksand
from an external font CDN — a different, bolder design language than the blue/
Plex Sans pairing chosen here, and an unwanted third-party network request on
every page load. Took only its shape *values* into our own theme file instead.
