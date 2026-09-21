# UX Principles: Stages 1–3

## Before any stage: infer → assume and mark → ask → stop

Don't ask the user to specify everything up front. Work through this escalation for each gap:

1. **Infer.** Check existing code, existing docs, an existing design brief, or the request itself. Most persona/task/content questions are answerable this way. State the inference and where it came from (e.g., "three roles appear in the existing route guards: admin, editor, viewer").
2. **Assume, and mark it.** If inference isn't possible but a reasonable working assumption is, make it, label it explicitly as an assumption, and proceed. ("Assuming this is a desktop-first internal tool since there's no responsive breakpoint in the existing CSS — flag if that's wrong.")
3. **Ask.** Only when a decision would materially change the outcome and can't be reasonably inferred or assumed — e.g., "should the primary action be destructive-by-default (delete) or confirm-first?" Ask narrowly, with concrete options, not "tell me about your users."
4. **Stop.** If proceeding would require an unsupported, high-consequence guess (e.g., a compliance-relevant permission model with no information at all), say so and stop rather than inventing an answer.

Never present a hypothesized persona, goal, or journey as if it came from real user research. If real research exists, cite it. If it doesn't, say the persona is a working assumption.

---

## Stage 1: UI Vision

**Purpose:** Establish what this surface is before deciding anything about how it looks.

**Inputs:** The request itself, any existing code/product, any existing brief.

**Decide:**
- What the product/surface *is* — one or two sentences.
- What it explicitly *is not* (scope boundary — prevents scope creep into a redesign of adjacent surfaces).
- Primary surfaces involved (one screen? a flow? a whole section?).
- Major constraints (existing design system, existing tech stack, must integrate with existing navigation, timeline).
- Data/content characteristics (is this data-heavy? scientific? transactional? read-mostly? write-heavy?).
- Design-system constraints (Web Awesome? ATK UI, if accessible? neither yet — greenfield?).

**Output:** A short vision statement — a paragraph, not a document.

**Don't decide yet:** Specific components, specific layout, specific colors. This stage is scope, not shape.

---

## Stage 1.5: Design Alignment Checklist

**Purpose:** A fast, visible gate between "what this surface is" (Stage 1) and the deeper UX/UI work — surface only the decisions that would actually change the shape of *this* screen, default each one from the request / existing repo / Aganitha's design language, and show the result as a filled checklist. This is not a discovery questionnaire — most items arrive already answered.

**Procedure:**
1. From the request and the Stage 1 vision, select only the checklist areas below that are actually in play. A single settings form doesn't need "data visualization needs"; a one-page monitoring view doesn't need "navigation complexity." Showing an irrelevant item is itself a mistake — skip it silently, don't include it with "N/A."
2. For each selected area, resolve it in this order and stop at the first one that answers it: (a) stated explicitly in the request, (b) shown by existing code/repo conventions, (c) Aganitha's default design language (table below), (d) if none of these resolve it *and* the choice would materially change the UX (not just cosmetic), ask — narrowly, offering the same options already identified, not an open question.
3. Present the result compactly using ●/○, one line per relevant area. Only add a reason when the choice deviates from the Aganitha default — a default doesn't need justifying every time; a deviation does.
4. Proceed straight into Stage 2 using the checklist as settled input. Don't reopen these decisions later without a concrete reason surfaced during design.

