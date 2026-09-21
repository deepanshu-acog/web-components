# UI Principles: Stage 4

## Stage 4: UI Design

**Purpose:** Give the UX design a concrete visual and structural form, using the existing design system as the foundation.

**Inputs:** The Stage 3 UX design outline, the existing design system (Web Awesome/ATK UI tokens and components, or existing project CSS).

**Decide:**

- **Layout.** Choose the layout shape the task actually needs — single-column for a linear read/write flow, two-column or master-detail for browse-then-inspect or compare tasks, three-panel for navigation + list + detail simultaneously, a wizard/stepper only for a genuinely sequential multi-step process, a dashboard only when the user's task is actually "monitor several independent things at a glance" (not by default for any data-heavy screen). State which shape was chosen and why, in one sentence tied to the task — not "I chose a right rail" but "the right rail holds metadata that must stay visible while the user scans the primary table."
- **Typography.** Use the design system's type scale and role tokens (heading/body/caption roles), not arbitrary sizes. Line length and line height follow the system's readability defaults (see Web Awesome's typography tokens — role-based weights, unitless line heights, ≥1.5 for paragraph text).
- **Color.** Semantic tokens over raw values — a status is `success`/`warning`/`danger`, not a specific hex value. Category data (a provenance class, a non-ranked type) uses a categorical palette; severity/status data uses the semantic success/warning/danger tokens. Never encode a meaningful distinction in color alone — pair it with a label or icon.
- **Spacing.** Use the system's spacing scale (Web Awesome's `--wa-space-*` tokens, scaled by `--wa-space-scale` if a project-wide density adjustment is needed) rather than one-off pixel values.
- **Hierarchy.** One clear "what draws the eye first" per screen, and it should be the thing the user's task actually requires first — not the biggest or most colorful element by accident.
- **Components.** Reuse existing components before building new ones (see `design-system.md`). A container (card, panel) is used only when grouping is actually needed for scanning or separation — not by default around every piece of content ("over-carding").
- **Responsive behavior.** See SKILL.md §12 — decide per-breakpoint content priority, don't just shrink.
- **Interaction states.** Every interactive element needs visible default/hover/focus/active/disabled states — these come from the component library by default; only override with a stated reason.
- **Visual density.** Dense (comparison/scanning, expert users, high data volume) vs. moderate (typical SaaS) vs. sparse (consumer-facing, low-frequency, single-decision flows) — chosen by task and audience, stated explicitly, not left to default.
- **Motion.** Use Web Awesome's transition tokens (`--wa-transition-*` duration/easing) for any animated state change rather than an arbitrary CSS value — motion comes from the same token system as everything else. Motion is functional (confirms a state change: open/close, expand/collapse, reorder, progress) not decorative (an entrance animation with no state meaning). Every animation must respect `prefers-reduced-motion: reduce` — suppress it or fall back to an instant/cross-fade change; this is a correctness requirement, checked in Stage 6 alongside contrast.
- **Loading states.** Decide skeleton vs. spinner by what's known and how long the wait is: **skeleton** when the shape of the incoming content is already known (a table, card, detail panel) and the wait is likely >~300ms — it previews structure and reduces layout shift. **Spinner** for short, structure-less, or indeterminate waits (a button submitting, a small inline fetch). Never show nothing for a wait that isn't instant — an unstated loading state is the same class of gap as an unstated empty state.

**Output:** UI decisions expressed as specific tokens/components/layout choices tied to Web Awesome/ATK UI primitives — not a mood board.

**Don't decide yet:** Nothing — this is the last decision-making stage before Presentation (Stage 5) and Verification (Stage 6).

---

## Anti-slop rules (concrete, not categorical bans)

None of the following are banned. Each is used only when it serves the actual content or task — the test is always "does this element carry information or serve the task, or is it filler":

| Pattern | Use when | Don't use when |
|---|---|---|
| Card grid | Items are genuinely independent, browsable units (a catalog, a set of projects) | Wrapping every section of a single coherent screen in its own card "for visual balance" |
| Gradient | The brand/theme specifically calls for it | Applied to a button or background as unexplained default styling |
| Glassmorphism / heavy blur | A specific overlay-on-content use case calls for it (e.g., a persistent toolbar over scrolling content) | As a general surface treatment with no functional reason |
| Badge / pill | Carries a real, current status or count | Decorating an element with a static label that never changes and adds no information |
| Icon next to a label | Aids fast recognition of a frequent action (search, delete, add) | Attached to body text or headings purely for decoration |
| Shadow | Indicates real elevation (a dialog, a floating menu, a draggable card) | Applied to flat, non-elevated content by default |
| Metric / stat callout | The number is real, current, and answers a question the user has | A placeholder or vanity number with no source and no decision it informs |
| Dashboard layout | The user's actual task is "monitor several independent things at a glance" | Any screen with more than three data points, by default |

If a design decision can't be justified against the task using this table, it's decoration — say so and drop it or ask before adding it.


