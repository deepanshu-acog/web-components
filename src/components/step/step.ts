import { html, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { AganithaComponent } from "../../base.js";
import { define } from "../../define.js";

/**
 * A declarative step item child for `<atk-process>`.
 *
 * @customElement atk-step
 * @summary A single numbered step in an atk-process sequence.
 *
 * @atk-use Specifying an individual step with a title and description inside
 * an `<atk-process>`.
 * @atk-avoid Do not use outside of an `<atk-process>`. For a chronological or
 * status-tracked milestone, use `<atk-timeline-item>` instead.
 *
 * @slot - Description or details for this step.
 *
 * @example
 * ```html
 * <atk-step title="Select a subtype">
 *   Choose the patient subtype that matches the presenting phenotype.
 * </atk-step>
 * ```
 */
export class AtkStep extends AganithaComponent {
  @property({ type: String }) title = "";

  /** Optional short tag shown after the title (e.g. "Optional", "5 min"). */
  @property({ type: String }) tag = "";

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

define("atk-step", AtkStep);

declare global {
  interface HTMLElementTagNameMap {
    "atk-step": AtkStep;
  }
}
