# Accessibility & Verification Checklist

Applied during Stage 4 design decisions, not only as a Stage 6 afterthought.

## Contrast
- Check text/background pairs against the semantic `*-on-*` token pairing the system provides (e.g., a color paired with its designated "on" color), not by eyeballing a hex value.
- Pass/fail thresholds are WCAG 2.1 AA, not a vague "looks readable": **4.5:1** for normal text (<18pt, or <14pt bold); **3:1** for large text (≥18pt, or ≥14pt bold) and for non-text UI elements/graphical objects that carry meaning (icon-only buttons, input borders, focus indicators, chart data elements). A token pairing that doesn't clear these numbers fails, regardless of how it looks.
- Where a contrast lever is needed (e.g., Web Awesome's `loud`/`normal`/`quiet` variant step), use it rather than a one-off custom color.
- Never encode a meaningful distinction (status, category, provenance class) in color alone — pair with a label, icon, or pattern.

## Keyboard & focus
- Every interactive element must be reachable and operable by keyboard alone — tab order should match visual/reading order.
- Every focusable element needs a visible focus state — check the design system's focus tokens are actually applied, not suppressed by a reset.
- Modal/drawer/dialog patterns must trap and return focus correctly on open/close.

## Semantic structure
- Real headings (`h1`–`h6` in a logical order), landmarks, and lists — not visually-styled `div`s standing in for them.
- Form controls have real, associated labels — not placeholder text used as a label substitute.
- Status/error messages are announced (not purely visual, e.g. a color change with no text).

## Readable text
- Body text meets the system's minimum readable size and line-height (Web Awesome: unitless line-height ≥1.5 for paragraph text).
- Line length stays within a comfortable reading measure — don't let body text span an entire wide viewport unconstrained.

## Touch targets & responsive behavior
- On any touch-capable surface, interactive targets meet **24×24 CSS px minimum** (WCAG 2.2 AA, 2.5.8) with **44×44 CSS px** as the comfortable target (WCAG AAA / platform HIG guidance) — don't rely on desktop-density spacing for a touch layout. Where a control must be visually smaller (a dense table's row actions, an icon-only button in a toolbar), keep the *tap area* at the minimum via padding even if the visible glyph is smaller, or provide an equivalent larger control elsewhere.
- Adjacent small targets need enough spacing that a mis-tap doesn't trigger the wrong one — don't rely on size alone when targets sit close together (e.g., inline row actions).
- Confirm the stated per-breakpoint content-priority plan (SKILL.md §12) was actually implemented, not just described.

---

## Stage 6 Verification — full pass

Run all four before calling a design done. Record the answer to each, not just a general impression.

**UX**
- Can the user complete the task, start to finish, without getting stuck?
- Is navigation understandable without explanation?
- Is the information the user needs actually discoverable from where they'd look?
- Is there one clear hierarchy of what matters most on each screen?
- Are all identified states (empty/loading/error/partial/permission-denied) actually handled, not just the happy path?
- Is the overall workflow coherent end-to-end, or does it break down at a handoff between screens?

**UI**
- Is the visual hierarchy clear and does it match the task priority?
- Are spacing and typography consistent — using tokens, not one-off values?
- Are components used consistently for the same kind of content across the product?
- Are design tokens used correctly (semantic tokens for meaning, not raw values copied from one screen to another)?
- Is visual density appropriate for the task and audience?

**Accessibility**
- Contrast checked against real token pairings and clears WCAG AA (4.5:1 normal text / 3:1 large text and UI components).
- Touch targets clear 24×24 CSS px minimum (44×44 comfortable) with adequate spacing between adjacent small targets.
- Keyboard navigation and focus states verified, not assumed.
- Semantic structure verified (real headings/landmarks/labels).
- Text readable at system minimums.
- Responsive behavior actually implemented per the stated breakpoint plan, including translated-string length for critical UI text where the product is/will be localized.
- Motion respects `prefers-reduced-motion`; loading states (skeleton/spinner) are present for any non-instant wait.
- Empty states are differentiated (zero-results / first-run / error), not one generic message; microcopy (labels, errors, confirmations) is real copy, not placeholder text.

**Implementation**
- Reusable components used where they already exist — no unnecessary duplication.
- Existing design-system tokens/components used, not a parallel system invented alongside them.
- Responsive behavior implemented in code, not just described in the design.
- No unnecessary custom CSS/components where an existing primitive already covers the need — and any genuine custom decision is explicitly labeled as such.

If any check fails, state the specific fix — not "needs more polish."
