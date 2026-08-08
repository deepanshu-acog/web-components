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
named person can use from end to end. A phase that would finish with "the
components are ready, the template comes next" is a phase defined wrongly.

**The skill is the entry point** (D15). Engineers reach atk-ui by asking their
assistant, not by finding a website. Everything else is something the skill
points at.

Two of the three problems found in interviews are in scope: **discovery** and
**usage**. Contribution is not — components are built by a core team.

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
- [ ] **Widen the skill past the catalog.** It generates components and patterns
      today. It also needs getting-started, an Astro recipe, and how to install —
      otherwise it answers "what exists" and leaves "how do I start" unanswered,
      which is the gap the interviews found. Follow the reference layout Web
      Awesome uses.
- [ ] **Tell the assistant to install Web Awesome's two skills too.**
- [ ] **Publish the skill through skills-pack**, and make publishing part of
      release. A stale published skill makes every assistant wrong at once.

**Completion test:** someone who has never seen atk-ui installs the skill, asks
their assistant to set up a project, and reaches a working branded page unaided.
**Time it.** If that is not clearly faster than asking the assistant to invent a
page from nothing, stop and fix it before starting Phase 2.

## Phase 2 — an engineer can discover what exists

- [ ] **A visual reference.** What each thing looks like. Can be cheap, and can
      be Storybook, because under D15 it is not the entry point — the skill links
      to it when someone asks what something looks like.
- [ ] **Deploy the Phase 1 template** as the worked example, and link it from the
      skill.
- [ ] **A "what do we have" path in the skill** that answers well enough that a
      person does not need the site for most questions.

**Completion test:** an engineer finds and uses a component they did not know
existed, without asking a person.

## Phase 3 — the second stack

- [ ] **Hugo starter template**, to the Phase 1 standard.
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
- [ ] **Where the data grid comes from.** Web Awesome's is paid. Curate rather
      than build (D11), and curating means supporting (D12) — check the licence
      and walk the resolved dependency tree.
- [ ] **Where charts come from.** Same reasoning, same checks.
- [ ] **Curate the scientific visualisations already in use.** Nightingale and
      the Gene Ontology components are loaded from public CDNs today.
      `wc-go-ribbon` is version 0.0.14 and five years old, so admitting it means
      taking on its upkeep.
- [ ] **Next.js recipe, with JSX and TSX usage.** Waiting deliberately —
      alternatives are being looked at and D13 records why there is no hurry.
- [ ] **A worked example of producing a document or report** with an assistant.

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
