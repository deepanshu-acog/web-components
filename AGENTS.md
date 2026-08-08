# atk-ui

Aganitha's shared UI layer. We build on Web Awesome rather than writing our own
component library. Our work is the brand theme, the few components nobody else
provides, and the agent skills that make both usable by an AI assistant.

**Nothing is built yet.** Read [docs/vision.md](docs/vision.md) then
[docs/design.md](docs/design.md) before writing code.

## Map

| Path | What it is |
|---|---|
| docs/ | vision, design, and later lessons and status |
| TODO.md | open work, in priority order |

The rest of the map will be written when the code exists. Do not create
directories ahead of the thing that goes in them.

## Rules

**Write in plain English. No idioms.** The team includes people who do not speak
English as a first language. Technical terms are fine. Keep sentences short and
direct. This applies to documents, code comments, and chat replies.

**Check whether Web Awesome already has it.** It ships more than 50 components,
a utility CSS layer, page layout, theming, form handling, and icons. Building
something it already provides is the most likely mistake in this repository, and
the most expensive one. Its skills are in the package at
`node_modules/@awesome.me/webawesome/dist/skills/` — read them before deciding
that something is missing.

**A contribution is a pattern unless it needs JavaScript.** A pattern is markup
plus our CSS classes. A component is a Lit element, and is only justified when
there is data, interaction, or drawing involved. See D9 in the design document.

**Components extend `AganithaComponent`, never `LitElement` directly.** A module
that touches `document` or `window` when it loads will crash a server-side
build, and Astro and Next.js both render on the server. The base class handles
this once. This failure is silent and hard to diagnose, which is why it is a
rule rather than advice.

**Use `wa-` elements directly. Never wrap one.** A wrapper is work that produces
nothing a user can see. If a Web Awesome element is nearly right, use it and
style it, or write a pattern around it.

**Use `--wa-` tokens.** An `--atk-` token needs a reason, and the only valid
reason is that Web Awesome has no equivalent concept. We ship values, not names.

**Never edit a generated file.** The catalog, the manifest, and the skill are
produced from the source. Fix the source.

**Do not drive a browser unless asked.** Building bundles and checking rendering
by hand is slow and expensive. Type checks and tests are the bar for a normal
change. Ask the user when something genuinely needs to be looked at.

**If the contributor checklist grows past about fifty lines, fix the contract,
not the checklist.** A long checklist means the work is too complicated. Treat
it as a build failure. The previous attempt shipped a 177-line guide for adding
one component and still had one contributor.

## Deeper

- Why this exists: [docs/vision.md](docs/vision.md)
- The eleven decisions and what was rejected: [docs/design.md](docs/design.md)
- Open work: [TODO.md](TODO.md)
- The two earlier attempts: `docs/lessons.md` — **not yet written.** Their causes
  are being re-examined from interviews. Do not rely on the account in the
  archived repository.
