# TODO

The only place forward-looking work lives. Reasoning is in
[docs/design.md](docs/design.md); the evidence behind the ordering is in
[docs/lessons.md](docs/lessons.md).

## How this plan is ordered

Both earlier attempts built the hard 95% and skipped the last mile — a starting
point, a way to see what exists, a way to see what it looks like. That last mile
is cheap, and it was the whole difference between adoption and none. It gets
skipped precisely because it looks small next to real engineering work.

So: **no phase delivers infrastructure only.** Each one ends with something a
named person can use from end to end.

**A pack of skills is the entry point** (D15, D16). Engineers reach atk-ui by
asking their assistant, not by finding a website.

Two of the three problems found in interviews are in scope: **discovery** and
**usage**. Contribution is not — components are built by a core team (D9).

**A project may build its own components** (D17), on the same base class and
tokens, without going through the core team. This is what stops a team with an
urgent or narrow need from writing something disconnected from atk-ui, which is
how the angiosarcoma portal ended up with `dw-`, `tl-`, and `gantt-` as three
unrelated CSS vocabularies in one page.

## What "complete" means

Not "every element either earlier attempt had." Most of what they built is
superseded, not owed. Completion is:

1. **The five-skill pack, all live**, each pulling its weight — not five thin
   surfaces standing in for one good one.
2. **Both starter templates**, to a standard good enough that a template is also
   a legitimate example application.
3. **The confirmed gap from `atk-doc-elements` closed**, and the gap from
   `wc-docs` triaged — see the audit below. Not ported wholesale.
4. **A working local-component recipe for every stack we recommend**, so a
   project is never stuck waiting on the core team for something specific to
   itself.
5. **Harvesting running as an ongoing habit**, not a one-time pass — this is
   what keeps the catalog from going stale once the initial gap is closed.

If all five hold and adoption still does not follow, the project has not merely
missed a target — the vision's own exit criteria apply (see `docs/vision.md`).

### The `atk-doc-elements` gap — confirmed by reading the actual source

The claim in the earlier `lessons.md` was reasoned from a summary. This one is
checked against `/Users/rama/work/atk-shared-libs/atk-doc-elements/src/` directly.

| Element | Status |
|---|---|
| `atk-card` | Superseded — `wa-card`. Do not port. |
| `atk-callout` | Superseded — `wa-callout`. Do not port. |
| `atk-avatar` | Superseded — `wa-avatar`. Do not port. |
| `atk-mermaid` | **Gap.** Web Awesome has no diagram element. The lazy-load
  pattern in `mermaid.ts` (`await import("mermaid")` inside
  `connectedCallback`, source text left visible on failure) is worth copying
  outright. |
| `atk-sidenote` | **Gap.** No Web Awesome equivalent. |
| `atk-process` / `atk-step` | **Gap.** No Web Awesome equivalent. |
| `atk-timeline` / `atk-timeline-item` | **Gap, and a naming collision to
  avoid.** This is a simple vertical prose timeline for documentation — a
  different thing from the swimlane clinical timeline seen in the angiosarcoma
  portal (categories down the side, time across the top, SVG-drawn). Do not
  give both the same tag. If the portal's timeline is ever generalised, it
  needs its own name — `atk-event-timeline` or similar. |

Four real gaps: `atk-mermaid`, `atk-sidenote`, `atk-process`/`atk-step`,
`atk-timeline`/`atk-timeline-item` (renamed to avoid the collision above). Not
nine.

### The `wc-docs` gap — not yet confirmed, audit before triaging

`igniva-2` is not on disk in this session (see earlier finding), so this is
reasoned from `docs/lessons.md`'s summary only, not from source. Before acting
on it: clone `aganitha/igniva-2`, read `libs/wc-docs/packages/*`, and redo this
table the way the `atk-doc-elements` one above was done.

Expected shape, to be confirmed: `wc-theme`'s 39 `wa-*`-style components are
fully superseded by Web Awesome itself. `wc-bio`, `wc-chem`, `wc-viz`, `wc-mol`,
`wc-locus` are domain visualisation — per D11/D12, curate a maintained
third-party library the way `atk-go-ribbon` curates Gene Ontology's, rather than
port working code we would then own. `wc-doc` likely overlaps the
`atk-doc-elements` gap above. `wc-data`'s table is the one item worth checking
against Web Awesome's paid data grid before deciding.

## Parked

- [ ] **Aganitha brand values.** A separate effort owns these. Until it lands the
      theme ships Web Awesome defaults, marked as placeholders. Only the values
      are blocked, not the theme mechanism.

## Phase 0 — foundation — done

- [x] Package: one npm package, Lit, Web Awesome, type checks, tests.
- [x] Generation from source, with the staleness check that makes D6 real.
- [x] Three worked examples — pattern, component, third-party wrapper.
- [x] Seven automated gates, each verified by deliberately breaking it.
- [x] Contributor checklist, at its fifty-line budget.
- [x] `docs/lessons.md` from the interviews.

