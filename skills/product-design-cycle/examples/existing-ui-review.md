# Worked Example: Existing UI Review

**Request:** "Here's our client-portfolio dashboard [screenshot + code]. It feels dated, can you make it look better?"

**Stage 0 — Triage:** Not a scientific dossier. Not a single narrow ask (the request implies both critique and redesign). Full cycle applies, scaled down since it's one existing screen, not a new application.

**Stage 1 — UI Vision (inferred from the code):** An internal tool for financial advisors to see their book of clients. Not client-facing. Constraint: existing React + a partial Web Awesome integration already in the codebase (confirmed from `import '@awesome.me/webawesome'` in the bundle).

**Stage 2 — UX Spec (mostly inferred, one assumption marked):**
- Primary user: an advisor scanning many clients quickly — inferred from a 40-row table with no pagination and dense columns.
- Task: identify which clients need attention today (inferred from an existing but unstyled "flag" column).
- Assumption, marked: the "flag" column means "needs review," since there's no tooltip or label confirming this — flagged to check with the requester rather than guessed silently.
- States: the code has no empty state or loading state implemented at all — this is a real gap, noted for Stage 6.

**Stage 3 — UX Design:** No changes to IA — the single-table view matches the "scan many clients" task well. The gap isn't structural, it's visual and state-handling.

**Separate functional vs. cosmetic (per design decision rules):**
- Functional problems (fix first): no empty/loading state; the "flag" meaning is unlabeled; contrast on the flag icon fails against the light background (checked against Web Awesome's `*-on-*` pairing — it isn't using one, it's a raw hex value).
- Cosmetic-only: dated typography, inconsistent spacing between rows.

**Stage 4 — UI Design:** Replace raw hex values with Web Awesome semantic tokens already available in the codebase (`--wa-color-warning-*` for the flag, since it represents a status, not a raw brand color). Apply the existing `--wa-space-*` scale to row padding instead of the mixed 8px/12px/10px currently hardcoded. Typography: adopt the existing but unused type-role tokens rather than introducing a new font.

**Stage 5 — Presentation:** Table stays a table (compare-across-rows task, confirmed correct). Add the missing empty state ("No clients match this filter") and loading skeleton — currently absent entirely.

**Stage 6 — Verification:**
- UX: fails today on "are all states handled" — flagged as the top-priority fix, not the typography.
- Accessibility: flag-icon contrast fails — fixed by using the token, not by picking a new one-off color.
- Implementation: no new components needed — everything is achievable with tokens already imported but unused in this codebase. No custom CSS required.

**What this skill changed vs. a plain "make it look nicer" pass:** the actual highest-priority fix was two unhandled states and a broken contrast value hiding behind existing but unused tokens — not a font change. A pure aesthetics pass would have re-skinned the table and left the accessibility failure and the missing empty state in place.
