# atk-ui

Aganitha's shared UI layer: our brand theme, the components we need that our
upstream library does not provide, and the agent skills that let an AI assistant
use both correctly.

**Status: design in progress. Nothing is built yet.**

Start with [docs/vision.md](docs/vision.md). Design decisions will follow in
`docs/design.md`.

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
