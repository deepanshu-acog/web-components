# TODO

The only place forward-looking work lives. Reasoning for most items is in
[docs/design.md](docs/design.md).

**Reordered after the interviews.** Engineers liked the components of both
earlier attempts and still did not use them, because there was no way in. The
on-ramp is therefore the adoption bottleneck, and it comes before everything
except the theme. See [docs/lessons.md](docs/lessons.md).

## Parked

- [ ] **Aganitha brand values.** Colours and typefaces. A separate effort is
      building these, and the values in the current applications are not
      accurate. Until it lands, the theme ships Web Awesome's default values
      with a marker saying they are placeholders. Only the values are blocked —
      the theme mechanism is not.

## Done

- [x] Package set up: one npm package, Lit, Web Awesome, type checks and tests.
- [x] Generation step proven, with the staleness check that makes D6 real.
- [x] Three example contributions — a pattern, a component, and a third-party
      wrapper — which found the D6/D8 conflict.
- [x] Contributor checklist skill, at exactly its fifty-line budget.
- [x] `docs/lessons.md`, written from the interviews.

## Now — the on-ramp (D14)

- [ ] **Astro starter template.** A repository that builds, runs, is themed, and
      contains a page worth looking at. Make it good rather than minimal: a
      template that produces a genuinely nice page is also the example
      application people asked for, so one artefact does both jobs.
- [ ] **Hugo starter template.** Same standard. Astro and Hugo are where internal
      work is heading, and both are static, which avoids the attack surface
      recorded in D13.
- [ ] **A discovery surface.** Three parts, and all three are needed or it does
      not solve the problem people described: what exists, what it looks like,
      and what it looks like in a real application. This is what preview turned
      out to be for.
- [ ] **A project skill** that starts a new project or moves an existing one onto
      atk-ui, working from Claude, Codex or OpenCode rather than a command line.
- [ ] **Page layouts.** Check what `<wa-page>` and the Web Awesome utility layer
      already provide first. The gap is probably three or four opinionated
      Aganitha page shapes, not a layout system.
- [ ] **Build the theme mechanism.** Which `--wa-` tokens we set, how the theme
      is applied and loaded, with Web Awesome defaults as placeholders.

## Next

- [ ] **Next.js recipe, including JSX and TSX usage.** Deliberately waiting:
      alternatives to Next.js are being looked at, and D13 records why there is
      no hurry.
- [ ] **A worked example of asking an assistant to produce a document or report**
      using the components. Requested in interviews, and possible today with the
      catalog. Validation machinery stays out.
- [ ] **Decide where the data grid comes from.** Web Awesome's is paid. D11 says
      curate rather than build; D12 says curating means supporting. Check the
      licence and walk the resolved dependency tree.
- [ ] **Decide where charts come from.** Same reasoning, same checks.
- [ ] **Curate the scientific visualisations already in use** — Nightingale and
      the Gene Ontology components are loaded from public CDNs today. Add them to
      the catalog with guidance, and check they theme acceptably. Note that
      `wc-go-ribbon` is version 0.0.14 and five years old, so under D12 admitting
      it means taking on its upkeep.

## Later

- [ ] **A screen reader pass.** Web Awesome carries most of this, but our own
      components and patterns are ours to check.
- [ ] **Visual regression testing.** Today a person's eyes are the only check.
- [ ] **Recheck the version floors in D13.** They were correct on 2026-08-08 and
      they move fast — eight React Server Components advisories in under a year.
- [ ] **Decide whether groups need a project-level scope file.** Only if a real
      project finds the default grouping wrong.

## Deferred, with reasons in design.md

- [ ] Validation and self-correction for AI-generated content — build when a real
      pipeline needs it.
- [ ] Static site generator plugins — a template first; a plugin only if the
      template proves insufficient.
- [ ] A separate npm package for a genuinely huge dependency — decide when one
      appears, not before.

## Never (see "Not doing" in design.md)

- Generating a website from structured data. That is what Hugo and Astro do.
  Building it would mean competing with the tool we are asking people to adopt.
