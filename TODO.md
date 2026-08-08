# TODO

The only place forward-looking work lives. Reasoning for most items is in
[docs/design.md](docs/design.md).

## Parked

- [ ] **Aganitha brand values.** Colours and typefaces. A separate effort is
      building these, and the values in the current applications are not
      accurate. Until it lands, the theme ships Web Awesome's default values
      with a marker saying they are placeholders. Only the values are blocked —
      the theme mechanism is not, and is built below.

## Blocked on someone else

- [ ] **Interview findings.** What people actually said about why the two
      earlier attempts stopped. `docs/lessons.md` cannot be written until this
      arrives, and the account in the archived repository should not be relied
      on. Rama has this.

## Now

Ordered by risk. The generation step and the contribution contract are the parts
nobody has got right yet, in this repository or either earlier attempt. Build
them first, while they are still cheap to change.

- [ ] **Set up the package.** One npm package, Lit, Web Awesome as a dependency.
      Type checking and tests running. Nothing else.
- [ ] **Prove the generation step.** Documentation comments in a component
      become `custom-elements.json`, then the skill and its reference files.
      Include the check that fails when a generated file is stale — without it
      D6 is a convention, not a guarantee. **This is the highest-risk item.**
- [ ] **One pattern and one component.** The smallest real example of each, to
      prove the two contribution paths in D9 actually work before anyone writes
      a checklist about them.
- [ ] **Write the contributor checklist skill.** Budget is about fifty lines.
      If it needs more, fix the contract. This is the test of whether D9 holds.
- [ ] **Build the theme mechanism.** Which `--wa-` tokens we set, how the theme
      is applied, and how it loads. Web Awesome's default values as placeholders
      until the brand effort lands, so swapping them in later touches one file.

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
