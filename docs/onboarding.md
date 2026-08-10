# Onboarding

## Who this is for

You are an experienced developer. You do not know atk-ui yet. This page is the
only thing you need to read before you start. It does not repeat the other
documents — it tells you which one to read for which question, in an order
that works, and gives you commands to run so you feel the system before you
read about it.

## What atk-ui is, in one sentence

Aganitha's shared UI layer: a brand theme on top of an open-source component
library, the small number of extra components that library does not have, and
the tools and AI-assistant skills that let a person or an assistant use both
correctly. Full reasoning: [vision.md](vision.md).

## Run it before you read about it

These four commands take a few minutes and teach you more than the design
document does. Run them from the repository root.

```bash
bun install
make check
```

`make check` builds the package and standalone CLI, runs the tests, and checks
the CSS rules and generated files. If this passes, your machine is set up
correctly.

```bash
bun run src/cli/index.ts preview
```

This starts a local web page listing every component and pattern atk-ui ships,
rendered live. Open the URL it prints. This is the whole catalog — there is
nothing else to discover beyond what you see here.

```bash
bun run src/cli/index.ts start astro /tmp/atk-ui-demo --no-dev
```

This scaffolds the Astro starter template into `/tmp/atk-ui-demo` and installs
its dependencies, without starting the dev server. Open
`/tmp/atk-ui-demo/src/pages/index.astro` and read it — it is a real page using
real components, not a placeholder. Run `bun run dev` inside that directory if
you want to see it in a browser.

(`atk-ui` itself is a command-line tool, described later on this page. Right
now you are running it directly with `bun run src/cli/index.ts`, because it is
not installed as a binary on your machine yet.)

## The documents, in the order to read them

Read these in order. Each one answers a different question. Do not read
`design.md` end to end — it is long by design, and you look things up in it,
you do not read it as a story.

1. **[vision.md](vision.md)** — why atk-ui exists, who it is for, and what
   success looks like. Ten minutes. Read this fully.
2. **[../AGENTS.md](../AGENTS.md)** — the map of the repository and the rules
   that apply everywhere. Sixty lines. Read this fully.
3. **[../TODO.md](../TODO.md)** — what is built, what is in progress, and what
   is planned next, in priority order. Skim it to see where the project is
   today.
4. **[design.md](design.md)** — every decision made, the options that were
   considered, and why the other options were rejected. Do not read it now.
   Come back to it when you ask "why does it work this way" and want the
   answer instead of guessing. Decisions are numbered (D1, D2, ...) and
   `AGENTS.md` and `TODO.md` both point at the numbers that matter for a given
   piece of code.
5. **[lessons.md](lessons.md)** — what two earlier attempts at this same idea
   got wrong, from interviews with the engineers who used them. Read this if
   you are tempted to add something outside what `vision.md` scopes in —
   it explains why that temptation has already been tried and did not work.

## How this project thinks

Three ideas explain most of the design. The rest is detail — look it up in
`design.md` when you need it.

**Do not build what the upstream library already has.** atk-ui is built on
Web Awesome, an open-source component library with more than fifty
components. atk-ui only adds Aganitha's brand and the few things Web Awesome
does not provide. Before building anything, check
`node_modules/@awesome.me/webawesome/dist/skills/webawesome/SKILL.md` — it
almost certainly already has what you are about to build. (Decision D1.)

**A small core team builds components; every project can build its own local
component too.** Two earlier attempts opened contribution to everyone and
people got stuck on discovery and usage before contribution became the
problem. So new components go through review by people who watch for
duplication across projects. If your own project needs something specific to
itself now, build it locally on the same base class — it does not have to
wait for the core team, and it does not need to enter the shared catalog.
(Decisions D9, D14, D17.)

**The entry point is a set of AI-assistant skills, not a website.** Most
people will find and use components by asking their assistant, with atk-ui's
skills installed, rather than by browsing documentation. This is why the
component reference files under `skills/atk-ui/references/` are generated
from the source code, not written by hand — they cannot go stale without the
build failing. (Decisions D15, D16.)

## The tools

**The `atk-ui` CLI** — `src/cli/` (thin command handlers) and `src/core/`
(the actual logic). Three commands:

- `atk-ui preview` — the live catalog you ran above.
- `atk-ui start <stack> <dir>` — scaffold a themed starter project and start
  its dev server. Only `astro` exists today; `hugo` is planned.
