---
name: atk-ui-contribute
description: >-
  Add a component or pattern to atk-ui, or review one. Use when contributing to
  Aganitha's shared UI layer. Not for using atk-ui in an application — the
  atk-ui skill covers that.
allowed-tools: Read, Write, Edit, Bash
---

# Contributing to atk-ui

`make check` enforces everything mechanical: types, tests, that tokens exist,
that no colour is hardcoded, that tag names agree, and that generated files are
current. **This file covers only what a machine cannot decide.**

## 1. Does it belong here at all?

Web Awesome has more than 50 components, a utility CSS layer, and page layout.
Building something it already has is the most expensive mistake available here.

Check before you start:
`node_modules/@awesome.me/webawesome/dist/skills/webawesome/SKILL.md`

If it exists there, use the `wa-` element directly. **Do not wrap it.** We wrap
third-party components so we can replace them later; we are not going to replace
Web Awesome behind an application's back.

## 2. Pattern or component?

**If it needs no JavaScript, it is a pattern.** Most contributions are patterns.

A **pattern** is two files:

- `src/patterns/<name>/<name>.css` — classes prefixed `atk-`
- `src/patterns/<name>/<name>.md` — front matter with `name`, `kind`, `group`,
  `summary`, `use`, `avoid`, then the markup and notes

A **component** is one file, `src/components/<name>/<name>.ts`. It extends
`AganithaComponent`, registers with `define()`, and its comment block carries
`@customElement <tag>`, `@summary`, `@atk-use`, `@atk-avoid` and `@example`.

Copy `record-list` or `metric` — both exist to be copied.

## 3. Write `@atk-use` and `@atk-avoid` for choosing, not describing

`@summary` says what the thing is. These two say **when to pick it over
something else**, which is what an assistant gets wrong most often.

- Weak: *"A list of records."* — that is the summary again.
- Strong: *"Use it whenever the alternative would be a table with two or three
  columns."*

`@atk-avoid` should name what to use instead.

## 4. Four traps that fail silently

1. **Web Awesome's utility classes do nothing inside a component.** Tokens cross
   the shadow boundary; classes do not. `wa-visually-hidden` in a shadow root is
   dead code.
2. **A container query needs `container-type` on the container**, or it never
   matches and the layout you wrote never appears.
3. **Never signal with colour alone.** If colour carries meaning, say it in words
   too.
4. **Third-party dependencies: check the resolved tree, not the package you
   named.** The risky package is usually one nobody installs on purpose. Check
   the licence and the last release date. Under D12, adding it means we support
   it from then on.

## 5. Before you push

```bash
make generate && make check
```

Commit the generated files. They ship in the package.

---

**If this file needs to grow past about fifty lines, fix the contract, not this
file.** A long checklist means the work is too complicated. The previous attempt
shipped a 177-line guide for adding one component and had one contributor.
