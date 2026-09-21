---
name: product-design-cycle
description: Use when designing, reviewing, or implementing UI for web applications — especially complex, data-heavy, scientific, or product interfaces — built on Web Awesome / ATK UI. Provides a repeatable Understand → Analyze → Decide → Design → Implement → Verify workflow, concrete design-decision rules, design-system usage rules, accessibility and responsive rules, and a verification checklist. Not a "make it beautiful" prompt — every rule resolves to a specific, checkable decision. Hands off to aganitha-ui-ux-design-cycle for prose-plus-structured-data scientific dossiers, and to design-system/design-critique/accessibility-review for narrower single-topic work.
---

# Product Design Cycle

## 1. Name

`product-design-cycle`

## 2. Scope

This skill governs how Claude designs, reviews, improves, or implements UI for web applications — new screens, existing-UI improvements, and full-page or in-page components — built primarily on **Web Awesome** and, where accessible, **ATK UI**. It is the general product-design workflow. It is not a visual-style generator and it is not a replacement for narrower skills that already own a single topic (research, critique, accessibility audit, copy, or the scientific-provenance presentation rules already owned by `aganitha-ui-ux-design-cycle`).

## 3. When to use

- A request to design a new screen, page, or flow for a web application.
- A request to review, critique, or improve an existing UI (screenshot, code, or Figma link).
- A request to implement a UI from a spec, wireframe, or description.
- A request that names Web Awesome, ATK UI, or asks to "make this look like a real product."
- Any UI work involving dense data, scientific content, tables, metadata, evidence, or long-form content alongside interactive controls.

## 4. When NOT to use

- **Pure prose/structured-data scientific dossiers** (an artifact page pairing a generated summary with provenance-tagged structured data, sources, and absence semantics) — hand off to `aganitha-ui-ux-design-cycle` after Stage 1 (UI Vision) confirms that's what this is. Do not re-derive its provenance/absence/presentation doctrines here.
- **A single, narrow ask that an existing skill already owns fully** — a standalone accessibility audit (`accessibility-review`), a pure critique of a finished screen with no design work requested (`design-critique`), UX copy only (`ux-copy`), or a design-system audit with no new UI (`design-system`). Call those directly; don't route them through the full six-stage cycle.
- **Marketing pages, landing pages, decks, or brand assets** with no application logic — this skill is about product UI, not marketing design.
- **A component's exact API** (props, slots, events) — that's the `webawesome` component-reference skill's job, not this one's. Reach for it directly.

## 5. Inputs

Before starting, establish what's actually available. Don't ask for everything — check what exists first:

- Existing code / repo (if provided or connected) — treat as evidence of current implementation, not as automatically correct.
- Existing design tokens / theme configuration (Web Awesome `wa-theme-*`, `wa-palette-*`, brand/neutral/semantic classes, or ATK UI equivalents if accessible).
- Screenshots or a live URL of the current UI, if one exists.
- A brief, spec, or PRD, if one exists.
- The user, task, and content type — inferred from the above where possible, asked for only when a design decision would otherwise be a guess with real consequences (see `references/ux-principles.md` for the infer/assume/ask/stop procedure).

## 6. Workflow

Seven stages, each producing a concrete output before the next begins. Do not skip from requirements straight to markup.

**Requirements → UI Vision → Design Alignment → UX Specifications → UX Design → UI Design → Presentation → Verification**

| Stage | Purpose | Produces |
|---|---|---|
| 0. Triage | Decide which skill actually owns this request | A routing decision, stated explicitly |
| 1. UI Vision | What this surface is / isn't, constraints, content characteristics | A short vision statement |
| 1.5. Design Alignment | Lock the handful of decisions that actually shape this screen, defaulted to Aganitha's design language | A short filled checklist, not a questionnaire |
| 2. UX Specifications | Users, needs, journeys, states, data relationships | A UX spec |
| 3. UX Design | IA, navigation, flows, routes, search/filter, states | A UX design outline |
| 4. UI Design | Layout, tokens, components, responsive behavior, interaction states | UI decisions, tied to Web Awesome/ATK UI primitives |
| 5. Presentation | How each content type is actually shown | Content-to-presentation mapping |
| 6. Verification | UX / UI / accessibility / implementation check | A pass/fail review with fixes |

Full stage definitions (purpose, inputs, decisions, outputs, open questions, what NOT to decide yet) are in `references/ux-principles.md` (stages 1, 1.5–3) and `references/ui-principles.md` (stages 4–6 structural parts). Keep this lightweight — a paragraph per stage for a small task, not a document per stage.

### Stage 0: Triage (do this first, always)

