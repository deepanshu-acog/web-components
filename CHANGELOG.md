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

**What:** Added a Makefile to the Astro starter (`help`, `install`, `build`,
`test`, `run`, `preview`, `clean`, `distclean`), matching the standard verb
set used across other Aganitha repos. `test` runs `astro check`, which needed
`@astrojs/check` and `typescript` added as devDependencies — the template had
no typecheck script before this.

**Why:** `make` is the org-wide entry point so automation and agents never
have to guess how to build, test, or run a project; a scaffolded starter
should follow the same contract as everything else, not be a `bun run`-only
exception.

**Rejected:** Delegating from the root `atk-ui` Makefile into
`templates/astro/`. Templates are fetched live via git at `atk-ui start` time
(D18), not built as part of the parent package's own pipeline, so there's no
real root-level operation to delegate — the template's Makefile stands alone,
used only after scaffolding onto a user's machine.

**What:** Bumped `templates/astro/package.json`'s `@aganitha/atk-ui` dependency
from `^0.1.0` to `^0.2.0`, and added `tools/check_template_version.ts` — run as
part of `make check`, and therefore before every `make publish` (`publish:
check` was already the dependency) — which fails if the package's current
version doesn't satisfy any template's declared range for it.

**Why:** Publishing `0.2.0` (the theme/font/shape token work above) didn't
actually reach the template. For a `0.x` package, semver's caret only allows
patch bumps — `^0.1.0` means `>=0.1.0 <0.2.0`, so `0.2.0` never satisfied it
and `bun install` kept resolving the old version, silently. Verified the range
bump with a clean `rm -rf node_modules && bun install`: resolves to `0.2.0`,
and the brand color/font/radius tokens all render correctly in a browser — not
just that the version number moved. Verified the check itself catches the
exact regression by temporarily reverting the range and confirming it fails
with a message naming the fix, then reverting back.

**Rejected:** A manual checklist step in `aganitha-npm-publish` instead. Ruled
out because this repo will publish often (per the person driving this work),
and a step that has to be remembered is exactly the kind of thing that gets
skipped under routine, repeated use — the same failure mode this bug was. An
automated gate that already runs on every publish path costs nothing extra to
keep correct.
