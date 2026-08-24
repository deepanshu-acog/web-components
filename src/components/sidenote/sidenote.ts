import { css, html, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { AganithaComponent } from "../../base.js";
import { define } from "../../define.js";

/**
 * A side note or marginalia callout for contextual annotations.
 *
 * Placed inline or alongside main prose text to highlight secondary details,
 * definitions, or reference notes without interrupting the core reading flow.
 *
 * @customElement atk-sidenote
 * @summary A marginalia callout for contextual notes and references.
 *
 * @atk-use Highlighting secondary details, definitions, or reference notes
 * alongside main paragraph text in scientific reports and documentation.
 *
 * @atk-avoid Do not use for primary page warnings or alert banners; use
 * `<wa-callout>` instead.
 *
 * @slot - The note content text.
 *
 * @csspart container - The outer sidenote wrapper.
 * @csspart type - The optional badge label for note classification.
 *
 * @example
 * ```html
 * <atk-sidenote type="Note" label="Pharmacokinetics">
 *   Cmax was reached 2.5 hours post-dose across all Phase I cohorts.
 * </atk-sidenote>
 * ```
 */
export class AtkSidenote extends AganithaComponent {
  static override css = css`
    :host {
      display: block;
      margin-block: var(--wa-space-m);
    }

    .container {
      padding: var(--wa-space-s) var(--wa-space-m);
      border-inline-start: 3px solid var(--wa-color-brand-fill-loud);
      background-color: var(--wa-color-surface-lowered);
      border-radius: 0 var(--wa-border-radius-s) var(--wa-border-radius-s) 0;
      font-size: var(--wa-font-size-s);
      color: var(--wa-color-text-normal);
      line-height: var(--wa-line-height-normal);
    }

    .header {
      display: flex;
      align-items: center;
      gap: var(--wa-space-2xs);
      margin-bottom: var(--wa-space-2xs);
      font-weight: var(--wa-font-weight-semibold);
      color: var(--wa-color-brand-fill-loud);
    }

    .type-badge {
      font-size: var(--wa-font-size-xs);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  `;

  /** Category or type label shown above the note text (e.g. "Note", "Reference"). */
  @property({ type: String }) type = "Note";

  /** Optional detailed label or title for the note. */
  @property({ type: String }) label = "";

  override render(): TemplateResult {
    return html`
      <aside part="container" class="container" role="note">
        <div class="header">
          ${this.type ? html`<span part="type" class="type-badge">${this.type}</span>` : ""}
          ${this.label ? html`<span>· ${this.label}</span>` : ""}
        </div>
        <div class="content">
          <slot></slot>
        </div>
      </aside>
    `;
  }
}

define("atk-sidenote", AtkSidenote);

declare global {
  interface HTMLElementTagNameMap {
    "atk-sidenote": AtkSidenote;
  }
}
