# Design — atk-ui

Read [`vision.md`](vision.md) first. Every decision here is judged against it.

Decisions are numbered so they can be referred to and superseded. If one
changes, add a new entry that supersedes it — do not delete the old one.

## Shape

One npm package. Inside it, four things that are deliberately separate because
they change at different speeds and are used by different people.

- **theme** — Aganitha's brand expressed as values for the upstream library's
  design tokens. CSS only, no JavaScript.
  - exposes: one stylesheet, and a class to put on `<html>`
- **components** — the Lit elements we write, for things the upstream library
  does not provide.
  - exposes: the custom elements, and a per-component import path so a bundler
    can drop the rest
- **patterns** — compositions of existing elements with our class names. Markup
  and CSS, no JavaScript.
  - exposes: `atk-` prefixed class names and the documented markup that goes
    with them
- **catalog and skill** — generated from the two above, for AI assistants.
  - exposes: a `custom-elements.json`, a skill directory, and the reference
    files the skill reads on demand

Build tooling lives in the repository as scripts. It is not a published package.

## Decisions

### D1 — Build on Web Awesome instead of building our own components

- **Options:**
  - **A. Write our own components** (what the previous two attempts did) — full
    control of names, tokens, and bundle size. We own accessibility, keyboard
    handling, form association, and browser bugs forever.
  - **B. Build on a maintained upstream library.**
  - **C. Build the simple parts, reuse the hard parts** — the previous repo's
    choice. Sounds balanced, but it means maintaining a boundary and arguing
    about which side each new component falls on.
- **Chose B**, with Web Awesome. It is MIT for the free tier, actively
  maintained, built on Lit, and it already ships more than 50 components,
  themes, form association, server rendering, translations, framework wrappers,
  editor metadata, and agent skills.
- **Consequences:** we depend on one vendor whose free tier partly exists to
  sell a paid tier. The protection is that the free tier is MIT, so what exists
  today stays usable on those terms forever. The risk is that future components
  may not be free — Data Grid and charts already are not. Our work shrinks to
  the brand, the components nobody else provides, and the agent layer.
- Shoelace was considered and is not an option: it was archived in March 2026
  and Web Awesome is its successor by the same team.

### D2 — Lit as the component base

- **Options:**
  - **A. Native custom elements with a small helper** (simplest to reason
    about) — no runtime dependency, but every component with state becomes
    manual DOM code, and it is a second mental model next to the upstream
    library.
  - **B. Lit.**
- **Chose B.** Web Awesome is built on Lit, so Lit is already loaded in every
  page that uses it. Choosing anything else means two component models in one
  page and two things for a contributor to learn. The size argument that would
  normally count against Lit does not apply, because we are not the ones
  bringing it.
- **Consequences:** contributors learn Lit. That cost is paid once and is
  transferable — it is a widely used library with its own documentation.

### D3 — Use `wa-` elements directly, with no wrapper of our own

- **Options:**
  - **A. Re-export or wrap every upstream element under an `atk-` name** — one
    namespace for authors, and an escape hatch if we ever replace the upstream
    library. Costs a wrapper per element, forever.
  - **B. Authors write `wa-` tags directly** (simplest).
- **Chose B.** A wrapper layer is work that produces nothing a user can see.
  The previous attempt's third failure cause was exactly this kind of coupling
  layer.
- **Consequences:** page markup mixes `wa-` and `atk-` tags. That is honest
  about where things come from. If we ever replace the upstream library,
  consumer markup changes — accepted, because a wrapper would not have prevented
  the real work of that migration anyway.

### D4 — Web Awesome's tokens are the vocabulary; ours fill gaps only

- **Options:**
  - **A. Define `--atk-` tokens and bridge them to `--wa-`** — we control the
    names, at the cost of maintaining a translation layer that has to keep up
    with theirs.
  - **B. Adopt `--wa-` as the vocabulary** (simplest). Add `--atk-` only for
    concepts the upstream library has no equivalent for.
- **Chose B.** The bridge in option A is the one thing the previous attempt
  named as a cause of its own difficulty.
- **Consequences:** this reverses a rule from the earlier vision that said we
  define the token names. That rule was written before committing to an
  upstream library, and it costs more than it is worth now. Our theme becomes a
  set of values, not a set of names.

### D5 — One npm package; grouping lives in the catalog

This is the decision that most needed rethinking, because the obvious reason for
many packages turned out to be the wrong reason.

