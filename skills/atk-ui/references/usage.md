<!-- Generated from the component source. Do not edit; run `make generate`. -->

# Usage

## Components vs. patterns

- **Components** are custom elements — write the tag, like `<atk-metric>`.
- **Patterns** are markup plus our CSS classes, like `atk-record-list` — copy
  the markup from the pattern's reference page, there is no element to
  import.

Both are listed below, grouped the same way. Each entry's reference page has
its attributes, slots, CSS parts, and a runnable example where one exists.

## Tokens

Web Awesome's `--wa-*` custom properties are the vocabulary — atk-ui only
adds a token where Web Awesome has no equivalent. If you are about to write a
literal colour, spacing value, or radius, there is almost certainly a
`--wa-*` token for it already; check the `webawesome` skill before inventing
one.

## Local, one-off components

A need specific to your project — not generic enough for the shared
catalog, or needed before the core team could get to it — does not have to
go without a home. Extend `AganithaComponent` directly in your own project's
`src/components/`, the same way a core team member would:

```ts
import { css, html } from "lit";
import { AganithaComponent, define } from "@aganitha/atk-ui";

export class MyWidget extends AganithaComponent {
  static override css = css`/* --wa-* tokens only */`;
  override render() {
    return html`...`;
  }
}

define("my-widget", MyWidget);
```

Use your own project's tag prefix, not `atk-` — that prefix means "part of
the shared catalog," which this is not, unless the core team later harvests
it. See `templates/astro/src/components/site-note.ts` for a worked example.

## Do not write this from memory

Both Web Awesome and atk-ui appear in training data at older versions.
Read the reference page for a component before using it — attribute names
change between versions.
