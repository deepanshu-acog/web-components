import { css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { AganithaComponent } from "../../base.js";
import { define } from "../../define.js";

interface ProcessStepData {
  title: string;
  description?: string;
  tag?: string;
}

/**
 * A numbered, directionally-connected sequence of steps — an ordered
 * procedure or interaction model, not a chronology.
 *
 * Unlike `<atk-timeline>` (dated milestones with status), `<atk-process>` has
 * no dates and no status — every step is equally "done"; only order matters.
 *
 * @customElement atk-process
 * @summary A numbered sequence of steps, connected in order.
 *
 * @atk-use Explaining a procedure, workflow, or "how to use this" sequence —
 * lab protocols, a multi-step interaction model, an onboarding flow.
 *
 * @atk-avoid Do not use for dated milestones or anything with a status
 * (complete/active/delayed); use `<atk-timeline>` instead. Do not use for
 * unordered items; use a record list or `wa-card` grid instead.
 *
 * @slot - Child `<atk-step>` elements, or `<script type="application/json">`.
 *
 * @example
 * ```html
 * <atk-process title="How to read this figure">
 *   <atk-step title="Select a subtype">Choose the patient subtype that matches the presenting phenotype.</atk-step>
 *   <atk-step title="Filter by problem">Narrow the list using the symptom filters.</atk-step>
 *   <atk-step title="Click a step">Open the detail panel for the chosen entry.</atk-step>
 * </atk-process>
 * ```
 */
export class AtkProcess extends AganithaComponent {
  static override css = css`
    :host {
      display: block;
      margin-block: var(--wa-space-l);
      font-family: var(--wa-font-family-body);
    }

    .header {
      margin-block-end: var(--wa-space-m);
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
      margin: var(--wa-space-3xs) 0 0;
    }

    .steps {
      display: flex;
      flex-wrap: wrap;
      align-items: stretch;
      gap: var(--wa-space-m);
    }

    .step {
      position: relative;
      flex: 1 1 180px;
      display: flex;
      flex-direction: column;
      gap: var(--wa-space-2xs);
      padding: var(--wa-space-s) var(--wa-space-m);
      background: var(--wa-color-surface-raised);
      border: var(--wa-border-width-s) solid var(--wa-color-surface-border);
      border-radius: var(--wa-border-radius-m);
    }

    /* Connector to the next step, hidden on the last one and when wrapped */
    .step:not(:last-child)::after {
      content: "";
      position: absolute;
      inset-inline-end: calc(-1 * var(--wa-space-m) / 2 - 1px);
      top: 50%;
      transform: translateY(-50%);
      width: var(--wa-space-m);
      height: 2px;
      background: var(--wa-color-surface-border);
    }

    .step-head {
      display: flex;
      align-items: center;
      gap: var(--wa-space-xs);
    }

    .step-number {
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: var(--wa-border-radius-circle);
      background: var(--wa-color-brand-fill-loud);
      color: var(--wa-color-brand-on-loud);
      font-size: var(--wa-font-size-2xs);
      font-weight: var(--wa-font-weight-bold);
    }

    .step-title {
      font-size: var(--wa-font-size-s);
      font-weight: var(--wa-font-weight-semibold);
      color: var(--wa-color-text-normal);
    }

    .step-tag {
      font-size: var(--wa-font-size-2xs);
      color: var(--wa-color-text-quiet);
      background: var(--wa-color-surface-lowered);
      border-radius: var(--wa-border-radius-pill);
      padding: var(--wa-space-3xs) var(--wa-space-xs);
      margin-inline-start: auto;
    }

    .step-desc {
      font-size: var(--wa-font-size-xs);
      color: var(--wa-color-text-quiet);
      margin: 0;
      line-height: 1.5;
    }
  `;

  /** Section title for the process. */
  @property({ type: String }) title = "";

  /** Optional subtitle or description. */
  @property({ type: String }) subtitle = "";

  @state() private parsedSteps: ProcessStepData[] = [];

  override connectedCallback(): void {
    super.connectedCallback();
    this.parseContent();
  }

  private handleSlotChange(): void {
    this.parseContent();
  }

  private parseContent(): void {
    const jsonScript = this.querySelector('script[type="application/json"]');
    if (jsonScript?.textContent) {
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

    const stepElements = Array.from(this.querySelectorAll("atk-step"));
    if (stepElements.length > 0) {
      this.parsedSteps = stepElements.map((el) => ({
        title: el.getAttribute("title") || "",
        tag: el.getAttribute("tag") || "",
        description: el.textContent?.trim() || "",
      }));
      this.requestUpdate();
    }
  }

  override render(): TemplateResult {
    return html`
      ${this.title || this.subtitle
        ? html`
            <div class="header">
              <h3 class="title">${this.title}</h3>
              ${this.subtitle ? html`<p class="subtitle">${this.subtitle}</p>` : nothing}
            </div>
          `
        : nothing}

      <div class="steps" role="list">
        ${this.parsedSteps.map(
          (step, i) => html`
            <div class="step" role="listitem">
              <div class="step-head">
                <span class="step-number" aria-hidden="true">${i + 1}</span>
                <span class="step-title">${step.title}</span>
                ${step.tag ? html`<span class="step-tag">${step.tag}</span>` : nothing}
              </div>
              ${step.description ? html`<p class="step-desc">${step.description}</p>` : nothing}
            </div>
          `,
        )}
      </div>

      <slot style="display: none;" @slotchange="${this.handleSlotChange}"></slot>
    `;
  }
}

define("atk-process", AtkProcess);

declare global {
  interface HTMLElementTagNameMap {
    "atk-process": AtkProcess;
  }
}
