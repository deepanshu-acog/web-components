---
title: "Getting Started"
weight: 10
icon: "rocket"
---

Get from nothing to a previewed report in a few minutes.

## Install the CLI

```bash
atk install --pack atk-utils
```

This installs the `atk-ui` binary to `~/.aganitha/bin/`. It self-updates from
the latest GitHub release each time it runs.

## Scaffold a project

```bash
atk-ui start astro my-app
```

## Preview a report

Write a Markdown file with a `layout` in its frontmatter, then:

```bash
atk-ui preview report.md --watch
```

This compiles the page with Hugo, bundles the Web Awesome and atk-ui
components, and serves it at `http://localhost:1313/` with live reload.

## Next steps

- Pick a [layout](/docs/layouts/) that matches your content.
- Browse the [component catalog](/docs/components/).