- **Options:**
  - **A. One npm package per group** — the previous attempt's approach.
  - **B. One package** (simplest), with per-component import paths.
- **Chose B.** The argument for A was that a consumer should not pay for what
  they do not use. That argument does not survive examination: bundlers drop
  unused code, and how many bundles we publish is independent of how many
  packages we publish.
- The real problem behind A was different, and worth stating plainly: **an AI
  assistant shown every component at once chooses badly.** A model writing for
  one domain gets confused by elements from another. That is a real effect and
  the upstream library reports it too.
- **The fix belongs in the catalog, not in the packaging.** Components declare a
  group; the skill presents groups separately and pulls detail on demand. This
  is strictly more capable than packages were: a scope can span groups, and it
  can include selected upstream components — which no packaging scheme could
  express, because the upstream library is a single package.
- **Consequences:** adding a component means adding a file, not creating a
  package. Most of the previous repository's tooling stops being necessary. A
  genuinely huge dependency may still justify its own package one day; that is a
  separate decision to make when it happens.

### D6 — Generate the catalog from the component source

- **Options:**
  - **A. A hand-written specification file per component** — precise, but it
    duplicates what the source already says and drifts from it.
  - **B. Generate from documentation comments in the source** (simplest to keep
    correct), using the Custom Elements Manifest analyser.
- **Chose B**, using the same tags and the same analyser as the upstream
  library, so a contributor writes the same shape of comment they would see in
  any Web Awesome component.
- **Consequences:** documentation comments become a review item, and a check
  must fail the build when a generated file is stale. Without that check this is
  a convention rather than a guarantee.
- **This decision conflicts with D8, and building the examples is what found
  it.** The analyser identifies elements by looking for `customElements.define`.
  D8 registers through a `define()` helper instead, so the analyser saw no
  elements at all — the components came out as ordinary classes and the base
  class was wrongly reported as an element. The catalog would have been silently
  empty. Resolved by declaring the tag in the documentation comment
  (`@customElement atk-metric`), which means the tag name now exists in two
  places; a check fails when they disagree, because a catalog that documents an
  element under a name the browser does not know is worse than no catalog.
- **Patterns cannot be generated this way at all.** The Custom Elements Manifest
  describes custom elements, and a pattern is markup plus CSS. Patterns
  therefore carry a markdown file with front matter, and the generator merges
  both sources into one skill. This makes the two contribution shapes asymmetric
  — a component is one file, a pattern is two — which the contributor checklist
  has to handle rather than pretend away.

### D6a — Check what fails silently

CSS custom properties and CSS classes fail quietly. A misspelled `--wa-` token
is dropped with no error. A Web Awesome utility class used inside a shadow root
does nothing, because global CSS does not cross the shadow boundary. A container
query with no `container-type` never matches. None of these produce a warning,
and none are reliably caught in review.

- **Options:**
  - **A. Write the rules down and rely on review** (simplest) — free, and it is
    what the previous attempt did. Its `AGENTS.md` had nine rules and one
    contributor.
  - **B. Check the ones a machine can check.**
- **Chose B** for the two that are mechanical: every `--wa-` token we reference
  must exist in Web Awesome's real set, and our CSS may contain no literal
  colours.
- **Consequences:** the contributor checklist gets shorter, because the machine
  enforces what it can and the checklist covers only what needs judgement. That
  is the intended direction — D9's length budget is met by moving work into
  tooling, not by writing more tersely.

### D7 — The skill pulls detail from files, not from a command

- **Options:**
  - **A. A command that queries the catalog and prints the relevant text** —
    flexible, but it is a program to build, ship, and keep working, and it does
    not run where there is no install.
  - **B. A short skill plus reference files it reads on demand** (simplest).
- **Chose B**, copying the structure the upstream library already uses.
- **Consequences:** there is no tool to maintain. The skill must state that it
  is the authority and that the model's own memory of these libraries is not
  reliable — both libraries are public and old versions are in training data, so
  an assistant will write confident, outdated markup unless told not to.
- Our skill sits alongside the upstream library's two rather than replacing
  them. Forking theirs would mean re-merging tens of thousands of lines on every
  release.

### D8 — `AganithaComponent` as the base class

- **Options:**
  - **A. Components extend `LitElement` directly** (simplest) — nothing in the
    middle, but any shared behaviour has to be added to every component.
  - **B. Components extend our own named base class.**
  - **C. Extend the upstream library's base class** — not possible. It is marked
    internal and is not reachable through the package's exports.
