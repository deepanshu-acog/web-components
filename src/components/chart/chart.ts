import { css, html, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { AganithaComponent } from "../../base.js";
import { define } from "../../define.js";
import { lazy_load } from "../../lazy.js";
import { WA_FALLBACK } from "../../theme/fallbacks.js";

/**
 * Interactive charting component powered by Apache ECharts, fully integrated
 * with Web Awesome design tokens and themes.
 *
 * Uses `IntersectionObserver` to lazy-load ECharts. Chart configuration is
 * passed via a child `<script type="application/json">` tag.
 *
 * @customElement atk-chart
 * @summary Web Awesome themed ECharts visualization element.
 *
 * @atk-use Visualizing multi-series trends, clinical trial metrics, distributions,
 * market shares, or comparative data in reports and dashboards.
 *
 * @atk-avoid Do not use for a single scalar value; use `<atk-metric>` instead.
 *
 * @example
 * ```html
 * <atk-chart height="320px">
 *   <script type="application/json">
 *     {
 *       "xAxis": { "type": "category", "data": ["Q1", "Q2", "Q3", "Q4"] },
 *       "yAxis": { "type": "value" },
 *       "series": [{ "name": "Adoption", "type": "bar", "data": [45, 68, 85, 94] }]
 *     }
 *   </script>
 * </atk-chart>
 * ```
 */
export class AtkChart extends AganithaComponent {
  static override css = css`
    :host {
      display: block;
      margin-block: var(--wa-space-m);
      width: 100%;
    }

    .container {
      width: 100%;
      min-height: 250px;
      background-color: var(--wa-color-surface-lowered);
      border-radius: var(--wa-border-radius-m);
      border: 1px solid var(--wa-color-surface-border);
      position: relative;
      overflow: hidden;
    }

    .chart-target {
      width: 100%;
      height: 100%;
    }

    .status {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--wa-color-text-quiet);
      font-size: var(--wa-font-size-s);
      padding: var(--wa-space-m);
      text-align: center;
    }

    .error-box {
      border: 1px dashed var(--wa-color-surface-border);
      padding: var(--wa-space-m);
      border-radius: var(--wa-border-radius-m);
      background: var(--wa-color-surface-raised);
    }
  `;

  /** Height of the chart container (e.g., '300px', '400px'). */
  @property({ type: String }) height = "320px";

  /** Direct chart options object if not using child script tag. */
  @property({ attribute: false }) options?: Record<string, unknown>;

  @state() private loading = true;
  @state() private error = "";

  private cleanup_lazy_load?: () => void;
  private resizeObserver?: ResizeObserver;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private chartInstance?: any;

  override connectedCallback(): void {
    super.connectedCallback();
    this.cleanup_lazy_load = lazy_load(this, () => this.render_chart());
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup_lazy_load?.();
    this.resizeObserver?.disconnect();
    this.chartInstance?.dispose();
    this.chartInstance = null;
  }

  /**
   * Reads Web Awesome design tokens from CSS computed styles
   * and creates a matching ECharts theme palette.
   */
  private get_wa_echarts_theme(styles: CSSStyleDeclaration) {
    const textColor = styles.getPropertyValue("--wa-color-text-normal").trim() || WA_FALLBACK.textNormal;
    const textQuiet = styles.getPropertyValue("--wa-color-text-quiet").trim() || WA_FALLBACK.textQuiet;
    const borderColor = styles.getPropertyValue("--wa-color-surface-border").trim() || WA_FALLBACK.surfaceBorder;
    const surfaceRaised = styles.getPropertyValue("--wa-color-surface-raised").trim() || WA_FALLBACK.surfaceRaised;
    const fontFamily = styles.getPropertyValue("--wa-font-family-body").trim() || WA_FALLBACK.fontFamily;

    // Web Awesome semantic color palette
    const colorPalette = [
      styles.getPropertyValue("--wa-color-brand").trim() || styles.getPropertyValue("--wa-color-brand-50").trim() || WA_FALLBACK.brand,
      styles.getPropertyValue("--wa-color-success").trim() || styles.getPropertyValue("--wa-color-success-50").trim() || WA_FALLBACK.success,
      styles.getPropertyValue("--wa-color-warning").trim() || styles.getPropertyValue("--wa-color-warning-50").trim() || WA_FALLBACK.warning,
      styles.getPropertyValue("--wa-color-danger").trim() || styles.getPropertyValue("--wa-color-danger-50").trim() || WA_FALLBACK.danger,
      styles.getPropertyValue("--wa-color-purple").trim() || styles.getPropertyValue("--wa-color-purple-50").trim() || WA_FALLBACK.purple,
      styles.getPropertyValue("--wa-color-teal").trim() || styles.getPropertyValue("--wa-color-teal-50").trim() || WA_FALLBACK.teal,
    ];

    return {
      color: colorPalette,
      textStyle: {
        fontFamily: fontFamily,
        color: textColor,
      },
      title: {
        textStyle: { color: textColor, fontFamily: fontFamily, fontWeight: "600" },
        subtextStyle: { color: textQuiet, fontFamily: fontFamily },
      },
      legend: {
        textStyle: { color: textColor, fontFamily: fontFamily },
      },
      tooltip: {
        backgroundColor: surfaceRaised,
        borderColor: borderColor,
        textStyle: { color: textColor, fontFamily: fontFamily },
      },
      categoryAxis: {
        axisLine: { lineStyle: { color: borderColor } },
        axisTick: { lineStyle: { color: borderColor } },
        axisLabel: { color: textQuiet, fontFamily: fontFamily },
        splitLine: { show: false },
      },
      valueAxis: {
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: textQuiet, fontFamily: fontFamily },
        splitLine: { lineStyle: { color: borderColor, type: "dashed" } },
      },
    };
  }

  private async render_chart(): Promise<void> {
    let resolvedOptions = this.options;

    if (!resolvedOptions) {
      const script = this.querySelector('script[type="application/json"]');
      const text = script?.textContent?.trim() || this.textContent?.trim();
      if (text && (text.startsWith("{") || text.startsWith("["))) {
        try {
          resolvedOptions = JSON.parse(text);
        } catch {
          this.loading = false;
          this.error = "Invalid JSON in chart configuration.";
          return;
        }
      }
    }

    if (!resolvedOptions) {
      this.loading = false;
      this.error = "Provide chart configuration in a <script type=\"application/json\"> child tag.";
      return;
    }

    try {
      const echarts = (await import("echarts"));

      this.loading = false;
      await this.updateComplete;

      const container = this.renderRoot.querySelector<HTMLElement>(".chart-target");
      if (!container) return;

      // Extract Web Awesome computed styles
      const computedStyles = getComputedStyle(this);
      const waTheme = this.get_wa_echarts_theme(computedStyles);

      // Register and initialize ECharts with the Web Awesome theme
      echarts.registerTheme("webawesome", waTheme);
      this.chartInstance = echarts.init(container, "webawesome", {
        renderer: "svg", // SVG for crisp, scalable Web Awesome visuals
      });

      this.chartInstance.setOption(resolvedOptions);

      // Handle container resizing smoothly
      this.resizeObserver = new ResizeObserver(() => {
        this.chartInstance?.resize();
      });
      this.resizeObserver.observe(container);

      this.error = "";
    } catch (err) {
      this.loading = false;
      this.error = err instanceof Error ? err.message : "Chart rendering failed";
    }
  }

  override render(): TemplateResult {
    if (this.error) {
      return html`
        <div class="container" style="min-height: ${this.height};">
          <wa-callout variant="danger" appearance="subtle">
            <wa-icon slot="icon" name="circle-exclamation"></wa-icon>
            <strong>Chart Error</strong><br />
            <span>${this.error}</span>
          </wa-callout>
        </div>
      `;
    }

    return html`
      <div class="container">
        ${this.loading
          ? html`
              <div class="loading-state" style="height: ${this.height};">
                <wa-spinner style="font-size: var(--wa-font-size-2xl);"></wa-spinner>
                <span>Loading visualization...</span>
              </div>
            `
          : ""}
        <div
          class="chart-target"
          style="height: ${this.height}; display: ${this.loading ? "none" : "block"};"
        ></div>
      </div>
    `;
  }
}

define("atk-chart", AtkChart);

declare global {
  interface HTMLElementTagNameMap {
    "atk-chart": AtkChart;
  }
}
