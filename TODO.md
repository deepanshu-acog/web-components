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

- [ ] **Theme mechanism.** Which `--wa-` tokens we set, how it is applied and
      loaded. Placeholders until brand values land.
- [ ] **Astro starter template.** Builds, runs, themed, with a page worth
      copying. Good rather than minimal — it doubles as the example application
      people asked to see.
- [ ] **Astro local-component recipe (D17).** A plain `.ts` file extending
      `AganithaComponent`, in the template's own `src/components/`, imported
      into an `.astro` file. No special Astro config — its bundler handles it
      like any module. Show one in the template so it is discovered by example,
      not just documented.
- [ ] **`atk-ui` skill — widen past the catalog.** It generates components and
      patterns today, which answers "what exists" and leaves "how do I use it
      here" unanswered. Add installation and usage references, following the
      layout Web Awesome uses. Still generated.
- [ ] **`atk-ui-start` skill.** Start a new project, or add atk-ui to an
      existing one. Drives the Astro template. Hand-written, kept thin.
- [ ] **Tell the assistant to install Web Awesome's two skills too**, the way
      theirs tell people to install their companion.
- [ ] **Set up the pack and publish it through skills-pack.** Publishing becomes
      part of release — a stale published pack makes every assistant wrong at the
      same moment.

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