- **Chose B.** It currently extends `LitElement` and holds very little.
- **Justification, so the class does not become decoration:** a module that
  touches `document` or `window` when it loads crashes any server-side build.
  Next.js and Astro both render on the server. The base class is where that is
  handled once instead of being a rule contributors must remember and a failure
  they cannot diagnose.
- **Consequences:** one instruction for contributors instead of several. It is
  also the seam — if the base ever has to change, it changes in one file.

### D9 — A contribution is a pattern by default, a component when it must be

- **Options:**
  - **A. Every contribution is a Lit component** — one consistent thing, but the
    bar to contribute stays high and stays high forever.
  - **B. Patterns by default; components only where behaviour requires it.**
- **Chose B.** The split follows difficulty rather than being a rule anyone has
  to memorise: if it needs no JavaScript, it is a pattern.
- **Consequences:** two contribution paths to document instead of one. Accepted,
  because the alternative makes the common case as hard as the rare one.
- **Amended after the interviews.** The original reasoning was that a junior
  engineer could write a pattern with a checklist. Components are now built by a
  core team, so that no longer carries the decision. The split still stands for a
  narrower reason: a pattern is cheap, and the rate at which the catalog can grow
  is limited by the core team's time. The fifty-line checklist budget also stays,
  not as an accessibility target but as a complexity canary — if the contract
  outgrows it, the contract is wrong even when only experienced people follow it.

### D10 — Production is a bundler in every stack; the CDN is for preview

- **Options:**
  - **A. The CDN is the primary way to load** — no build step needed anywhere,
    at the cost of shipping everything to every page.
  - **B. Bundled in production, CDN only for preview and learning** (simplest to
    make fast).
- **Chose B**, for all four stacks. Astro, Next.js, and React bundle already.
  Hugo can bundle through Hugo Pipes, and we will document that as the
  recommended path rather than leaving teams to invent one.
- **Consequences:** the CDN does not need versioned immutable URLs, a cache
  policy, or a pinning rule, because nothing in production depends on it. This
  removes what the previous repository listed as its largest blocker. It creates
  a different obligation: a working, documented build recipe for each stack, since
  teams will follow whatever we demonstrate.

### D11 — Fill gaps by curating third-party libraries, not by building

- **Options:**
  - **A. Build what the free tier lacks** — a data grid, charts, and scientific
    visualisations. Full control, and an unbounded amount of work competing with
    teams who do only that.
  - **B. Choose a third-party library per gap, theme it, and document when to
    use it** (simplest).
- **Chose B.** Aganitha applications already consume maintained scientific web
  components published by the organisations that own the underlying data. That
  is the right relationship and we should not replace it.
- **Consequences:** the catalog covers components we did not write, which is
  fine — it is a catalog, not an inventory of our code. Each curated choice is a
  decision to record when it is made, with the licence checked.
- Superseded in part by D12: curating something means committing to support it.

### D12 — What is in the catalog, we support

Building the `<atk-go-ribbon>` wrapper found that the upstream component it
wraps is version 0.0.14, last released in 2021. That is the normal state of
scientific tooling, not an unlucky pick.

- **Options:**
  - **A. Only admit actively maintained dependencies** — a clean rule, but it
    would exclude components teams already depend on, and much scientific
    software is quiet for years without being abandoned.
  - **B. Admit anything and label its maintenance status** (simplest) — honest,
    but it leaves every team to decide alone, which is the situation this
    project exists to end.
  - **C. Admit it and take on supporting it.**
- **Chose C.** If something is in the catalog, we are responsible for it
  continuing to work — old or new. Fixing it, forking it, or replacing it is our
  problem, not the problem of each application that used it. That promise is the
  reason to have a curated catalog at all; without it we are only publishing
  opinions.