Ask, in order:
1. Is the deliverable prose synthesis + structured data + sources + absence semantics (a research dossier, an evidence artifact)? → Hand off to `aganitha-ui-ux-design-cycle`.
2. Is it a single narrow ask a specialist skill already owns outright (accessibility audit only, critique only, copy only, design-system audit only)? → Call that skill directly, skip the full cycle.
3. Otherwise → proceed through Stages 1–6 below, scaled to the size of the task (a one-component tweak doesn't need six paragraphs of ceremony; a new application does).

### Stage 1: UI Vision
Define what the product/surface is, what it explicitly is not, primary surfaces, major constraints, data/content characteristics, and design-system constraints (Web Awesome? ATK UI? both? neither yet?). See `references/ux-principles.md`.

### Stage 1.5: Design Alignment Checklist
Before deeper UX/UI work, run the short alignment gate: select only the decisions that actually matter for this screen, default each to Aganitha's design language / existing repo conventions / the request itself, and present the filled checklist rather than a list of questions. Only ask the user when a decision is both materially UX-changing and genuinely unresolved. See `references/ux-principles.md` for the full checklist bank and default rules.

### Stage 2: UX Specifications
Define users, needs, journeys, tasks, important states, data relationships, permissions, continuity/history. Distinguish real research (cite it) from reasonable inference (mark it) from a working assumption (mark it and flag as revisable). See `references/ux-principles.md`.

### Stage 3: UX Design
Define information architecture, navigation, page structure, routes, relationships between surfaces, filters, search, deep linking, sharing, states, workflows. Focus on how the user actually accomplishes the task, not on what looks like a complete app. See `references/ux-principles.md`.

### Stage 4: UI Design
Define layout, typography, color, spacing, hierarchy, components, responsive behavior, interaction states, visual density, accessibility — using the existing design system first. See `references/ui-principles.md` and `references/design-system.md`.

### Stage 5: Presentation
Define how each content/data type is actually shown — tables, metadata, charts, images, scientific data, long-form content, references, evidence, structured outputs, files, empty states, microcopy. Choose presentation based on the user's task and the nature of the information, not a default template. See `references/data-heavy-ui.md`.

### Stage 6: Verification
Run the UX / UI / accessibility / implementation checklist in `references/accessibility.md` and the review criteria in this file's §15. Produce a pass/fail list with concrete fixes, not a vague "looks good."

## 7. Design decision rules

These resolve to a specific choice — none of them are taste statements:

- **Reuse before inventing.** Before creating a new pattern, check whether an existing component, token, or pattern (in the project's code, or in Web Awesome/ATK UI) already does the job. A new pattern requires a stated reason the existing ones don't fit.
- **UX before decoration.** A UX problem (the user can't complete the task, can't find something, hits an unhandled state) is fixed before any visual polish pass starts on the same screen.
- **Don't beautify without improving usability.** If a redesign changes only visual style and none of the identified UX problems, that's not what was asked for — say so.
- **Separate functional from cosmetic problems, and prioritize functional first**, when reviewing an existing UI.
- **Every "why" must be concrete.** "Make it modern / clean / professional" is not an instruction Claude can act on — restate it as a specific token, layout, or component decision before proceeding.
- **Anti-slop, not anti-decoration.** Gradients, glassmorphism, shadows, badges, pills, and card grids are not banned — they're used only when they serve the actual content or task, never as default filler. If a screen has three metrics and a card grid displays twelve, that's the default-filler failure, not "adding polish."
- **Custom code is a last resort, and must be named as such.** If a decision isn't supported by the existing design system, say explicitly: "this is a custom/new decision, not something the system already provides," rather than presenting it as if it were standard.

## 8. Design-system rules

Full detail in `references/design-system.md`. In brief:

- Hierarchy: **Design principles → Design tokens → Components → Patterns → Layouts → Pages.** Don't skip a level (don't hand-write a color when a token exists; don't build a bespoke layout when `<wa-page>` or an existing app-shell pattern covers it).
- If Web Awesome is the implementation foundation: use its existing tokens, themes, and components as the foundation, not a parallel system. Don't invent token names, component names, or props that aren't confirmed in Web Awesome's own documentation.
- If ATK UI is available through a connected environment, inspect and prefer its existing components, tokens, and conventions over Web Awesome's raw defaults, since ATK UI is presumably a themed/extended layer on top. **If ATK UI is not accessible in the current session, say so explicitly and fall back to Web Awesome's own defaults — do not guess at ATK UI's contents.**
- Any custom token, component, or pattern not found in the existing system must be labeled as a custom extension, with the reason it was needed.

## 9. UX rules

Full detail in `references/ux-principles.md`. In brief: understand the current product and user before proposing change; identify what already works before what's broken; every screen should have a clear task the user is accomplishing; every state (empty, loading, error, partial, permission-denied) must be explicitly designed, not left implicit.

## 10. UI rules

Full detail in `references/ui-principles.md`. In brief: one clear visual hierarchy per screen; typography and spacing come from tokens, not arbitrary values; visual density matches the task (scanning/comparison work is denser; single-decision flows are sparser); every interactive element has visible states (default/hover/focus/active/disabled).

## 11. Accessibility

Full checklist in `references/accessibility.md`. Applied as a design constraint from the start, not a pass done at the end: contrast (checked against the *-on-* token pairing and must clear WCAG 2.1 AA — 4.5:1 for normal text, 3:1 for large text ≥18pt/14pt-bold and for UI-component/graphical-object boundaries — not eyeballed), keyboard operability, visible focus states, semantic structure (real headings/landmarks/lists, not divs with visual styling only), readable text sizes, and touch target sizes on any touch-capable surface (24×24 CSS px minimum, 44×44 comfortable).

## 12. Responsive behavior

Decide the responsive strategy per surface, not by uniformly shrinking the desktop layout:
- Identify what's primary vs. secondary content at each breakpoint.
- Secondary/contextual information (metadata rails, related items) typically collapses into a drawer or a secondary tab on narrow viewports rather than disappearing or stacking below the fold indefinitely.
- State explicitly what changes at each breakpoint (e.g., "three-panel desktop → two-panel tablet → stacked mobile with metadata in a drawer") rather than leaving it implicit.
- **Internationalization / text length.** If the product will be (or already is) translated, check critical UI text — button labels, nav items, table headers, form labels — against realistic translated-string length, not just the source-language string. German, Finnish, and French commonly run 30–35% longer than English; some CJK labels run shorter but taller. A button or nav item sized to fit only the English string will truncate or wrap unpredictably once translated — either allow for reasonable growth in fixed-width UI chrome (buttons, tabs, sidebar labels) or confirm truncation/wrap behavior is acceptable there. If the product supports an RTL locale, note that layout mirrors (not just text direction) — icons implying direction (back/forward arrows) and layout order should be checked, not assumed to just work.

## 13. Implementation awareness

If code already exists, treat it as evidence of the current implementation, not as the correct design. For each notable piece:
- State what should remain, what should change, and why.
- Prefer existing components, reusable patterns, established tokens, and accessible primitives already in the codebase or design system over new custom implementation.
- Flag unnecessary custom CSS/components where an existing primitive already covers the need.

## 14. Verification

Before calling a design done, check (see `references/accessibility.md` for the full checklist):

**UX** — Can the user complete the task? Is navigation understandable? Is information discoverable? Is hierarchy clear? Are all states handled? Is the workflow coherent end-to-end?

**UI** — Is hierarchy clear? Are spacing/typography consistent (tokens, not arbitrary values)? Are components used consistently? Is visual density appropriate to the task?

**Accessibility** — Contrast, keyboard navigation, focus states, semantic structure, readable text, responsive behavior.

**Implementation** — Reusable components used where they exist, existing design-system usage (not a parallel system), responsive behavior implemented (not just described), no unnecessary custom solutions.

## 15. Output expectations

- State which stage(s) of the cycle were actually needed for this task — don't perform all six for a one-component change.
- Distinguish, explicitly, between: information found in a reference (Web Awesome docs, existing code, ATK UI if accessible), design reasoning derived from that reference, and a new recommendation being introduced that isn't backed by either.
- If a referenced source (ATK UI, or any other) was inaccessible, say so plainly rather than presenting a guess as fact.
- Any custom/new design decision not backed by the existing system is labeled as such.
- End with the Stage 6 verification pass, not with an unqualified "this looks great."

## 16. References to supporting files

- `references/ux-principles.md` — Stages 1, 1.5–3 in full: UI Vision, the Design Alignment Checklist (checklist bank, Aganitha defaults, ask/default rules), UX Specifications, UX Design, plus the infer/assume/ask/stop procedure for filling gaps without over-asking.
- `references/ui-principles.md` — Stage 4 in full: layout, typography, color, spacing, hierarchy, responsive behavior, interaction states, and the anti-slop rule set with concrete examples.
- `references/design-system.md` — The Aganitha design-language defaults, the token→component→pattern→layout→page hierarchy, Web Awesome specifics (theming layers, `<wa-page>` decision, custom-CSS playbook, shadow-DOM boundary), and the ATK UI accessibility-check procedure.
- `references/accessibility.md` — The full accessibility and verification checklist.
- `references/data-heavy-ui.md` — Stage 5 in full: presentation rules for tables, metadata, charts, scientific data, long-form content, evidence, files, and empty states, plus when to hand off to `aganitha-ui-ux-design-cycle`.
- `templates/ux-spec.md`, `templates/ui-spec.md`, `templates/design-review.md` — Lightweight fill-in templates for Stages 2, 4, and 6.
- `examples/existing-ui-review.md`, `examples/new-ui-design.md` — Worked examples showing the cycle applied end-to-end.
