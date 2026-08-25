---
title: "Marketing Layouts"
weight: 20
icon: "bullhorn"
---

Full-width views with a hero and no side navigation — just the top navbar.

## `landing`

The homepage / marketing layout. Driven entirely by frontmatter:

```yaml
---
title: "Global GDP Landscape"
subtitle: "One line describing the page."
layout: landing
badge: "Global Economic Intelligence"
cta_primary:   { label: "Top Economies", url: "#top", icon: "ranking-star" }
cta_secondary: { label: "By Region", url: "#region", icon: "earth-americas" }
hero_stats:
  - { value: "$110T", label: "World GDP", sublabel: "2025 estimate" }
---
```

The hero (badge, title, subtitle, CTAs, stat cards) renders from those fields;
the Markdown body becomes the sections below it.

## The site shell

The top navbar and footer are not part of any single layout — they live in the
site shell and appear on every page. Configure the navbar in `hugo.toml` under
`[[menu.main]]`.