- **Consequences, and they are real:**
  - **The catalog must stay small enough that the promise is true.** Adding an
    entry is taking on work with no end date. This is now the main argument
    against adding anything, and a better one than bundle size ever was.
  - **Every third-party component needs a wrapper of ours**, so applications
    depend on our tag rather than the upstream one. This is the seam that lets
    us replace an implementation without touching any application. Note that
    this does not contradict D3: we do not wrap Web Awesome elements, because we
    do not need to replace Web Awesome behind an application's back.
  - **Admitting something requires a check**: licence, last release, version,
    and how much would have to be rebuilt if it disappeared. Recorded when the
    entry is added.
  - **The check walks the resolved dependency tree, not the declared one.** The
    package a developer names is often not the package that carries the risk.
    React is the worked example: `react` has no advisories at any 19.x, while
    the React Server Components code that shipped a CVSS 10.0 pre-authentication
    remote code execution lives in `react-server-dom-*`, which nobody installs
    on purpose. Checking the named package returns a clean result that means
    nothing. See D13.

### D13 — Recommend versions where web components work properly

Aganitha uses Astro, Next.js, Hugo and React. Web components behave differently
across them, and the difference is not obvious from the outside.

- **Options:**
  - **A. Support whatever versions teams already run** — nothing to migrate, but
    we would have to ship framework wrappers and document workarounds forever.
  - **B. Recommend a floor and build the recipes against it.**
- **Chose B.** Teams follow what we demonstrate, so what we demonstrate should
  be the version where this works without workarounds.
- **React 19 or later is the one that matters.** Before 19, React passed
  everything to a custom element as a stringified attribute and could not listen
  to custom events without a ref. From 19 it sets properties and handles events
  directly, so `<atk-metric>` behaves like any other element. **Next.js 15 and 16
  both still permit React 18**, so naming a Next.js version is not sufficient —
  the React version has to be stated explicitly.
- **Consequences:** some applications will need a React upgrade before adopting
  atk-ui. That is a real cost and we should say so plainly rather than hide it
  behind a compatibility layer. In exchange we ship no framework wrappers of our
  own, and Web Awesome's are there for anything still on React 18.
- Our own build stays on TypeScript 5.x because the manifest analyser is built
  on the TypeScript compiler API and predates 7. This is a constraint on this
  repository only, not a recommendation to consumers.

**Version floors, checked against the OSV advisory database on 2026-08-08.**
Recheck before publishing a recipe; these move, and they have moved fast.

| | Minimum | Reason |
|---|---|---|
| React | 19.0.0 for custom elements, but see below | The `react` package itself is clean |
| `react-server-dom-*` | **19.2.8** (or 19.0.8 / 19.1.9) | Eight CVEs, one of them CVSS 10.0 |
| Next.js | **16.2.11**, or 15.5.21 on the 15 line | Security, not features |
| Bun | 1.2.0 | 1.1.x had command injection and prototype pollution |
| TypeScript | any current | No advisories |

**Pin the patch, never the minor.** `next@16.2.10` carries nine open
advisories and `16.2.11` carries none. `^16.2` can resolve to the vulnerable
one.

**Check the packages that ship, not the packages that are named.** The
`react` package has no advisories at any 19.x. The React Server Components
implementation ships in `react-server-dom-webpack`, `-turbopack` and
`-parcel` — separate packages, versioned in lockstep with React, pulled in by
the framework rather than named by the developer. Querying `react` returns
"clean" and is worthless. This applies to every vetting decision under D12:
walk the resolved dependency tree.

### The React Server Components record, and what follows from it

Eight advisories in under a year, all in the same subsystem, with the fix line
climbing continuously:

| CVE | | Fixed in (19.2 line) |
|---|---|---|
| CVE-2025-55182 "React2Shell" | RCE, CVSS 10.0, pre-authentication | 19.2.1 |
| CVE-2025-55183 | Source code exposure | 19.2.2 |
| CVE-2025-55184 | Denial of service | 19.2.2 |
| CVE-2025-67779 | Denial of service | 19.2.3 |
| CVE-2026-23864 | Multiple denial of service | 19.2.4 |
| CVE-2026-23869 | Denial of service | 19.2.5 |
| CVE-2026-23870 | Denial of service | 19.2.6 |
| CVE-2026-44907 | Denial of service in Server Functions | 19.2.8 |

None of these packages are used by Hugo, by a static Astro site, by a
client-side React application, or by web components on a static page. They are
reached only by server-rendering React.

**So the recommendation is not "patch faster", it is "prefer a stack that never
loads this code".** Recommend Hugo or Astro first. Treat Next.js with Server
Components as a deliberate choice for applications that genuinely need
server-side rendering, made with this record in view — and, under D12, with the
understanding that recommending it commits us to tracking these releases on
behalf of every team that follows the recommendation.

### D14 — The on-ramp is a deliverable, not documentation