- `atk-ui update` — check for and install a newer release of the CLI itself.

Run `bun run src/cli/index.ts --help`, or any subcommand with `--help`, for
the full option list and examples. Once the CLI is published, it runs as
`atk-ui` directly — see [design.md, decision D18](design.md) for why it is
distributed as a compiled binary through GitHub releases instead of an npm
package.

**The Makefile** — run `make help` for the full list. The ones you will use
most:

- `make check` — the full gate: build, tests, CSS rules, and generated-file
  freshness. Run this before every commit.
- `make generate` — regenerates `custom-elements.json` and everything under
  `skills/atk-ui/` from the component source code. Run this after changing a
  component's JSDoc comment or adding a pattern.
- `make run ARGS="preview"` — a shortcut for running the CLI locally, useful
  before it is installed as a binary.

**Generation** — `tools/generate.ts` reads every component's JSDoc comment
(through a Custom Elements Manifest analyzer configured in
`custom-elements-manifest.config.mjs`) and every pattern's Markdown front
matter, and writes the generated skill and reference files. You never edit
anything under `skills/atk-ui/` by hand — `make check` fails the build if a
generated file is stale.

## The support system (skills)

These are the files an AI assistant reads. A person can read them too — they
are plain Markdown.

- **`skills/atk-ui/`** — generated. The component and pattern catalog: what
  exists, when to use each thing, when not to, and a runnable example. Read
  [atk-metric's reference](../skills/atk-ui/references/atk-metric.md) as a
  sample of what a generated entry looks like.
- **`skills/atk-ui-start/`** — hand-written. Tells an assistant to run
  `atk-ui start astro <dir>` when someone asks to start a new project. It does
  not explain how scaffolding works — it just says which command to run.
- **`skills/atk-ui-contribute/`** — hand-written. The checklist for adding a
  component or pattern. Read this fully before you add anything — see the
  next section.
- **`packs/atk-ui-skills.pack`** — installs the `atk-ui` and `atk-ui-start` skills
  together, through `skills-pack`.

`skills/atk-ui/SKILL.md` also tells an assistant to install Web Awesome's own
two skills (`webawesome`, `webawesome-design`), so an assistant working on an
Aganitha page has both the upstream library's catalog and atk-ui's additions
available, without atk-ui repeating what Web Awesome already documents about
itself.

## A worked example: adding a component

This is the shape every new component follows. Two existing components exist
specifically to be copied:

- **[src/components/metric/metric.ts](../src/components/metric/metric.ts)** —
  a component with reactive properties, JSON-child data, and an SVG chart.
- **[src/patterns/record-list/](../src/patterns/record-list/)** — a pattern:
  markup and CSS only, no JavaScript. Most contributions are patterns, not
  components — read
  **[skills/atk-ui-contribute/SKILL.md](../skills/atk-ui-contribute/SKILL.md)**
  first to see which one you need and why.

The checklist covers: checking Web Awesome does not already have it, choosing
pattern versus component, writing `@atk-use`/`@atk-avoid` so an assistant can
choose correctly between two similar things (not just describe what the thing
is), four mistakes that fail silently (shadow DOM and utility classes,
container queries, colour-only signalling, unvetted third-party dependencies),
and running `make generate && make check` before you push. It is eighty-one
lines. Read the whole thing; it is kept short on purpose.

## Where to go when you are stuck

- **"Does atk-ui already have this?"** — run `atk-ui preview`, or read
  `skills/atk-ui/SKILL.md`.
- **"Does Web Awesome already have this?"** — read
  `node_modules/@awesome.me/webawesome/dist/skills/webawesome/SKILL.md`,
  specifically `references/choosing-components.md` — a decision tree by what
  the user needs to do, not a flat list of names.
- **"Why does this work this way?"** — find the decision number in
  `AGENTS.md` or a code comment, then read that section of `design.md`.
- **"What should I build next?"** — `TODO.md`, top to bottom; it is kept in
  priority order.
- **"Something is broken"** — `make check`'s failures are meant to say what is
  wrong and where. If one does not, that is itself a bug worth fixing.

## What this document does not cover

It does not repeat `vision.md`'s reasoning, `design.md`'s decisions,
`AGENTS.md`'s rules, or `atk-ui-contribute`'s checklist. If something here
disagrees with one of those, that document is right and this one is stale —
fix this page.
