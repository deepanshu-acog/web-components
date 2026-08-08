# TODO

The only place forward-looking work lives. Reasoning for most items is in
[docs/design.md](docs/design.md).

## Blocked on someone else

- [ ] **Interview findings.** What people actually said about why the two
      earlier attempts stopped. `docs/lessons.md` cannot be written until this
      arrives, and the account in the archived repository should not be relied
      on. Rama has this.
- [ ] **Aganitha brand values.** Colours, typefaces, and any existing brand
      guide. The theme is the first thing to build and it cannot start without
      them.

## Now

- [ ] **Set up the package.** One npm package, Lit, Web Awesome as a dependency.
      Type checking and tests running. Nothing else.
- [ ] **Write the theme.** Aganitha brand as values for `--wa-` tokens. CSS
      only. This is the smallest useful thing we can ship and the only part
      every application needs.
- [ ] **Prove the generation step.** Documentation comments in a component
      become `custom-elements.json`, then the skill and its reference files.
      Include the check that fails when a generated file is stale — without it
      D6 is a convention, not a guarantee.
- [ ] **One pattern and one component.** The smallest real example of each, to
      prove the two contribution paths in D9 actually work before anyone writes
      a checklist about them.
- [ ] **Write the contributor checklist skill.** Budget is about fifty lines.
      If it needs more, fix the contract.

## Next

- [ ] **A working build recipe for each stack** — Astro, Next.js, Hugo, React.
      D10 says teams will follow whatever we demonstrate, so these are a
      deliverable and not documentation. Hugo needs the most attention because
      it is the least obvious.
- [ ] **Decide where the data grid comes from.** Web Awesome's is paid. D11 says
      curate rather than build. Check the licence of whatever is chosen.
- [ ] **Decide where charts come from.** Same reasoning, same licence check.
- [ ] **Decide what preview is** — a documentation site with live examples, or a
      hosted bundle. Lower priority than it once was, because nothing in
      production depends on it.
- [ ] **Curate the scientific visualisations already in use** — Nightingale and
      the Gene Ontology components are being loaded from public CDNs today. Add
      them to the catalog with guidance on when to use each, and check they
      theme acceptably.

## Later

- [ ] **A screen reader pass.** Web Awesome carries most of this, but our own
      components and patterns are ours to check.
- [ ] **Visual regression testing.** Today a person's eyes are the only check.
- [ ] **Decide whether groups need a project-level scope file.** Only if a real
      project finds the default grouping wrong.

## Deferred, with reasons in design.md

- [ ] Validation and self-correction for AI-generated content — build when a
      real pipeline needs it.
- [ ] Static site generator plugins — a recipe first; a plugin only if the
      recipe proves insufficient.
- [ ] A separate npm package for a genuinely huge dependency — decide when one
      appears, not before.
