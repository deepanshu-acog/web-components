import { css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { AganithaComponent } from "../../base.js";
import { define } from "../../define.js";

/**
 * Renders flowcharts, sequence diagrams, and process graphs using Mermaid.js.
 *
 * Uses `IntersectionObserver` to lazy-load the Mermaid rendering engine on demand
 * when scrolled into view. Diagram code can be passed via the `code` attribute
 * or as text child content.
 *
 * @customElement atk-mermaid
 * @summary Lazy-loaded Mermaid.js flowchart and diagram renderer.
 *
 * @atk-use Visualizing clinical pathways, biochemical reaction cascades,
 * software architectures, or procedural flowcharts in reports.
 *
 * @atk-avoid Do not use for simple static lists or key-value data; use a
 * timeline or table instead.
 *
 * @example
 * ```html
 * <atk-mermaid code="graph LR; Screening --> Phase1; Phase1 --> Phase2;"></atk-mermaid>
 * ```
 */
export class AtkMermaid extends AganithaComponent {
  static override css = css`
    :host {
      display: block;
      margin-block: var(--wa-space-l);
      overflow-x: auto;
    }

    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 4rem;
      padding: var(--wa-space-m);
      background-color: var(--wa-color-surface-lowered);
      border-radius: var(--wa-border-radius-m);
      border: 1px solid var(--wa-color-surface-border);
    }

    .status {
      font-size: var(--wa-font-size-s);
      color: var(--wa-color-text-quiet);
    }

    .error {
      color: var(--wa-color-danger-fill-loud);
    }
  `;

  /** Mermaid diagram definition string (e.g. "graph TD; A-->B;"). */
  @property({ type: String }) code = "";

  @state() private svg = "";
  @state() private loading = true;
  @state() private error = "";

  private observer?: IntersectionObserver;

  override connectedCallback(): void {
    super.connectedCallback();
    this.read_code_content();
    this.setup_lazy_load();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.observer?.disconnect();
  }

  private read_code_content(): void {
    if (this.code) return;
    const textChild = this.textContent?.trim();
    if (textChild) {
      this.code = textChild;
    }
  }

  private setup_lazy_load(): void {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      this.render_mermaid();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.observer?.disconnect();
          this.render_mermaid();
        }
      },
      { rootMargin: "200px" },
    );

    this.observer.observe(this);
  }

  private async render_mermaid(): Promise<void> {
    if (!this.code) {
      this.loading = false;
      return;
    }

    try {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose",
      });

      const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
      const { svg } = await mermaid.render(id, this.code);
      this.svg = svg;
      this.loading = false;
      this.error = "";
    } catch (err) {
      this.loading = false;
      this.error = err instanceof Error ? err.message : "Diagram rendering failed";
    }
  }

  override render(): TemplateResult {
    if (this.loading) {
      return html`<div class="container"><span class="status">Loading diagram...</span></div>`;
    }

    if (this.error) {
      return html`<div class="container"><span class="status error">${this.error}</span></div>`;
    }

    if (this.svg) {
      return html`<div class="container" .innerHTML=${this.svg}></div>`;
    }

    return html`<div class="container"><span class="status">No diagram code provided</span></div>`;
  }
}

define("atk-mermaid", AtkMermaid);

declare global {
  interface HTMLElementTagNameMap {
    "atk-mermaid": AtkMermaid;
  }
}
