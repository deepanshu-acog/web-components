import { html, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { AganithaComponent } from "../../base.js";
import { define } from "../../define.js";

/**
 * A declarative milestone item child for `<atk-timeline>`.
 *
 * @customElement atk-timeline-item
 * @summary A single milestone item in an atk-timeline.
 *
 * @atk-use Specifying an individual milestone with date, title, status, and description.
 * @atk-avoid Do not use outside of an `<atk-timeline>`.
 *
 * @slot - Description or details for this milestone.
 *
 * @example
 * ```html
 * <atk-timeline-item date="Q1 2025" title="Phase I Safety" status="complete">
 *   Primary safety endpoints met.
 * </atk-timeline-item>
 * ```
 */
export class AtkTimelineItem extends AganithaComponent {
  @property({ type: String }) date = "";
  @property({ type: String }) title = "";
  @property({ type: String }) status = "planned";
  @property({ type: String }) tag = "";

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

define("atk-timeline-item", AtkTimelineItem);

declare global {
  interface HTMLElementTagNameMap {
    "atk-timeline-item": AtkTimelineItem;
  }
}
