import { css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { AganithaComponent } from "../../base.js";
import { define } from "../../define.js";

type LoadState = "idle" | "loading" | "ready" | "failed";

/**
 * Gene Ontology annotations for a gene or protein, shown as a ribbon.
 *
 * This wraps `<wc-go-ribbon>` from the Gene Ontology consortium. We do not
 * draw the ribbon ourselves — the people who own the data maintain the
 * visualisation, and that is the right arrangement.
 *
 * The upstream component is large and most pages that can show a ribbon do not
 * show one on first paint, so it is loaded on demand rather than bundled.
 *
 * @customElement atk-go-ribbon
 * @summary Gene Ontology annotations for a gene or protein.
 *
 * @atk-use Showing GO annotations for one gene or protein, when the reader
 * wants to see which functional categories are annotated at a glance.
 *
 * @atk-avoid Do not use it as a general chart. It only understands Gene
 * Ontology subject identifiers. For arbitrary category data, use a table.
 *
 * @csspart fallback - The message shown while loading or after a failure.
 *
 * @example
 * ```html
 * <atk-go-ribbon subject="UniProtKB:Q8NER5"></atk-go-ribbon>
 * ```
 */
export class AtkGoRibbon extends AganithaComponent {
  static override css = css`
    :host {
      display: block;
      min-block-size: 3rem;
    }

    .fallback {
      color: var(--wa-color-text-quiet);
      font-size: var(--wa-font-size-s);
      padding-block: var(--wa-space-s);
    }

    .fallback a {
      color: var(--wa-color-text-link);
    }
  `;

  /**
   * The subject identifier, for example `UniProtKB:Q8NER5`. Several may be
   * given, separated by commas, as the upstream component expects.
   */
  @property({ type: String }) subject = "";

  @state() private load_state: LoadState = "idle";

  override connectedCallback(): void {
    super.connectedCallback();
    void this.load_upstream();
  }

  /**
   * Load the upstream component the first time this element is used.
   *
   * The import specifier is held in a variable so that bundlers treat it as a
   * runtime import rather than trying to resolve it at build time. The package
   * is an optional dependency — an application that never shows a ribbon
   * should not have to install it.
   */
  private async load_upstream(): Promise<void> {
    if (this.load_state !== "idle") return;
    if (customElements.get("wc-go-ribbon")) {
      this.load_state = "ready";
      return;
    }

    this.load_state = "loading";
    const specifier = "@geneontology/wc-go-ribbon";
    try {
      // The package ships no types, and we do not use its exports — importing
      // it is what registers <wc-go-ribbon>.
      await import(/* @vite-ignore */ specifier);
      this.load_state = "ready";
    } catch {
      this.load_state = "failed";
    }
  }

  /**
   * A failure has to say what is missing and still show the subject.
   *
   * A blank space where a chart should be tells the reader nothing and tells
   * whoever has to fix it even less.
   */
  private render_fallback(): TemplateResult {
    const message =
      this.load_state === "loading"
        ? "Loading annotations…"
        : "Gene Ontology annotations could not be loaded.";

    return html`
      <div part="fallback" class="fallback">
        ${message}
        ${this.subject
          ? html`
              <a
                href="https://www.ebi.ac.uk/QuickGO/annotations?geneProductId=${encodeURIComponent(
                  this.subject,
                )}"
                rel="noreferrer"
                >${this.subject}</a
              >
            `
          : nothing}
      </div>
    `;
  }

  override render(): TemplateResult {
    if (this.load_state !== "ready") return this.render_fallback();

    // The upstream component brings its own shadow root and styles, so it is
    // rendered as-is with no wrapper of ours around it.
    return html`<wc-go-ribbon subject=${this.subject}></wc-go-ribbon>`;
  }
}

define("atk-go-ribbon", AtkGoRibbon);

declare global {
  interface HTMLElementTagNameMap {
    "atk-go-ribbon": AtkGoRibbon;
  }
}
