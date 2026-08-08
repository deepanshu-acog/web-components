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

Two earlier attempts stopped part way, and interviews found something other than
what their code suggested: **engineers liked the components and still did not use
them.** They could not find out what existed, could not see what things looked
like, and had no path from wanting a component to running it. See
[`lessons.md`](lessons.md).

That sets what this project competes against. It is not another component
library — it is "let the AI assistant invent it," which already works for the
people we are asking to switch. They pay the learning cost, and consistency
benefits the company rather than them, so an engineer who declines is behaving
sensibly. **We win by producing a better result faster, or we do not win.**

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

**Core team member** — builds the components. Not every team contributes, and
that is deliberate. Their main input is the applications other teams are already
writing: when the same structure shows up in three applications under three
different names, it belongs here. They write one file and the documentation and
the assistant's catalog are produced from it, so extending the catalog never
means extending the documentation by hand.

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
  applications than any central group can survey. Since components are built by
  a core team rather than by every team, the catalog only stays relevant if that
  team keeps harvesting from the applications teams are actually writing.
- **An engineer can find out what exists, see what it looks like, and see it in
  a real application** without asking anyone. Discovery failed in both earlier
  attempts and is the first thing to get right.
- **An engineer can go from nothing to a working, branded page without making
  decisions they do not care about.** Usage was confusing in both earlier
  attempts, and it blocked people before contribution ever became the issue.
- **The catalog an AI assistant reads is always current and accurate.** A
  component that exists in code but is missing or wrong in the catalog is a bug,
  not a documentation gap.
- **A production build ships only what the application uses.**
- **Consistency with no designer involved.** Two teams working separately
  produce results that look like the same company.
- **What is learned in preview works unchanged in a real application.** Tag
  names, attribute names, and token names do not differ between the two.

## Success looks like

The measure that matters is **time from an empty directory to a working, branded
page**. Everything else follows from it. If that time is not clearly better than
asking an assistant to invent a page from nothing, we have not earned the
learning cost, and an engineer who declines is right to.

- An engineer who has never used atk-ui runs one command and has a working,
  branded application they can start editing.
- An engineer can find out what exists, see what it looks like, and see it used
  in a real application — without asking anyone.
- An AI assistant asked to build a page picks appropriate components without
  anyone naming them in the prompt.
- Three or more internal projects depend on it within two quarters, and no new
  internal project writes its own callout, card, or table.
- Two teams build separately and the results look related.
Not a goal: engineers outside the core team contributing components. That was
tried and it did not work, and people were stuck on discovery and usage long
before they got that far.

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
