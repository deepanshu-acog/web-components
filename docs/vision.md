# Vision — atk-ui

## In one line

For **Aganitha engineers building internal apps and sites**, who need them to
look right and work well without spending design effort, **atk-ui** is
**Aganitha's shared UI layer**: our brand applied to a maintained upstream
component library, the few components that library does not have, and the agent
skills that let an AI assistant use all of it correctly. Unlike **each project
choosing its own UI library**, it **makes the branded, accessible choice the
easiest one to make** — in a Next.js app or in a single HTML page.

*A company theme and a small set of extras on top of a component library, plus
the documentation an AI assistant actually reads.*

## Problem

Every Aganitha project re-answers the same questions: which UI library, which
icons, what spacing scale, what a callout looks like. The answers differ per
project, so nothing is reusable and nothing looks related.

Two earlier attempts at solving this stopped part way. **The reasons are being
re-examined** — see [`lessons.md`](lessons.md). Do not treat the earlier
explanation as settled until that file is rewritten from the interviews.

What changed, and why a third attempt is worth making: a maintained upstream
library now covers most of the ground. Both earlier attempts spent the majority
of their effort on work that is now available, free and MIT licensed —
accessible components, theming, form handling, server rendering, framework
support, and even agent skills. The remaining work is much smaller than it was:
our brand, the components specific to how we work, and making all of it usable
by an AI assistant. This project should stay that small.

## Who it serves

**App developer** — building a real application in one of the stacks we
actually use: Astro, Next.js, Hugo, or plain React. Installs the package,
applies the Aganitha theme, and uses components. Which stack they picked should
change how the code is loaded and nothing else. This is the primary path, and
the one everything else is judged against.

**AI-assisted developer** — the same person, working with an assistant. The
assistant has our skills installed and knows what components exist, which one
fits the task, and how to configure it correctly. In practice this is how most
people will discover what is available, so the catalog an assistant reads
matters as much as the documentation a person reads.

**Junior contributor** — an engineer with a component worth sharing. Follows a
checklist, writes one file, and the documentation and the assistant's catalog
are produced from it. They should not need to understand the build system, the
release process, or the rest of the repository. If contributing needs more
knowledge than a checklist can carry, that is a fault in the system, not in the
contributor.

**Page author and learner** — wants to see what exists, or build one throwaway
page. Loads a preview and writes plain HTML. What they learn transfers directly,
because the markup in the preview is the same markup a real application uses.

## Must satisfy

- **Work in every stack we use.** Astro, Next.js, Hugo, and React are all in
  active use, and more will appear. A component that works in only one of them
  is not usable here. This constraint drives more of the design than any other.
- **Do not rebuild what a maintained upstream library already does well.** Our
  effort goes into what is ours: the brand, our own components, and the agent
  layer.
- **We cannot enumerate what teams will need.** Aganitha builds far more
  applications than any central group can survey, so the system must let teams
  add what they need rather than depend on us predicting it.
- **A junior engineer can contribute with a checklist**, without knowing how the
  build, the release, or the packaging works.
- **The catalog an AI assistant reads is always current and accurate.** A
  component that exists in code but is missing or wrong in the catalog is a bug,
  not a documentation gap.
- **A production build ships only what the application uses.**
- **Consistency with no designer involved.** Two teams working separately
  produce results that look like the same company.
- **What is learned in preview works unchanged in a real application.** Tag
  names, attribute names, and token names do not differ between the two.

## Success looks like

*Draft. To be made concrete once the first sample applications exist.*

- The sample applications are built on it, and building them did not require
  changes to atk-ui itself.
- Three or more internal projects depend on it within two quarters, and no new
  internal project writes its own callout, card, or table.
- A junior engineer who has never seen the repository adds a component in under
  a day, using the checklist and the scaffold, with no help from a maintainer.
- An AI assistant asked to build a page picks appropriate components without
  anyone naming them in the prompt.
- Two teams build separately and the results look related.

**Exit criteria.** Two ways this project should stop:

- If only one project depends on it after two quarters, the assumption that
  shared components are wanted was wrong. A fourth attempt at the same idea is
  not the answer.
- If, after the brand theme is written, everything else we add turns out to be
  thin — if the honest description is "a CSS file plus a skill" — then ship it
  as exactly that and close the project. A small thing that works is a good
  outcome. A large thing built to justify a repository is not.

## Not for

- **Being an application framework.** No router, no state management, no data
  fetching.
- **External or public users.** Internal Aganitha projects only.
- **Rebuilding generic UI** that a maintained library already does well.
- **Automated content generation pipelines.** Assistants generating page content
  is a real use, but it needs validation and correction machinery that is not
  justified until a real pipeline exists. Deferred, not rejected.
