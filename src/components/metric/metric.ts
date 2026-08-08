import { css, html, svg, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { AganithaComponent } from "../../base.js";
import { define } from "../../define.js";
import { sparkline_geometry } from "./sparkline.js";

const VIEW_WIDTH = 100;
const VIEW_HEIGHT = 28;

/**
 * A single measured value, with its recent history and normal range.
 *
 * Pass the history as a JSON array in a `<script type="application/json">`
 * child. Scalars go in attributes. This is how every atk-ui component takes
 * complex data — it works in plain HTML, in templates, and in AI-generated
 * markup, with nothing to serialise.
 *
 * @customElement atk-metric
 * @summary A labelled value with its recent trend and normal range.
 *
 * @atk-use Showing one measurement that a reader needs to judge at a glance:
 * is it normal, and which way is it moving. Lab results, system metrics,
 * counts tracked over time.
 *
 * @atk-avoid Do not use it to show several measurements at once — use a
 * record list, or a table if they need comparing. Do not use it for a value
 * with no history and no normal range; that is a definition list, not a
 * metric.
 *
 * @slot - Optional footnote shown under the value. Keep it to a few words.
 *
 * @csspart value - The number and its unit.
 * @csspart chart - The sparkline SVG.
 *
 * @cssproperty --atk-metric-chart-width - Width of the sparkline. Defaults to 6rem.
 *
 * @example
 * ```html
 * <atk-metric label="Hemoglobin" value="10.2" unit="g/dL" low="13.5" high="17.5">
 *   <script type="application/json">[11.8, 11.2, 10.9, 10.4, 10.2]</script>
 * </atk-metric>
 * ```
 */
export class AtkMetric extends AganithaComponent {
  static override css = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--wa-space-m);
    }

    .text {
      min-width: 0;
    }

    .label {
      color: var(--wa-color-text-quiet);
      font-size: var(--wa-font-size-s);
    }

    .value {
      font-weight: var(--wa-font-weight-semibold);
      font-variant-numeric: tabular-nums;
    }

    .unit {
      color: var(--wa-color-text-quiet);
      font-size: var(--wa-font-size-s);
      font-weight: var(--wa-font-weight-normal);
    }

    .range {
      color: var(--wa-color-text-quiet);
      font-size: var(--wa-font-size-xs);
    }

    /* Out-of-range is stated in words as well as shown in the line colour.
       Colour alone is not perceivable by every reader. */
    .status {
      color: var(--wa-color-danger-fill-loud);
      font-size: var(--wa-font-size-xs);
      font-weight: var(--wa-font-weight-semibold);
    }

    .chart {
      inline-size: var(--atk-metric-chart-width, 6rem);
      block-size: auto;
      flex: none;
      overflow: visible;
    }

    .band {
      fill: var(--wa-color-success-fill-quiet);
    }

    .line {
      fill: none;
      stroke: var(--wa-color-brand-fill-loud);
      stroke-width: 1.5;
      stroke-linejoin: round;
      stroke-linecap: round;
    }

    .last {
      fill: var(--wa-color-brand-fill-loud);
    }

    .out-of-range .line,
    .out-of-range .last {
      stroke: var(--wa-color-danger-fill-loud);
      fill: var(--wa-color-danger-fill-loud);
    }

    .out-of-range .line {
      fill: none;
    }

    /* Nothing here animates, but honour the preference if that changes. */
    @media (prefers-reduced-motion: reduce) {
      * {
        transition: none !important;
      }
    }
  `;

  /** What is being measured. Always set this. */
  @property({ type: String }) label = "";

  /** The current value, shown as given. Not reformatted. */
  @property({ type: String }) value = "";

  /** Unit shown after the value, for example `g/dL`. */
  @property({ type: String }) unit = "";

  /** Lower bound of the normal range. */
  @property({ type: Number }) low?: number;

  /** Upper bound of the normal range. */
  @property({ type: Number }) high?: number;

  /** History, newest last. Usually set from the JSON child rather than in code. */
  @property({ attribute: false }) series: number[] = [];

  @state() private parse_failed = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.read_json_child();
  }

  /**
   * Read the `<script type="application/json">` child, if there is one.
   *
   * A malformed array is reported rather than thrown. One bad value in a
   * dashboard should not take down the page around it.
   */
  private read_json_child(): void {
    const script = this.querySelector<HTMLScriptElement>(
      'script[type="application/json"]',
    );
    if (!script?.textContent?.trim()) return;

    try {
      const parsed: unknown = JSON.parse(script.textContent);
      if (!Array.isArray(parsed) || !parsed.every((n) => typeof n === "number")) {
        this.parse_failed = true;
        return;
      }
      this.series = parsed;
      this.parse_failed = false;
    } catch {
      this.parse_failed = true;
    }
  }

  /** True when the current value sits outside the stated normal range. */
  private get out_of_range(): boolean {
    const current = Number(this.value);
    if (!Number.isFinite(current)) return false;
    if (this.low !== undefined && current < this.low) return true;
    if (this.high !== undefined && current > this.high) return true;
    return false;
  }

  private render_chart(): TemplateResult | typeof nothing {
    const geometry = sparkline_geometry(this.series, {
      width: VIEW_WIDTH,
      height: VIEW_HEIGHT,
      low: this.low,
      high: this.high,
    });
    if (!geometry) return nothing;

    return html`
      <svg
        part="chart"
        class="chart ${this.out_of_range ? "out-of-range" : ""}"
        viewBox="0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}"
        preserveAspectRatio="none"
        role="img"
        aria-label="Recent history of ${this.label}, ${this.series.length} readings, most recent ${this.value}"
      >
        ${geometry.band
          ? svg`<rect class="band" x="0" y="${geometry.band.y}"
                     width="${VIEW_WIDTH}" height="${geometry.band.height}"></rect>`
          : nothing}
        <polyline class="line" points="${geometry.points}"></polyline>
        <circle class="last" cx="${geometry.last.x}" cy="${geometry.last.y}" r="2"></circle>
      </svg>
    `;
  }

  /**
   * How the current value sits against the normal range, in words.
   *
   * Returns an empty string when there is no range to compare against. This is
   * shown as text rather than signalled by the line colour alone, because
   * colour on its own is not perceivable by every reader.
   */
  private get range_status(): string {
    if (!this.out_of_range) return "";
    const current = Number(this.value);
    if (this.low !== undefined && current < this.low) return "Below normal";
    return "Above normal";
  }

  override render(): TemplateResult {
    const has_range = this.low !== undefined && this.high !== undefined;
    const status = this.range_status;

    return html`
      <div class="text">
        <div class="label">${this.label}</div>
        <div part="value" class="value">
          ${this.value}${this.unit ? html`<span class="unit"> ${this.unit}</span>` : nothing}
        </div>
        ${has_range
          ? html`<div class="range">Normal ${this.low}–${this.high}</div>`
          : nothing}
        ${status ? html`<div class="status">${status}</div>` : nothing}
        ${this.parse_failed
          ? html`<div class="range">History unavailable</div>`
          : nothing}
        <slot></slot>
      </div>
      ${this.render_chart()}
    `;
  }
}

define("atk-metric", AtkMetric);

declare global {
  interface HTMLElementTagNameMap {
    "atk-metric": AtkMetric;
  }
}
