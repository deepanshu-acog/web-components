# atk-ui

Aganitha's shared UI layer. We build on Web Awesome rather than writing our own
component library. Our work is the brand theme, the few components nobody else
provides, and the agent skills that make both usable by an AI assistant.

## Map

| Path | What it is |
|---|---|
| src/components/ | Lit elements. One directory each. |
| src/patterns/ | Markup and CSS, no JavaScript. A `.css` and a `.md` each. |
| src/theme/ | The `.atk-theme` class. Brand values are placeholders — a separate effort owns the real ones. |
| src/base.ts, src/define.ts | `AganithaComponent`, and safe element registration |
| src/cli/, src/core/ | The `atk-ui` CLI. Thin handlers in `cli/`, real logic in `core/` (D18). |
| templates/ | Starter templates. `atk-ui start` fetches these live via git, not from the CLI binary (D18). |
| tools/ | Generation and checks. Dev only, never shipped. |
| skills/atk-ui/ | **Generated.** The catalog an assistant reads. Never edit. |
| skills/atk-ui-start/, skills/atk-ui-contribute/ | Hand-written skills — starting a project, and the contributor checklist. |
| packs/atk-ui.pack | The skills-pack manifest for installing the two skills above together. |
| docs/ | vision, design, and lessons |
| TODO.md | open work, in priority order |

## Rules

**Adding a component or pattern? Read `skills/atk-ui-contribute/SKILL.md`
first.** Fifty lines, covering the judgement calls. `make check` covers the
mechanical ones — types, tests, token names, hardcoded colours, tag-name drift,
and stale generated files. Do not restate any of that here.

**Write in plain English. No idioms.** The team includes people who do not speak
English as a first language. Technical terms are fine. Keep sentences short.
This applies to documents, code comments, and chat replies.

**Check whether Web Awesome already has it.** It ships more than 50 components,
a utility CSS layer, page layout, theming, form handling and icons. Building
something it already provides is the most likely mistake in this repository and
the most expensive one. Its own skills are in the package at
`node_modules/@awesome.me/webawesome/dist/skills/`.

**Never edit a generated file.** Anything under `skills/atk-ui/` and
`custom-elements.json` come from the source. Fix the source, run `make
generate`.

**Do not drive a browser unless asked.** Building bundles and checking rendering
by hand is slow and expensive. `make check` is the bar for a normal change.

**Watch two canaries.** If the contributor skill needs to grow past about fifty
lines, or this file past about sixty, the contract has become too complicated.
Fix the contract, not the document. The previous attempt shipped a 177-line
guide for adding one component and had one contributor.

## Deeper

- New here? Start with [docs/onboarding.md](docs/onboarding.md).
- Why this exists: [docs/vision.md](docs/vision.md)
- The decisions and what was rejected: [docs/design.md](docs/design.md)
- Open work: [TODO.md](TODO.md)
- The two earlier attempts, and why they stopped: [docs/lessons.md](docs/lessons.md)