**Checklist bank** (include only what's relevant; options are starting points, not a fixed enum — adapt wording to the actual request):

| Area | Include when | Options | Aganitha default |
|---|---|---|---|
| Visual direction | Always | Marketing-focused / Scientific enterprise / Editorial / Data-tool utilitarian | **Scientific enterprise** |
| Information density | Always | Spacious / Medium / Dense | **Medium** — Dense for expert monitoring/comparison tools, Spacious only for a rare consumer-style single-decision flow |
| Layout structure | Always | Single column / Two-column or master-detail / Three-panel / Dashboard | Chosen per Stage 4's layout rule (task-driven) — not defaulted independent of task |
| Navigation complexity | More than one view/route involved | Single page / Tabs (parallel views) / Sidebar with drill-down (deep hierarchy) / Breadcrumb (rare nested) | Chosen per Stage 3's navigation rule (task-driven) |
| Data-heavy vs. content-heavy | Ambiguous from the request | Data-heavy (tables/metrics/structured) / Content-heavy (long-form/prose) / Mixed | Inferred from content, not defaulted |
| Visual hierarchy | Always | Single dominant focus / Balanced multi-section / Task-sequenced (wizard) | **Single dominant focus**, tied to the primary task |
| Responsive behavior | Always | Desktop-primary (internal tool) / Fully responsive / Mobile-primary | **Desktop-primary** for internal scientific/ops tools; **fully responsive** for anything customer- or public-facing |
| Accessibility requirements | Always | Standard WCAG 2.1 AA / Elevated (regulated, public-sector, or explicitly required) | **Standard WCAG 2.1 AA** as the floor, always — never optional |
| Important actions | Always | Single primary action / Primary + secondary set / Multiple equal-weight actions | Chosen by how many genuinely distinct next steps the task has — default to the fewest that are honest |
| Scientific/data visualization needs | Charts, plots, or scientific data are involved | None / Native Web Awesome charts / Custom visualization needed | **Native Web Awesome charts** — custom only if a specific need isn't covered, named explicitly |

**Aganitha design language defaults** (used to resolve any of the above, and Stage 4 decisions, when nothing more specific applies): modern, professional, scientific enterprise; minimal but not empty; strong single hierarchy per screen; neutral surfaces/borders/text by default; brand color reserved for primary actions, active/selected states, and meaningful emphasis — not decoration; subtle borders and elevation over heavy shadows; accessible contrast as a floor, not a target; consistent spacing from the token scale. Full detail in `references/design-system.md`.

**Output:** A short filled checklist (5–8 lines typical), each line either defaulted or, rarely, flagged as a genuine open question for the user.

**Don't decide yet:** The specific token values, component names, or exact layout — this stage locks direction, Stage 4 locks implementation.

---

## Stage 2: UX Specifications

**Purpose:** Establish who this is for and what they're trying to do, before deciding the shape of the solution.

**Decide:**
- Users and their needs — primary and secondary, if more than one role exists (inferred from existing route guards, permission models, or the request; asked only if materially unclear).
- Journeys and tasks — what is the user actually trying to accomplish? What decision are they making?
- Important states — empty, loading, error, partial data, permission-denied, stale content. List them now even if they're designed later.
- Data relationships — what connects to what (a record and its history, a parent and children, an artifact and its sources).
- Permissions, where relevant — who can see/do what.
- Continuity/history, where relevant — does the user need to see what changed, or return to a prior state?

**Output:** A UX spec — use `templates/ux-spec.md`.

**Don't decide yet:** Navigation structure, page layout, specific components.

---

## Stage 3: UX Design

**Purpose:** Establish how the user moves through the product to accomplish the task.

**Decide:**
- Information architecture — content hierarchy, grouping, what belongs together vs. separate.
- Navigation — global vs. contextual, and by what mechanism (sidebar, tabs, breadcrumbs) — chosen by task frequency and hierarchy depth, not by default habit. A single, deep hierarchy typically wants a sidebar with drill-down; a small set of parallel top-level views typically wants tabs; a rarely-visited nested location wants breadcrumbs, not a permanently visible tree.
- Page structure and routes — what's a distinct page/route vs. a state of one page (a drawer, a tab, a modal).
- Relationships between surfaces — how does a user get from a list to a detail view, and back, without losing context (this matters especially for comparison tasks — prefer master-detail over navigating away to a separate page when the user needs to keep comparing).
- Filters, search, deep linking, sharing — only where the task actually needs them; don't add a search bar to a five-item list.
- Workflows — the actual step sequence a user follows (Entry → search → result → inspect → compare → verify → act), stated concretely for this product, not copied verbatim from a generic template.

**Output:** A UX design outline — the routes/states/relationships, in prose or a simple diagram. Not high-fidelity UI yet.

**Don't decide yet:** Exact typography, exact spacing, exact color, specific token values — that's Stage 4.