Interviews found that engineers liked the components of both earlier attempts and
still did not use them, because there was no path from wanting them to running
them. See [`lessons.md`](lessons.md).

- **Options:**
  - **A. Write good documentation and a getting-started guide** (simplest) — this
    is what both earlier attempts had. Neither was adopted.
  - **B. Ship starting points that produce a working application.**
- **Chose B.** Four things, in this order:
  1. **Starter templates** — a repository that builds and runs, already themed,
     with a page in it. Astro and Hugo first; both are where internal work is
     heading, and both are static, which avoids the server-side attack surface
     recorded in D13. Next.js waits, and alternatives to it are being looked at.
  2. **A project skill** that starts a new project or moves an existing one onto
     atk-ui, so it works from Claude, Codex or OpenCode rather than only from a
     command line.
  3. **A discovery surface.** Interviews named discovery as a problem in its own
     right, with three parts that have to be solved together: what exists, what
     it looks like, and what it looks like in a real application. A list answers
     only the first. This finally settles the preview question that has been open
     since the CDN was demoted — preview is a browsable visual reference, and the
     reason is discovery rather than no-build convenience.
  4. **Example applications**, because people asked to see whole applications
     rather than isolated component demonstrations. **A starter template that
     produces a genuinely good page is also an example application**, so one
     artefact serves both — which is the main argument for making the templates
     real rather than minimal.
  5. **Page layouts**, so nobody has to decide page structure. Check what
     `<wa-page>` and the Web Awesome utility layer already give before designing
     anything; the gap is likely three or four opinionated Aganitha page shapes,
     not a layout system.
- **Consequences:** every template is a thing we maintain and, under D12, patch.
  That is the argument for two rather than five, and for preferring static ones.
  It also reorders the work — the contribution path in D9 is sound but moves
  behind all of this, because people contribute to systems they already use.
- **The measure of success changes with it.** Adoption counts are lagging and
  easy to argue about. The honest test is time from an empty directory to a
  working, branded page. If that is not clearly better than asking an assistant
  to invent one, the project has not earned its learning cost.

## What is volatile, and where the seam is

The test: if this is replaced next year, what has to be rewritten?

| Volatile part | Seam | Cost of replacing |
|---|---|---|
| Web Awesome | The theme file and the catalog's curation list | Consumer markup changes. Accepted under D3 — no wrapper would have avoided the real migration. |
| Lit | `AganithaComponent` | The base class and each component's render method. |
| Manifest analyser | One generation script | That script. Components untouched. |
| Curated third-party libraries | Named per gap in the catalog | One entry each. |
| Where the CDN is hosted | It serves preview only | Nothing in production depends on it. |

## Not doing

- **Wrapping upstream elements under our own names** — D3. It is invisible work.
- **Building scientific visualisations** — D11. The data owners publish better
  ones and we already use them.
- **Generating a website from structured data.** Asked for in interviews — "give
  me JSON plus templates and produce a site." **Never in scope.** That is exactly
  what Hugo and Astro do, and building it again would mean competing with the
  tool we are asking people to adopt. The answer to anyone who asks: use Hugo or
  Astro's own content pipeline, and take our templates and components as the
  presentation layer. A permanent boundary, not a deferral.
- **A validation and self-correction pipeline for generated content** — the
  previous attempt built one. Asking an assistant to produce a document or report
  with our components is a real request and the catalog already supports it; what
  stays out is the machinery to check and correct the output, until a real
  pipeline needs it.
- **Framework wrappers, server rendering, translations, editor metadata** — all
  shipped by the upstream library. Building any of these would be duplicating
  what we already depend on.
- **Our own icon set** — the upstream library's icon component covers it.
- **A command-line tool for querying the catalog** — D7. Files are enough.
- **Multiple npm packages** — D5.
- **Static site generator plugins** — a documented, working recipe per stack is
  what teams need. A plugin is only worth writing if a recipe proves insufficient.

## Open

1. **Where the data grid and charts come from.** Both are paid in the upstream
   library. D11 says curate rather than build, but the specific choices are not
   made, and licences need checking before they are.
2. **Whether preview is a documentation site or a hosted bundle.** Lower
   priority than it was, since nothing in production depends on it.
3. **The account of why the two earlier attempts stopped.** Being re-examined
   from interviews. Until that is done, [`lessons.md`](lessons.md) should not be
   written and its earlier conclusions should not be relied on.
