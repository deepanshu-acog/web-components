import { css, html, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { AganithaComponent } from "../../base.js";
import { define } from "../../define.js";
import { lazy_load } from "../../lazy.js";

type MolFormat = "mmcif" | "pdb" | "mol2" | "sdf";

const RCSB_MMCIF = (id: string) =>
  `https://files.rcsb.org/download/${id.toUpperCase()}.cif`;

/**
 * 3D molecular structure viewer powered by Mol* (Molstar).
 *
 * Renders macromolecular structures from RCSB PDB IDs or direct structure file URLs
 * with interactive 3D rotation, zooming, and representation styles.
 *
 * @customElement atk-molstar
 * @summary Interactive 3D macromolecular structure viewer.
 * @atk-pack bio
 *
 * @atk-use Displaying 3D protein, ligand, or nucleic acid structures in biological
 * and chemical research reports.
 *
 * @atk-avoid Do not use for 2D chemical structure diagrams (use SMILES/2D drawer)
 * or non-molecular 3D graphics.
 *
 * @example
 * ```html
 * <atk-molstar pdb-id="1CRN" height="400"></atk-molstar>
 * ```
 */
export class AtkMolstar extends AganithaComponent {
  static override css = css`
    :host {
      display: block;
      margin-block: var(--wa-space-l);
    }

    .container {
      position: relative;
      width: 100%;
      border-radius: var(--wa-border-radius-m);
      border: 1px solid var(--wa-color-surface-border);
      background-color: var(--wa-color-surface-lowered);
      overflow: hidden;
    }

    .canvas {
      width: 100%;
      height: 100%;
    }

    .status {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: var(--wa-space-s);
      font-size: var(--wa-font-size-s);
      color: var(--wa-color-text-quiet);
      padding: var(--wa-space-l);
      text-align: center;
    }

    .error {
      color: var(--wa-color-danger-fill-loud);
    }
  `;

  /** RCSB PDB accession code (e.g. "1CRN" or "7KRN"). */
  @property({ attribute: "pdb-id" }) pdbId = "";

  /** Direct URL to a structure file (.cif, .pdb, .sdf). Takes precedence over pdb-id. */
  @property({ type: String }) url = "";

  /** Structure file format. Inferred from URL when omitted. */
  @property({ type: String }) format: MolFormat = "mmcif";

  /** Height of the 3D viewport in pixels. Defaults to 500. */
  @property({ type: Number }) height = 500;

  @state() private loading = true;
  @state() private missing = false;
  @state() private error = "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private viewer: any = null;

  private cleanup_lazy_load?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this.cleanup_lazy_load = lazy_load(this, () => this.render_structure());
  }

  private async render_structure(): Promise<void> {
    if (!this.pdbId && !this.url) {
      this.loading = false;
      return;
    }

    await this.updateComplete;
    const canvasContainer = this.shadowRoot?.querySelector<HTMLElement>(".canvas");
    if (!canvasContainer) return;

    // Check if WebGL context is supported (HappyDOM / headless test runners do not support WebGL)
    const testCanvas = document.createElement("canvas");
    const hasWebGL = Boolean(
      testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl"),
    );

    if (!hasWebGL) {
      this.error = "WebGL 3D rendering context is unavailable in this environment.";
      this.loading = false;
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ViewerClass: any = null;
    try {
      ViewerClass = await this.resolve_viewer_class();
      if (!ViewerClass) {
        throw new Error("Mol* viewer library unavailable");
      }
    } catch {
      this.missing = true;
      this.loading = false;
      return;
    }

    try {
      this.viewer = await ViewerClass.create(canvasContainer, {
        layoutIsExpanded: false,
        layoutShowControls: false,
        layoutShowRemoteState: false,
        layoutShowSequence: true,
        layoutShowLog: false,
        layoutShowLeftPanel: false,
      });

      const structureUrl = this.url || RCSB_MMCIF(this.pdbId);
      const fmt = this.url ? this.inferFormat(this.url) : "mmcif";
      await this.viewer.loadStructureFromUrl(structureUrl, fmt, false);
      this.loading = false;
    } catch (err) {
      this.loading = false;
      this.error = err instanceof Error ? err.message : String(err);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup_lazy_load?.();
    this.viewer?.plugin?.dispose();
    this.viewer = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async resolve_viewer_class(): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = typeof window !== "undefined" ? (window as any) : null;
    if (win?.molstar?.Viewer) {
      return win.molstar.Viewer;
    }

    // 1. Try ESM dynamic import (for Vite / Astro / Webpack)
    try {
      const mod = await import("molstar/lib/apps/viewer/app");
      if (mod?.Viewer) return mod.Viewer;
    } catch {
      // Fall through to dynamic on-demand script injection
    }

    // 2. Dynamically load local or CDN Mol* script on demand
    if (typeof document !== "undefined" && win) {
      if (!document.querySelector("link[data-molstar]")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.setAttribute("data-molstar", "true");
        link.href = "/molstar/molstar.css";
        document.head.appendChild(link);
      }

      if (!win.molstar) {
        await new Promise<void>((resolve, reject) => {
          const existingScript = document.querySelector("script[data-molstar]") as HTMLScriptElement;
          if (existingScript) {
            existingScript.addEventListener("load", () => resolve());
            existingScript.addEventListener("error", (e) => reject(e));
            return;
          }
          const script = document.createElement("script");
          script.setAttribute("data-molstar", "true");
          script.src = "/molstar/molstar.js";
          script.onload = () => resolve();
          script.onerror = () => {
            // Fall back to CDN if local mount is unavailable
            const cdnScript = document.createElement("script");
            cdnScript.src = "https://cdn.jsdelivr.net/npm/molstar@5.11.0/build/viewer/molstar.js";
            cdnScript.onload = () => resolve();
            cdnScript.onerror = (e) => reject(e);
            document.head.appendChild(cdnScript);
          };
          document.head.appendChild(script);
        });
      }

      if (win.molstar?.Viewer) {
        return win.molstar.Viewer;
      }
    }

    return null;
  }

  private inferFormat(url: string): MolFormat {
    const ext = (url.split("?")[0]?.split(".").pop() ?? "").toLowerCase();
    const map: Record<string, MolFormat> = {
      cif: "mmcif",
      mmcif: "mmcif",
      pdb: "pdb",
      ent: "pdb",
      mol2: "mol2",
      sdf: "sdf",
      mol: "sdf",
    };
    return map[ext] ?? this.format;
  }

  override render(): TemplateResult {
    const containerStyle = `height: ${this.height}px;`;

    if (this.missing) {
      return html`
        <div class="container" style="${containerStyle}">
          <div class="status">
            <span>Install <code>molstar</code> to enable 3D structure viewing.</span>
          </div>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="container" style="${containerStyle}">
          <div class="status error">
            <span>Failed to load molecular structure: ${this.error}</span>
          </div>
        </div>
      `;
    }

    if (!this.pdbId && !this.url) {
      return html`
        <div class="container" style="${containerStyle}">
          <div class="status">
            <span>Provide a <code>pdb-id</code> (e.g. "1CRN") or structure <code>url</code>.</span>
          </div>
        </div>
      `;
    }

    return html`
      <div class="container" style="${containerStyle}">
        ${this.loading
          ? html`<div class="status"><span>Loading 3D structure...</span></div>`
          : ""}
        <div class="canvas"></div>
      </div>
    `;
  }
}

define("atk-molstar", AtkMolstar);

declare global {
  interface HTMLElementTagNameMap {
    "atk-molstar": AtkMolstar;
  }
}
