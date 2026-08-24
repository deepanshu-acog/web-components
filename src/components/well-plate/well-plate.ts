import { css, html, svg, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { AganithaComponent } from "../../base.js";
import { define } from "../../define.js";

export type WellState = "filled" | "empty" | "control" | "blank";

export interface WellData {
  well: string;
  color?: string;
  label?: string;
  state?: WellState;
  tooltip?: string;
}

const STATE_COLOR_TOKEN: Record<WellState, string> = {
  filled: "var(--wa-color-brand-fill-loud)",
  control: "var(--wa-color-success-fill-loud)",
  blank: "var(--wa-color-surface-lowered)",
  empty: "var(--wa-color-surface-raised)",
};

/**
 * @customElement atk-well-plate
 * @summary High-throughput 96-well or 384-well microplate heatmap visualizer.
 * @atk-pack bio
 *
 * @atk-use Use when displaying assay screening data, compound concentration layouts,
 * or biological quality control across standard 96-well or 384-well microplates.
 * @atk-avoid Do not use for simple 1D lists, sequence data, or generic tabular records.
 *
 * @example
 * ```html
 * <atk-well-plate format="96" title="Compound Screening Plate">
 *   <script type="application/json">
 *     [
 *       { "well": "A1", "state": "control", "label": "POS" },
 *       { "well": "A2", "state": "filled", "label": "0.1uM" },
 *       { "well": "H12", "state": "blank" }
 *     ]
 *   </script>
 * </atk-well-plate>
 * ```
 */
export class AtkWellPlate extends AganithaComponent {
  static override css = css`
    :host {
      display: block;
      margin-block: var(--wa-space-l);
    }

    .wrapper {
      border: 1px solid var(--wa-color-surface-border);
      border-radius: var(--wa-border-radius-m);
      background-color: var(--wa-color-surface-raised);
      overflow: hidden;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--wa-space-m);
      border-bottom: 1px solid var(--wa-color-surface-border);
      background-color: var(--wa-color-surface-lowered);
    }

    .title {
      font-size: var(--wa-font-size-m);
      font-weight: var(--wa-font-weight-semibold);
      color: var(--wa-color-text-normal);
    }

    .plate-scroll {
      padding: var(--wa-space-l);
      overflow-x: auto;
      display: flex;
      justify-content: center;
    }

    svg {
      display: block;
      max-width: 100%;
    }

    .label-text {
      font-size: 10px;
      font-weight: var(--wa-font-weight-semibold);
      fill: var(--wa-color-text-quiet);
      font-family: var(--wa-font-family-body);
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }

    .well-circle {
      cursor: pointer;
      transition: opacity 0.15s ease, stroke-width 0.15s ease;
    }

    .well-circle:hover {
      opacity: 0.85;
      stroke-width: 1.5;
      stroke: var(--wa-color-text-normal);
    }

    .well-label {
      font-size: 7px;
      fill: var(--wa-color-text-normal);
      font-family: var(--wa-font-family-code);
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }

    .status {
      padding: var(--wa-space-l);
      text-align: center;
      font-size: var(--wa-font-size-s);
      color: var(--wa-color-text-quiet);
    }

    .status.error {
      color: var(--wa-color-danger-fill-loud);
    }
  `;

  /** Plate format: 96-well (8x12) or 384-well (16x24). */
  @property({ type: String }) format: "96" | "384" = "96";

  /** Optional title shown in the plate header. */
  @property({ type: String }) title = "";

  /** Optional external JSON endpoint URL. */
  @property({ type: String }) src = "";

  @state() private wells: WellData[] = [];
  @state() private well_map: Map<string, WellData> = new Map();
  @state() private error = "";

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.src) {
      this.parse_json();
    }
  }

  override updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has("src") && this.src) {
      this.error = "";
      fetch(this.src)
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((data) => {
          this.set_wells(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          this.set_wells([]);
          this.error = err instanceof Error ? err.message : "Failed to load plate data";
        });
    }
  }

  private set_wells(data: WellData[]): void {
    this.wells = data;
    const map = new Map<string, WellData>();
    for (const w of data) {
      if (w.well) {
        map.set(w.well.toUpperCase(), w);
      }
    }
    this.well_map = map;
  }

  private parse_json(): void {
    try {
      const script = this.querySelector('script[type="application/json"]');
      if (!script?.textContent) {
        this.set_wells([]);
        return;
      }
      const data = JSON.parse(script.textContent);
      if (Array.isArray(data)) {
        this.set_wells(data);
      }
    } catch (err) {
      this.set_wells([]);
      this.error = err instanceof Error ? err.message : "Invalid JSON plate data";
    }
  }

  private get config(): { rows: number; cols: number; r: number; gap: number; marginLeft: number; marginTop: number } {
    if (this.format === "384") {
      return { rows: 16, cols: 24, r: 7, gap: 3, marginLeft: 26, marginTop: 22 };
    }
    return { rows: 8, cols: 12, r: 12, gap: 6, marginLeft: 32, marginTop: 26 };
  }

  override render(): TemplateResult {
    if (this.error) {
      return html`
        <div class="wrapper">
          ${this.title ? html`<div class="header"><span class="title">${this.title}</span></div>` : ""}
          <div class="status error">${this.error}</div>
        </div>
      `;
    }

    const { rows, cols, r, gap, marginLeft, marginTop } = this.config;
    const step = r * 2 + gap;
    const svgW = marginLeft + cols * step + gap;
    const svgH = marginTop + rows * step + gap;
    const wellMap = this.well_map;
    const rowLabels = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i));
    const colLabels = Array.from({ length: cols }, (_, i) => String(i + 1));

    return html`
      <div class="wrapper">
        ${this.title
          ? html`
              <div class="header">
                <span class="title">${this.title}</span>
                <span style="font-size: var(--wa-font-size-xs); color: var(--wa-color-text-quiet);">
                  ${this.format}-Well Microplate
                </span>
              </div>
            `
          : ""}
        <div class="plate-scroll">
          <svg
            viewBox="0 0 ${svgW} ${svgH}"
            width=${svgW}
            height=${svgH}
            aria-label="${this.format}-well plate"
          >
            <!-- Column numeric headers (1, 2, 3...) -->
            ${colLabels.map(
              (label, ci) => svg`
                <text
                  class="label-text"
                  x=${marginLeft + ci * step + r}
                  y=${marginTop / 2}
                >${label}</text>
              `,
            )}

            <!-- Row letter headers (A, B, C...) and Well Circles -->
            ${rowLabels.map(
              (rowLabel, ri) => svg`
                <text
                  class="label-text"
                  x=${marginLeft / 2}
                  y=${marginTop + ri * step + r}
                >${rowLabel}</text>
                ${colLabels.map((_, ci) => {
                  const key = `${rowLabel}${ci + 1}`;
                  const data = wellMap.get(key);
                  const state: WellState = data?.state ?? "empty";
                  const fill = data?.color ?? STATE_COLOR_TOKEN[state];
                  const cx = marginLeft + ci * step + r;
                  const cy = marginTop + ri * step + r;
                  return svg`
                    <circle
                      class="well-circle"
                      cx=${cx}
                      cy=${cy}
                      r=${r - 1}
                      fill=${fill}
                      stroke="var(--wa-color-surface-border)"
                      stroke-width="1"
                    >
                      <title>${key}: ${data?.label || state}</title>
                    </circle>
                    ${data?.label
                      ? svg`
                      <text class="well-label" x=${cx} y=${cy}>${data.label.slice(0, 4)}</text>
                    `
                      : ""}
                  `;
                })}
              `,
            )}
          </svg>
        </div>
      </div>
    `;
  }
}

define("atk-well-plate", AtkWellPlate);

declare global {
  interface HTMLElementTagNameMap {
    "atk-well-plate": AtkWellPlate;
  }
}
