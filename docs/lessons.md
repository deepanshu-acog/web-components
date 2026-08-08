# Lessons

This is the third attempt at a shared component system at Aganitha. The first
two were `atk-doc-elements` and `wc-docs`. Both still work. Neither was adopted.

The earlier repository ([aganitha/atk-ui-v0](https://github.com/aganitha/atk-ui-v0),
archived) contains a detailed account of why they stopped, written by reading
their code. **That account was wrong in its emphasis, and this file supersedes
it.** It concluded that the first attempt was too small to grow and the second
was too heavy to start using and too complex to contribute to. Those things are
true about the code. They are not why people did not adopt it.

## What people actually said

The findings below come from talking to engineers, not from reading
repositories.

**They liked the components.** This is the single most important correction. The
component work was not the problem, and the catalog was not too small. People
looked at what existed and wanted it.

**They did not know what existed.** Discovery was raised as a problem in its own
right, and it has three parts, all of which have to be solved together:

- *What is there* — no browsable list of the catalog
- *What it looks like* — a name and a description do not tell you whether a
  component suits your page
- *What it looks like in use* — people wanted whole example applications, not
  isolated component demonstrations

**They could not work out how to use it.** Even for a component they had found
and wanted, there was no path from "this looks useful" to "this is in my
application." No starting point, and nothing that would tell their AI assistant
how to use any of it.

**They did not want to contribute.** Contributing components was described as too
complicated. This matters less than it appears: people contribute to systems they
already use. Contribution is downstream of adoption, and both earlier attempts
failed before anyone got that far.

**They already have a working alternative.** "I know how to develop apps with
React. My LLM agent knows how to build them. Why should I use this new system? I
have to learn something new." This is a reasonable position and any version of
this project has to answer it.

## What they asked for instead

Every request was about getting started or about teaching an assistant, not
about parts:

- Teach my AI what components exist and how they look
- Templates to start an app — Hugo, Astro, Next
- A way to start a new project, or migrate an existing one, using skills
- A way to ask an assistant to produce a document or report using the components
- How to use these from JSX or TSX
- A layout, so I do not have to think about page structure

## What follows from this

**The competitor is not another component library. It is "let the assistant
invent it,"** which already works for these people. That sets the bar: we win by
producing a better first result faster, or we do not win.

**We cannot sell consistency.** Consistency is the company's benefit. The
engineer pays the learning cost and someone else collects the value, so an
engineer who declines is behaving sensibly. The pitch has to be that they make
fewer decisions and their assistant produces better output. Consistency then
arrives as a side effect.

**The on-ramp is the product.** Templates, the catalog, a visual reference, and a
project-init path are not supporting material around the components. For adoption
they matter more than the components do, because the components were already
liked and still went unused.

**Build the on-ramp before the contribution path.** The contribution contract in
this repository is sound and stays. It is not what unblocks adoption, and
ordering it first repeats the mistake of building what the maintainers found
interesting rather than what the users were stuck on.
