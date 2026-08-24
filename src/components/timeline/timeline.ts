import { css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { AganithaComponent } from "../../base.js";
import { define } from "../../define.js";

export interface TimelineStepData {
  date?: string;
  title: string;
  description?: string;
  status?: "complete" | "active" | "upcoming" | "planned" | "delayed" | "warning" | "failed" | "terminated" | string;
  tag?: string;
}

export type NormalizedStatus = "complete" | "active" | "delayed" | "failed" | "planned";

export function normalize_status(status?: string): NormalizedStatus {
  const s = (status || "").toLowerCase().trim();
  if (s === "complete" || s === "done") return "complete";
  if (s === "active" || s === "current" || s === "in-progress") return "active";
  if (s === "delayed" || s === "warning") return "delayed";
  if (s === "failed" || s === "terminated") return "failed";
  return "planned";
}

const STATUS_DISPLAY_NAMES: Record<NormalizedStatus, string> = {
  complete: "Complete",
  active: "Active",
  delayed: "Delayed",
  failed: "Terminated",
  planned: "Planned",
};

const STATUS_ICONS: Record<NormalizedStatus, TemplateResult> = {
  complete: html`<wa-icon name="check"></wa-icon>`,
  active: html`<wa-icon name="circle-dot"></wa-icon>`,
  delayed: html`<wa-icon name="triangle-exclamation"></wa-icon>`,
  failed: html`<wa-icon name="xmark"></wa-icon>`,
  planned: html`<wa-icon name="circle"></wa-icon>`,
};

/**
 * A chronological milestone or pipeline timeline component.
 *
 * Displays ordered milestones, clinical trial phases, or historical event progressions
 * with status indicators, date badges, and progress tracking.
 *
 * @customElement atk-timeline
 * @summary A chronological milestone or pipeline timeline display.
 *
 * @atk-use Displaying multi-phase clinical trial progressions, drug development
 * milestones, regulatory roadmaps, or chronological project history.
 *
 * @atk-avoid Do not use for simple un-ordered lists or key-value pairs. Use a
 * record list or table instead.
 *
 * @slot - Child `<atk-timeline-item>` elements, `<div class="step">` markup, or `<script type="application/json">`.
 *
 * @example
 * ```html
 * <atk-timeline title="Clinical Development Milestones">
 *   <div class="step" data-status="complete">
 *     <span class="date">Q1 2025</span>
 *     <strong>Phase I Safety Trial</strong>
 *     <p>Primary safety endpoints met with zero grade 3/4 adverse events.</p>
 *   </div>
 *   <div class="step" data-status="active">
 *     <span class="date">Q3 2026</span>
 *     <strong>Phase II Dose Finding</strong>
 *     <p>Active enrollment across 12 clinical sites worldwide.</p>
 *   </div>
 * </atk-timeline>
 * ```
 */
export class AtkTimeline extends AganithaComponent {
  static override css = css`
    :host {
      display: block;
      margin-block: var(--wa-space-l);
      font-family: var(--wa-font-family-body);
    }

    .timeline-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--wa-space-m);
    }

    .timeline-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--wa-space-s);
      padding-block-end: var(--wa-space-xs);
      border-block-end: var(--wa-border-width-s) solid var(--wa-color-surface-border);
    }

    .title-group {
      display: flex;
      flex-direction: column;
      gap: var(--wa-space-3xs);
    }

    .title {
      font-family: var(--wa-font-family-heading);
      font-size: var(--wa-font-size-m);
      font-weight: var(--wa-font-weight-semibold);
      color: var(--wa-color-text-normal);
      margin: 0;
    }

    .subtitle {
      font-size: var(--wa-font-size-xs);
      color: var(--wa-color-text-quiet);
      margin: 0;
    }

    .progress-pill {
      display: inline-flex;
      align-items: center;
      gap: var(--wa-space-3xs);
      font-size: var(--wa-font-size-xs);
      font-weight: var(--wa-font-weight-semibold);
      color: var(--wa-color-brand-on-quiet);
      background: var(--wa-color-brand-fill-quiet);
      border: var(--wa-border-width-s) solid var(--wa-color-brand-border-quiet);
      border-radius: var(--wa-border-radius-pill);
      padding: var(--wa-space-3xs) var(--wa-space-s);
    }

    .timeline-list {
      display: flex;
      flex-direction: column;
      position: relative;
      padding-inline-start: var(--wa-space-l);
    }

    /* Continuous vertical spine */
    .timeline-list::before {
      content: "";
      position: absolute;
      inset-inline-start: 11px;
      top: 16px;
      bottom: 24px;
      width: 2px;
      background: var(--wa-color-surface-border);
    }

    .timeline-step {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--wa-space-xs);
      padding-inline-start: var(--wa-space-l);
      padding-block-end: var(--wa-space-l);
    }

    .timeline-step:last-child {
      padding-block-end: 0;
    }

    /* Milestone Node / Icon */
    .node-marker {
      position: absolute;
      inset-inline-start: -17px;
      top: 6px;
      width: 22px;
      height: 22px;
      border-radius: var(--wa-border-radius-circle);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--wa-color-surface-raised);
      border: 2px solid var(--wa-color-surface-border);
      color: var(--wa-color-text-quiet);
      z-index: 1;
      box-sizing: border-box;
      transition: transform var(--wa-transition-normal);
    }

    .node-marker wa-icon {
      font-size: var(--wa-font-size-xs);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .timeline-step:hover .node-marker {
      transform: scale(1.15);
    }

    /* Node Status Variants */
    .node-marker[data-status="complete"],
    .node-marker[data-status="done"] {
      background: var(--wa-color-success-fill-loud);
      border-color: var(--wa-color-surface-default);
      color: var(--wa-color-success-on-loud);
    }

    .node-marker[data-status="active"],
    .node-marker[data-status="current"],
    .node-marker[data-status="in-progress"] {
      background: var(--wa-color-brand-fill-loud);
      border-color: var(--wa-color-surface-default);
      color: var(--wa-color-brand-on-loud);
      box-shadow: 0 0 0 3px var(--wa-color-brand-fill-quiet);
    }

    .node-marker[data-status="delayed"],
    .node-marker[data-status="warning"] {
      background: var(--wa-color-warning-fill-loud);
      border-color: var(--wa-color-surface-default);
      color: var(--wa-color-warning-on-loud);
    }

    .node-marker[data-status="failed"],
    .node-marker[data-status="terminated"] {
      background: var(--wa-color-danger-fill-loud);
      border-color: var(--wa-color-surface-default);
      color: var(--wa-color-danger-on-loud);
    }

    /* Step Card Container */
    .step-card {
      background: var(--wa-color-surface-raised);
      border: var(--wa-border-width-s) solid var(--wa-color-surface-border);
      border-radius: var(--wa-border-radius-m);
      padding: var(--wa-space-s) var(--wa-space-m);
      display: flex;
      flex-direction: column;
      gap: var(--wa-space-2xs);
      transition: border-color var(--wa-transition-normal);
    }

    .timeline-step:hover .step-card {
      border-color: var(--wa-color-brand-border-loud);
    }

    .step-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--wa-space-xs);
    }

    .date-badge {
      font-family: var(--wa-font-family-code);
      font-size: var(--wa-font-size-xs);
      font-weight: var(--wa-font-weight-semibold);
      color: var(--wa-color-brand-on-quiet);
      background: var(--wa-color-brand-fill-quiet);
      border-radius: var(--wa-border-radius-pill);
      padding: var(--wa-space-3xs) var(--wa-space-xs);
      display: inline-flex;
      align-items: center;
    }

    .status-badge {
      font-size: var(--wa-font-size-xs);
      font-weight: var(--wa-font-weight-semibold);
      padding: var(--wa-space-3xs) var(--wa-space-xs);
      border-radius: var(--wa-border-radius-pill);
      text-transform: capitalize;
    }

    .status-badge[data-status="complete"],
    .status-badge[data-status="done"] {
      background: var(--wa-color-success-fill-quiet);
      color: var(--wa-color-success-on-quiet);
      border: var(--wa-border-width-s) solid var(--wa-color-success-border-quiet);
    }

    .status-badge[data-status="active"],
    .status-badge[data-status="current"],
    .status-badge[data-status="in-progress"] {
      background: var(--wa-color-brand-fill-quiet);
      color: var(--wa-color-brand-on-quiet);
      border: var(--wa-border-width-s) solid var(--wa-color-brand-border-quiet);
    }

    .status-badge[data-status="delayed"],
    .status-badge[data-status="warning"] {
      background: var(--wa-color-warning-fill-quiet);
      color: var(--wa-color-warning-on-quiet);
      border: var(--wa-border-width-s) solid var(--wa-color-warning-border-quiet);
    }

    .status-badge[data-status="failed"],
    .status-badge[data-status="terminated"] {
      background: var(--wa-color-danger-fill-quiet);
      color: var(--wa-color-danger-on-quiet);
      border: var(--wa-border-width-s) solid var(--wa-color-danger-border-quiet);
    }

    .status-badge[data-status="upcoming"],
    .status-badge[data-status="planned"],
    .status-badge[data-status="pending"] {
      background: var(--wa-color-surface-lowered);
      color: var(--wa-color-text-quiet);
      border: var(--wa-border-width-s) solid var(--wa-color-surface-border);
    }

    .step-title {
      font-size: var(--wa-font-size-m);
      font-weight: var(--wa-font-weight-semibold);
      color: var(--wa-color-text-normal);
      margin: 0;
      line-height: 1.3;
    }

    .step-desc {
      font-size: var(--wa-font-size-s);
      color: var(--wa-color-text-quiet);
      margin: 0;
      line-height: 1.5;
    }

    .step-tag {
      display: inline-flex;
      align-items: center;
      font-size: var(--wa-font-size-2xs);
      color: var(--wa-color-text-quiet);
      margin-block-start: var(--wa-space-3xs);
    }

    /* Slotted fallback */
    ::slotted(.step) {
      display: block;
      margin-block-end: var(--wa-space-m);
    }
  `;

  /** Section title for the timeline. */
  @property({ type: String }) title = "";

  /** Optional subtitle or description. */
  @property({ type: String }) subtitle = "";

  /** Show overall milestone progress summary. */
  @property({ type: Boolean }) progress = false;

  @state() private parsedSteps: TimelineStepData[] = [];

  override connectedCallback(): void {
    super.connectedCallback();
    this.parseContent();
  }

  private handleSlotChange(): void {
    this.parseContent();
  }

  private parseContent(): void {
    const jsonScript = this.querySelector('script[type="application/json"]');
    if (jsonScript && jsonScript.textContent) {
      try {
        const data = JSON.parse(jsonScript.textContent);
        if (Array.isArray(data)) {
          this.parsedSteps = data;
          this.requestUpdate();
          return;
        }
      } catch {
        // Fall back to DOM parsing
      }
    }

    const stepElements = Array.from(this.querySelectorAll(".step, atk-timeline-item"));
    if (stepElements.length > 0) {
      this.parsedSteps = stepElements.map((el) => {
        const status =
          el.getAttribute("data-status") ||
          el.getAttribute("status") ||
          "planned";

        const date =
          el.getAttribute("date") ||
          el.querySelector(".date, time, wa-badge, [slot='date']")?.textContent?.trim() ||
          "";

        const title =
          el.getAttribute("title") ||
          el.querySelector("strong, h3, h4, h5, .title, [slot='title']")?.textContent?.trim() ||
          "";

        const tag =
          el.getAttribute("tag") ||
          el.querySelector("wa-tag, .tag, [slot='tag']")?.textContent?.trim() ||
          "";

        const pEl = el.querySelector("p, .desc, .description");
        let description = "";
        if (pEl) {
          description = pEl.textContent?.trim() || "";
        } else {
          // If no paragraph, clone node and remove date/title elements to extract description
          const clone = el.cloneNode(true) as HTMLElement;
          clone.querySelectorAll(".date, time, wa-badge, strong, h3, h4, h5, .title, wa-tag, .tag").forEach((n) => n.remove());
          description = clone.textContent?.trim() || "";
        }

        return { date, title, description, status, tag };
      });
      this.requestUpdate();
    }
  }

  override render(): TemplateResult {
    const total = this.parsedSteps.length;
    const completed = this.parsedSteps.filter((s) => {
      const st = (s.status || "").toLowerCase();
      return st === "complete" || st === "done";
    }).length;

    const hasStructuredSteps = this.parsedSteps.length > 0;

    return html`
      <div class="timeline-wrapper" role="region" aria-label="${this.title || "Timeline"}">
        ${this.title || this.subtitle || this.progress
          ? html`
              <div class="timeline-header">
                <div class="title-group">
                  ${this.title ? html`<h3 class="title">${this.title}</h3>` : nothing}
                  ${this.subtitle ? html`<p class="subtitle">${this.subtitle}</p>` : nothing}
                </div>
                ${this.progress && total > 0
                  ? html`
                      <span class="progress-pill">
                        ${completed} of ${total} Completed (${Math.round((completed / total) * 100)}%)
                      </span>
                    `
                  : nothing}
              </div>
            `
          : nothing}

        <div class="timeline-list" role="list">
          ${hasStructuredSteps
            ? this.parsedSteps.map(
                (step) => html`
                  <div class="timeline-step" role="listitem">
                    <div class="node-marker" data-status="${normalize_status(step.status)}" aria-hidden="true">
                      ${STATUS_ICONS[normalize_status(step.status)]}
                    </div>
                    <div class="step-card">
                      <div class="step-header">
                        ${step.date ? html`<span class="date-badge">${step.date}</span>` : html`<span></span>`}
                        <span class="status-badge" data-status="${normalize_status(step.status)}">
                          ${STATUS_DISPLAY_NAMES[normalize_status(step.status)]}
                        </span>
                      </div>
                      ${step.title ? html`<div class="step-title">${step.title}</div>` : nothing}
                      ${step.description ? html`<p class="step-desc">${step.description}</p>` : nothing}
                      ${step.tag ? html`<span class="step-tag">${step.tag}</span>` : nothing}
                    </div>
                  </div>
                `,
              )
            : html`<slot @slotchange="${this.handleSlotChange}"></slot>`}
        </div>

        <slot style="display: none;" @slotchange="${this.handleSlotChange}"></slot>
      </div>
    `;
  }
}

define("atk-timeline", AtkTimeline);

declare global {
  interface HTMLElementTagNameMap {
    "atk-timeline": AtkTimeline;
  }
}
