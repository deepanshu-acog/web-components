# atk-ui

Aganitha's shared UI layer: our brand theme, the components we need that our
upstream library does not provide, the `atk-ui` CLI, and the agent skills that
let an AI assistant use all of it correctly.

**Status: Phase 1 (an engineer with an assistant can start) is essentially
done.** Theme, CLI (`preview`, `start astro`, `update`), the Astro starter
template (including a Markdown content layout), and both Phase 1 skills are
built and verified. See [TODO.md](TODO.md) for exact status and what's next.

**New to this repository? Start with [docs/onboarding.md](docs/onboarding.md).**
It sequences everything below and gives you commands to run before you read
anything. [docs/vision.md](docs/vision.md) is why this exists,
[docs/design.md](docs/design.md) is every decision and why, and
[AGENTS.md](AGENTS.md) is the map for working in this repo.

## History

This is the third attempt at a shared component system at Aganitha, and the
second repository named `atk-ui`.

The previous one is archived at
[aganitha/atk-ui-v0](https://github.com/aganitha/atk-ui-v0). It was built on
native custom elements with light DOM, its own design tokens, and its own icon
set. That work is not being continued. The direction changed to building on a
maintained upstream library instead, which made most of the earlier code
unnecessary.

The earlier repository is kept because its design document records the options
that were considered and why. Read it as history, not as guidance — several of
its decisions have been deliberately reversed.
