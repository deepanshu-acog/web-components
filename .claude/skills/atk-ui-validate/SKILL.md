---
name: atk-ui-validate
description: >-
  Automated evaluation and visual audit checklist for AI-generated Aganitha pages
  and reports. Validates tag choices, token compliance, data script tags, and accessibility.
allowed-tools: Read, Bash
---

# `atk-ui-validate` — LLM Generation Audit Protocol

Use this skill to audit, evaluate, and validate any AI-generated page or Markdown report against Aganitha's component and design standards.

---

## 4-Point Evaluation Checklist

### 1. Component Selection Audit
- ✅ **Valid:** Uses native Web Awesome primitives (`<wa-page>`, `<wa-card>`, `<wa-badge>`, `<wa-callout>`) and custom ATK components (`<atk-metric>`, `<atk-sidenote>`, `<atk-timeline>`, `<atk-mermaid>`, `<atk-molstar>`, `<atk-data-table>`).
- ❌ **Invalid:** Inventing non-existent HTML tags (e.g. `<atk-button>`, `<atk-card>`) or raw un-styled `<div>` clusters where standard components exist.

### 2. Data Passing Pattern Audit
- ✅ **Valid:** Complex arrays and tabular data are passed via `<script type="application/json">` or `<script type="text/csv">` children inside `<atk-metric>` and `<atk-data-table>`.
- ❌ **Invalid:** Passing JSON arrays inside HTML attributes (`series="[1,2,3]"`).

### 3. Design Token Compliance Audit
- ✅ **Valid:** All spacing, fonts, and colors reference `--wa-` custom properties (`var(--wa-space-m)`, `var(--wa-color-brand-fill-loud)`).
- ❌ **Invalid:** Hardcoded hex colors (`#0071ec`, `#ffffff`), pixel margins (`margin: 16px`), or raw font-family declarations.

### 4. Accessibility & Interactive Event Wiring Audit
- ✅ **Valid:** Pagination uses `<wa-pagination>` with `total` and `page-size` properties and listens to `@wa-change`. Forms use standard `<wa-input>` and `<wa-button>`.
- ❌ **Invalid:** Non-semantic clickable `<div>`s without `role` or keyboard event listeners.

---

## Automated Verification Commands

Run the repository verification suite to check for token errors or stale catalog files:

```bash
make check
```
