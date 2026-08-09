# Handoff

Updated: 2026-08-08

## Objective

Rebuild Aganitha's shared UI system (`atk-ui`) — third attempt. Two earlier
ones ([`atk-doc-elements`](https://github.com/aganitha/atk-shared-libs), still
on disk at `/Users/rama/work/atk-shared-libs`, and `wc-docs`, not currently on
disk) were built but not adopted. Interviews found engineers liked the
components and still could not discover or use them. This attempt builds on
Web Awesome (Lit, MIT, 50+ components) instead of a from-scratch component
library, and treats **discovery and usage as the problems to solve** —
contribution is deliberately narrowed to a core team.

Success is measured as time from an empty directory to a working branded page,
compared against an engineer just asking their AI assistant to invent one. If
that is not clearly faster, the project has not earned its learning cost.

Repo: [aganitha/atk-ui](https://github.com/aganitha/atk-ui), branch `main`.
The previous, technically-different attempt is archived at
[aganitha/atk-ui-v0](https://github.com/aganitha/atk-ui-v0) — read its
`docs/design.md` as history, not guidance; several of its decisions (native
elements, light DOM, our own tokens) are reversed here.

## Current state

**Phase 0 (foundation) is done.** Nothing in Phase 1 onward is started.

Built and passing `make check` (build, tests, CSS token/colour checks, staleness
check):

- Package skeleton: `@aganitha/atk-ui`, Lit + Web Awesome as peer deps, Bun,
  TypeScript 5.9.3 (pinned — the manifest analyser predates TS 7).
- [`src/base.ts`](../src/base.ts) — `AganithaComponent`, the base class every
  component extends.
- [`src/define.ts`](../src/define.ts) — safe element registration (no-ops on
  server, no-ops on double-registration).
- Three worked contribution examples, one of each kind:
  - [`src/patterns/record-list/`](../src/patterns/record-list/) — a pattern
    (markup + CSS, no JS)
  - [`src/components/metric/`](../src/components/metric/) — a component
    (`<atk-metric>`, reactive props, JSON-child data, SVG sparkline)
  - [`src/components/go-ribbon/`](../src/components/go-ribbon/) — a
    third-party wrapper (`<atk-go-ribbon>`, lazy-loads Gene Ontology's
    `wc-go-ribbon`, degrades visibly if the optional dep is missing — which it
    is, deliberately, in this repo)
- [`tools/generate.ts`](../tools/generate.ts) — generates the `atk-ui` skill
  (`skills/atk-ui/`) from component JSDoc (via Custom Elements Manifest) and
  pattern front matter. `--check` mode fails the build if generated output is
  stale or a tag name disagrees between the doc comment and the `define()` call.
- [`tools/check_css.ts`](../tools/check_css.ts) — fails the build on any
  `--wa-*` token that doesn't exist in Web Awesome's real set, or any literal
  colour.
- [`skills/atk-ui-contribute/SKILL.md`](../skills/atk-ui-contribute/SKILL.md) —
  the contributor checklist, exactly at its 50-line budget.

Not started: theme (ships Web Awesome defaults only, no Aganitha branding
applied), both starter templates, the `atk-ui-start` skill, widening `atk-ui`
past the catalog, the four confirmed `atk-doc-elements` gaps, everything from
Phase 2 on.

## Decisions and constraints

Thirteen-plus decisions are recorded in [docs/design.md](design.md) (D1–D17).
The ones that most affect what you build next:

- **D9 / amended** — patterns (no JS) vs components (Lit), but the
  junior-contributor rationale is gone. Components are core-team-only now
  (D14/lessons.md). The pattern/component split survives because it keeps the
  catalog cheap to grow at core-team pace.
- **D12** — curating a third-party dependency means committing to support it
  indefinitely. Check the *resolved* dependency tree, not the named package —
  this is how the React Server Components CVEs were nearly missed (see below).
- **D13** — version floors, checked 2026-08-08 against OSV, recheck before
  publishing any recipe: React ≥19.0.0 is fine, but `react-server-dom-*` needs
  **19.2.8** specifically (8 CVEs, one CVSS 10.0, in that subsystem alone,
  climbing through the whole 19.2.x line). Next.js needs **16.2.11** pinned
  (not `^16.2` — `.10` has 9 open advisories, `.11` has none). Bun ≥1.2.0.
  Prefer Hugo/Astro over server-rendered Next.js where possible — almost all
  Next.js advisories are server-side attack surface a static site never loads.
- **D15/D16** — the entry point is a **pack of skills**, not a website. Five
  planned: `atk-ui` (generated), `atk-ui-start`, `atk-ui-design`,
  `atk-ui-content`, `atk-ui-contribute` (done). Only the first two ship in
  Phase 1. A stale published skill is worse than a missing one — publishing is
  a release step, not an afterthought.
- **D17** — a project may build its own local component on `AganithaComponent`
  without going through the core team; it never auto-enters the shared catalog
  (harvesting is a human judgement call, not automatic).
- **Contribution is intentionally narrow.** Not a bug to fix — see
  [lessons.md](lessons.md). Discovery and usage are the two in-scope problems.

## Evidence

- `make check` passes as of commit `80ed978` (build + tests + CSS checks +
  staleness check). 22 tests, all in [tests/](../tests/).
- Both the tag-drift check and the staleness check were verified by
  deliberately breaking them and confirming the failure (not just observed
  passing).
- Version floors in D13 were checked live against `npm view` and the OSV API
  on 2026-08-08 — not from memory. One correction already happened mid-session
  (an initial "React has no advisories" claim was wrong; the risk is in
  `react-server-dom-*`, a separate package family). If citing these numbers
  later, recheck rather than trust the date stamp.
- The `atk-doc-elements` gap table in [TODO.md](../TODO.md) was checked
  against the actual source at
  `/Users/rama/work/atk-shared-libs/atk-doc-elements/src/`, not the archived
  summary. The equivalent `wc-docs` audit was **not** done —
  `igniva-2` is not on disk this session — and is recorded as an open task
  rather than guessed at.

## Next action

Start Phase 1 in [TODO.md](../TODO.md): the theme mechanism (Web Awesome
defaults as marked placeholders — brand values are parked, see below), then
the Astro starter template with its local-component recipe (D17), then widen
the `atk-ui` skill past the catalog and write `atk-ui-start`.

Phase 1's own completion test is explicit: have someone who has never seen
atk-ui install the pack and time how long it takes them to reach a working
branded page, unaided. Compare against just asking their assistant to invent
one. Do not start Phase 2 until this number exists and looks good.

## Blockers and risks

- **Parked, not blocking:** Aganitha brand colours/typefaces — a separate
  effort owns these. Theme mechanism should ship now with Web Awesome defaults
  clearly marked as placeholders, so swapping in real values later touches one
  file.
- **`wc-docs` audit is unverified.** `igniva-2` needs cloning
  (`git@github.com:aganitha/igniva-2.git`) before triaging what from it (if
  anything) gets curated vs. rebuilt vs. dropped. Do not act on the summary in
  the old `lessons.md` — it was reasoned from a description, not source.
- **Version floors move fast.** D13's numbers had 4 more CVEs land in the
  `react-server-dom-*` line in under a year. Recheck via OSV before quoting
  them in a template or recipe.
- **Watch the two length budgets.** `AGENTS.md` (~60 lines) and
  `atk-ui-contribute/SKILL.md` (~50 lines) are both deliberately tight —
  treat either growing past budget as a signal the underlying contract got
  too complicated, not a reason to trim prose.