## Phase 1 — an engineer with an assistant can start

The whole thesis, proven once. Nothing after this matters if this does not work.

- [x] **Theme mechanism.** `src/theme/theme.css`: a `.atk-theme` class for
      `<html>` that overrides Web Awesome's `--wa-color-brand-*` tokens.
      Placeholder values (Web Awesome's "indigo" hue) until brand values land
      — swapping them touches only that file.
- [x] **`atk-ui` CLI skeleton (D18).** `src/cli/`, git-style, Commander,
      built as a standalone binary by `make build-cli`; it is not an npm
      package entry point.
      Follows `aganitha-cli-writing`: `--help` with examples at every level,
      `--json`, `--port`, exit code `2` on a bad flag, `Ctrl+C`/`SIGTERM` to
      stop. `make run ARGS="..."` for local use.
- [x] **`atk-ui preview` (D18).** Serves the catalog locally — no hosted CDN,
      no build step. `tools/generate.ts` now also writes
      `skills/atk-ui/catalog.json` (name/kind/group/summary/use/avoid/example/
      module/body), the single source both the skill and the preview page
      read. Closes the "where does preview live" question left open by
      D10/D15.
- [x] **`@example` capture.** `custom-elements-manifest.config.mjs`'s
      `atk_tags_plugin` now also reads `@example` (fenced code, whitespace
      preserved) into `atkExample`. Fixes a real gap — the generated reference
      docs had no usage example at all — and gives `atk-ui preview` runnable
      markup to render, not just descriptions. Patterns reuse their existing
      "## Markup" fence instead of duplicating it.
- [x] **CLI distribution, revised (D18).** No npm-registry publish for the
      CLI (the library keeps its own, unrelated, npm publish) — matches
      `commands/ADMIN-GUIDE.md`'s doctrine of no separate publish step.
      `make build-cli` cross-compiles a standalone binary for
      darwin-arm64/x64 and linux-x64/arm64 from one machine, no CI.
      `make release VERSION=x.y.z` tags, pushes, and runs `gh release
      create`, kept as a separate step from `build-cli` so a local build
      never risks a publish. `tools/bundle_preview.ts` and
      `src/core/embeds.d.ts` exist because a standalone binary has no
      sibling `dist/`/`skills/` to read at runtime — verified end to end by
      running the compiled binary from an empty directory with no
      `node_modules` anywhere nearby.
- [ ] **`commands/bin/atk-ui` shim.** A different, shared repo — out of
      scope here. Fetches the right platform binary via `gh release
      download --repo aganitha/atk-ui` when missing or stale, execs it. This
      is what makes `atk-ui` appear in `atk list` with zero setup.
- [x] **`atk-ui update`.** `src/core/update.ts` + `src/cli/commands/update.ts`.
      Reuses `gh` (already a required prerequisite, already authenticated)
      rather than talking to the GitHub API directly — the same tool `make
      release` itself uses. `--check` reports without installing. Refuses to
      self-update when not actually running the compiled binary (`bun run`
      launches `bun` itself — overwriting that would be a real hazard), a
      guard covered by `tests/update.test.ts`. Verified end to end from the
      real compiled binary against the real (currently release-less)
      `aganitha/atk-ui` — reports "already up to date" rather than crashing,
      since there is nothing to compare against yet.
      **Not built: the throttled background check** — `atk-ui update` today
      is invoke-it-yourself, not automatic like `atk update`'s weekly
      pattern. Automatic background checking belongs in the
      `commands/bin/atk-ui` shim (D18) once that exists, not duplicated here.
- [x] **`atk-ui start astro`.** `src/core/start.ts` + `src/cli/commands/start.ts`.
      Fetches `templates/astro` from the atk-ui repo with a shallow git clone
      (not embedded in the binary — unlike the catalog, template content
      should be free to change without forcing a CLI release), copies it into
      an empty/new directory, `bun install`s, starts the dev server. One
      command end to end, matching vision.md's measure. `--no-install`/
      `--no-dev`/`--repo` for testing and CI. `hugo` correctly rejected as
      not-yet-supported (exit 2), not silently attempted.
- [x] **Astro starter template.** `templates/astro/` — builds, runs, themed,
      with a real page (`atk-metric`, the record-list pattern, `wa-badge`,
      the local component). Verified with a production `astro build` and by
      actually running the dev server in a browser — found and fixed a real
      bug along the way: importing Web Awesome's/atk-ui's component modules
      from an `.astro` file's frontmatter crashes the static build
      (`MutationObserver is not defined` — frontmatter runs during Astro's
      SSR prerender, and those modules touch browser globals at import time).
      Fixed by moving them to a `<script>` tag in the page body, which Astro
      only ever runs in the browser; CSS imports stay in frontmatter. Also
      dropped Web Awesome's autoloader in favour of explicit per-component
      imports — the autoloader can't self-locate its assets once Vite bundles
      it, and installation.md recommends explicit imports for npm anyway.
- [x] **Content layout, for plain Markdown pages.** `templates/astro/src/
      layouts/Content.astro` + `src/pages/example-report.md`. Found by
      testing it, not assumed: a bare `.md` page has no `<html>`/theme/JS at
      all — `<atk-metric>` in raw Markdown rendered as an inert, unstyled
      tag. `Content.astro` fixes this — add `layout: ../layouts/Content.astro`
      to a page's front matter and it gets the theme, every atk-ui component
      (registered unconditionally — a content page can't declare its own
      imports, and the catalog is small by design), and Web Awesome's own
      CDN autoloader for whichever `wa-*` elements actually appear (a real
      `<script src>` tag, not bundled — that's what makes autoloading work,
      unlike `index.astro`'s case). Verified end to end in a browser:
      `<atk-metric>` and an unimported `<wa-badge>` both render correctly.
      This is template completeness, not the content-authoring pipeline
      D16 defers to `atk-ui-content` (Phase 2) — the layout doesn't teach
      anyone what to write, it just makes what they write work.
      **Code review found the hardcoded component list itself could drift
      from the catalog** — the same bug, one layer up. `tools/
      check_content_layout.ts` now fails `make check` if a catalogued
      component has no matching import here; verified it actually catches
      drift, not just that it runs.
- [x] **Code review fixes.** `check_for_update` was swallowing every `gh`
      failure (bad auth, network down) as "already up to date" — confirmed
      against a real 401 that it now surfaces correctly instead. `atk-ui
      start --json` hung until the dev server was killed, because scaffolding
      and running the dev server were one blocking call — split into
      `scaffold_project` (returns) and `start_dev_server` (blocks); verified
      the JSON line now prints before the dev server ever starts.
      `UpdateStatus` is a discriminated union now, not an optional field plus
      a `!`. D10 amended with the one place `templates/astro/` deliberately
      uses the CDN outside preview, and why.
- [x] **`atk-metric`'s history array order, documented.** Found via an
      independent test (a fresh agent, given only the skill files, asked to
      write a page): the array's chronological order was correct in the
      code and in a property-level comment the doc generator drops (`series`
      has no HTML attribute, so it gets no attribute-table row), but never
      reached the generated reference. Moved the note to the class-level doc
      comment, which does render, after confirming the actual order against
      `sparkline.ts` rather than trusting the old comment on faith.
- [x] **Astro local-component recipe (D17).** `templates/astro/src/components/
      site-note.ts` — a plain `.ts` file extending `AganithaComponent`,
      imported into `index.astro` like any other module, no special Astro
      config. Tagged `site-note`, not `atk-note`, deliberately — the README
      says to rename the prefix, so it never reads as part of the shared
      catalog. `tools/check_css.ts` now also scans `templates/`, not just
      `src/` — the same no-literal-colours rule applies the moment someone
      copies this file into their own project.
- [x] **`atk-ui` skill — widen past the catalog.** Added a "Quick start" (npm
      install line, link to `references/installation.md`) and a "Usage"
      section (components vs. patterns, tokens, the local-component recipe,
      link to `references/usage.md`) to the generated `SKILL.md`, following
      Web Awesome's own skill layout. The two new reference pages are static
      prose (`tools/skill-content/*.md`), copied verbatim by `tools/generate.ts`
      with the same "generated, do not edit" marker and staleness check as
      everything else — no second source of truth for install/usage steps.
- [x] **`atk-ui-start` skill.** Hand-written, thin (`skills/atk-ui-start/`) —
      tells the assistant to run `atk-ui start astro <dir>`, not how
      scaffolding works; says plainly there is no command yet for adding
      atk-ui to an existing project.
- [x] **Tell the assistant to install Web Awesome's two skills too.** A
      callout near the top of the generated `SKILL.md`, matching the shape
      Web Awesome's own skill uses for its `webawesome-design` companion.
- [x] **Set up the pack.** `packs/atk-ui-skills.pack`, in this repo — validated
      against `skills-pack`'s own parser (`skills-pack info atk-ui-skills --from .`
      and `preview pack atk-ui-skills --from .`), not just written and assumed
      correct. **Publishing it is a separate step**, not done here: it needs
      either `skills-pack source add github:aganitha/atk-ui` by whoever
      wants it, or landing in `agent-skills`'s own discovery list — a
      cross-repo change, out of scope the same way the `commands/bin/atk-ui`
      shim is.

Only these two skills in Phase 1. `atk-ui-design`, `atk-ui-content` and the
existing `atk-ui-contribute` are Phase 2 and later (D16).

**Completion test:** someone who has never seen atk-ui installs the pack, asks
their assistant to set up a project, and reaches a working branded page unaided.
**Time it.** If that is not clearly faster than asking the assistant to invent a
page from nothing, stop and fix it before starting Phase 2.

## Phase 2 — an engineer can discover what exists

- [ ] **Close the confirmed `atk-doc-elements` gap** — `atk-mermaid`,
      `atk-sidenote`, `atk-process`/`atk-step`, `atk-timeline`/`atk-timeline-item`
      (renamed against the collision above). Four components, following the same
      contract as the three Phase 0 examples.
- [ ] **A visual reference.** What each thing looks like. Can be cheap, and can
      be Storybook, because under D15 it is not the entry point — the skill links
      to it when someone asks what something looks like.
- [ ] **Deploy the Phase 1 template** as the worked example, and link it from the
      skill.
- [ ] **A "what do we have" path in the skill** that answers well enough that a
      person does not need the site for most questions.
- [ ] **`atk-ui-design` skill.** How to compose a page that looks like ours —
      the question a reference cannot answer. Web Awesome's equivalent is 382
      lines, which is why it is separate rather than merged.

**Completion test:** an engineer finds and uses a component they did not know
existed, without asking a person.

## Phase 3 — the second stack

- [ ] **Hugo starter template**, to the Phase 1 standard.
- [ ] **Hugo local-component recipe (D17), in two steps.** No build first — a
      hand-written script element loaded with a plain `<script type="module">`
      tag, mirroring the CDN preview's own no-build step (D10). Hugo Pipes
      second — `js.Build` in the extended Hugo binary bundles TypeScript via
      esbuild, with no separate esbuild install. Document both; do not require
      the second for a project's first local component.
- [ ] **Hugo recipe in the skill.**

**Completion test:** markup from the Astro template works in Hugo unchanged. This
is where the claim that a stack choice changes loading and nothing else either
survives or does not.

## Phase 4 — project setup and layouts

- [ ] **Project init and migration through the skill**, working from Claude,
      Codex and OpenCode. Starting a new project and moving an existing one are
      different jobs; do the first one first.
- [ ] **Page layouts.** Check what `<wa-page>` and the Web Awesome utility layer
      already give before designing anything. The gap is likely three or four
      opinionated Aganitha page shapes, not a layout system.

**Completion test:** an engineer builds a page without making any structural
decisions.

## Phase 5 — grow

- [ ] **Harvesting, continuously.** The catalog stays relevant only while the
      core team keeps watching what teams build. The signal is one structure
      appearing in several applications under different names — the angiosarcoma
      portal had a single list rebuilt five times on one page. If this stops, the
      catalog goes stale and discovery fails again in a new form: everything
      findable, none of it what you need.
- [ ] **Audit `wc-docs` against source**, per the table above, and triage what
      survives — curate the maintained third party where one exists (D11/D12)
      rather than port working code we would then own.
- [ ] **Where the data grid comes from.** Web Awesome's is paid. Curate rather
      than build (D11), and curating means supporting (D12) — check the licence
      and walk the resolved dependency tree.
- [ ] **Where charts come from.** Same reasoning, same checks.
- [ ] **Curate the scientific visualisations already in use.** Nightingale and
      the Gene Ontology components are loaded from public CDNs today.
      `wc-go-ribbon` is version 0.0.14 and five years old, so admitting it means
      taking on its upkeep.
- [ ] **Next.js recipe, with JSX and TSX usage, and its own local-component
      recipe (D17).** Waiting deliberately — alternatives are being looked at and
      D13 records why there is no hurry.
- [ ] **`atk-ui-content` skill.** Turning content into a page or report with our
      components. Must stay a skill and not become a generator — Hugo and Astro
      already generate sites, and that boundary is permanent. Say so inside the
      skill or someone will build the tool anyway.
- [ ] **A shared place to publish and share content** is ecosystem, not this
      repository. Record it as something `atk-ui-content` can target once it
      exists.

## Later

- [ ] **A screen reader pass.** Web Awesome carries most of it; our own
      components and patterns are ours.
- [ ] **Visual regression testing.** A person's eyes are the only check today.
- [ ] **Recheck the D13 version floors.** Correct on 2026-08-08 and moving fast —
      eight React Server Components advisories in under a year.

## Deferred, with reasons in design.md

- [ ] Validation and self-correction for assistant-generated content.
- [ ] Static site generator plugins — templates first.
- [ ] A separate npm package for a genuinely huge dependency.

## Never

- Generating a website from structured data. Hugo and Astro do that, and building
  it would mean competing with the tool we are asking people to adopt.
- Broad contribution from outside the core team. Tried, and people were stuck on
  discovery and usage long before they reached it.
