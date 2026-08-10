---
name: atk-ui-start
description: >-
  Start a new project with atk-ui, or add atk-ui to one that already exists.
  Use when someone asks to start, scaffold, or create a project using atk-ui,
  Aganitha's shared UI layer. For what components and patterns exist, or how
  to use one, see the atk-ui skill instead — this one only gets a project
  running.
allowed-tools: Bash, Read
---

# Starting a project with atk-ui

This skill drives the `atk-ui` CLI. It does not reimplement what the CLI
does — if the two ever disagree, the CLI is right and this file is stale.

## New project

```bash
atk-ui start astro <dir>
```

One command: scaffolds a themed Astro project into `<dir>`, installs
dependencies, and starts the dev server. `<dir>` must not exist yet, or must
be empty. Only `astro` is supported today — if asked for another stack,
say so rather than guessing at one.

Not sure `atk-ui` is on `PATH`? Run `atk-ui --version` first. If that fails,
say so and stop — do not try to install or build it another way.

## Existing project

There is no CLI command for this yet. Follow
[the atk-ui skill's installation reference](../atk-ui/references/installation.md)
by hand.

## Before or instead of starting

`atk-ui preview` runs a local, browsable catalog of every component and
pattern — offer it when someone wants to see what atk-ui looks like before
committing to a project.

## After starting

Read the `atk-ui` skill for what to build with. If the work is generic UI —
buttons, inputs, dialogs, layout — that is the `webawesome` skill, not this
one; atk-ui only covers what Web Awesome does not.
