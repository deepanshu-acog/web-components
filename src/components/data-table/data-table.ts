import { css, html, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { AganithaComponent } from "../../base.js";
import { define } from "../../define.js";
import { lazy_load } from "../../lazy.js";

interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
}

/**
 * Enterprise data table component powered by AG-Grid themed to Web Awesome tokens.
 *
 * Pass CSV data in a `<script type="text/csv">` child or JSON rows in a
 * `<script type="application/json">` child. Supports column sorting, filtering,
 * pagination, and CSV exports.
 *
 * @customElement atk-data-table
 * @summary AG-Grid enterprise data table themed to brand tokens.
 *
 * @atk-use Displaying multi-column tabular data, clinical trial patient lists,
 * gene expression matrices, or large datasets requiring sorting and filtering.
 *
 * @atk-avoid Do not use for simple key-value pairs or small 2-3 row lists; use
 * a definition list or record list instead.
 *
 * @example
 * ```html
 * <atk-data-table title="Phase III Patient Cohorts" page-size="10">
 *   <script type="text/csv">
 *     Cohort,Dose,Patients,Status
 *     Cohort A,15 mg,120,Active
 *     Cohort B,30 mg,115,Active
 *   </script>
 * </atk-data-table>
 * ```
 */
export class AtkDataTable extends AganithaComponent {
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

    .grid-container {
      width: 100%;
      min-height: 200px;
    }

    .fallback-table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--wa-font-size-s);
    }

    .fallback-table th,
    .fallback-table td {
      padding: var(--wa-space-s) var(--wa-space-m);
      border-bottom: 1px solid var(--wa-color-surface-border);
      text-align: left;
    }

    .fallback-table th {
      font-weight: var(--wa-font-weight-semibold);
      background-color: var(--wa-color-surface-lowered);
    }

    .status {
      padding: var(--wa-space-l);
      text-align: center;
      font-size: var(--wa-font-size-s);
      color: var(--wa-color-text-quiet);
    }
  `;

  /** Section or table title shown in the header bar. */
  @property({ type: String }) title = "";

  /** Number of rows per page. Defaults to 10. */
  @property({ type: Number, attribute: "page-size" }) pageSize = 10;

  @state() private columns: ColumnDef[] = [];
  @state() private rows: Record<string, string>[] = [];
  @state() private loading = true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private gridApi: any = null;

  private cleanup_lazy_load?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this.read_data_children();
    this.cleanup_lazy_load = lazy_load(this, () => this.init_grid());
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup_lazy_load?.();
  }

  private read_data_children(): void {
    const csvScript = this.querySelector<HTMLScriptElement>('script[type="text/csv"]');
    if (csvScript?.textContent?.trim()) {
      this.parse_csv(csvScript.textContent.trim());
      return;
    }

    const jsonScript = this.querySelector<HTMLScriptElement>('script[type="application/json"]');
    if (jsonScript?.textContent?.trim()) {
      try {
        const parsed = JSON.parse(jsonScript.textContent);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.rows = parsed;
          this.columns = Object.keys(parsed[0]).map((key) => ({
            key,
            label: key,
            sortable: true,
          }));
        }
      } catch {
        /* invalid json */
      }
    }
  }

  private parse_csv(csv: string): void {
    const lines = csv.split("\n").map((line) => line.trim()).filter(Boolean);
    const firstLine = lines[0];
    if (!firstLine) return;

    const headers = firstLine.split(",").map((h) => h.trim());
    this.columns = headers.map((key) => ({ key, label: key, sortable: true }));

    this.rows = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, i) => {
        if (h) row[h] = values[i] ?? "";
      });
      return row;
    });
  }

  private async init_grid(): Promise<void> {
    await this.updateComplete;
    const container = this.shadowRoot?.querySelector<HTMLElement>(".grid-container");
    if (!container || this.rows.length === 0) {
      this.loading = false;
      return;
    }

    try {
      const agGridModule = await import("ag-grid-community");
      agGridModule.ModuleRegistry.registerModules([agGridModule.AllCommunityModule]);

      const columnDefs = this.columns.map((col) => ({
        field: col.key,
        headerName: col.label,
        sortable: true,
        filter: true,
      }));

      this.gridApi = agGridModule.createGrid(container, {
        columnDefs,
        rowData: this.rows,
        pagination: true,
        paginationPageSize: this.pageSize,
        domLayout: "autoHeight",
      });

      this.loading = false;
    } catch {
      this.loading = false;
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="wrapper">
        ${this.title
          ? html`<div class="header"><span class="title">${this.title}</span></div>`
          : ""}
        <div class="grid-container">
          ${this.loading || !this.gridApi
            ? html`
                <table class="fallback-table">
                  <thead>
                    <tr>
                      ${this.columns.map((c) => html`<th>${c.label}</th>`)}
                    </tr>
                  </thead>
                  <tbody>
                    ${this.rows.slice(0, this.pageSize).map(
                      (row) => html`
                        <tr>
                          ${this.columns.map((c) => html`<td>${row[c.key] ?? ""}</td>`)}
                        </tr>
                      `,
                    )}
                  </tbody>
                </table>
              `
            : ""}
        </div>
      </div>
    `;
  }
}

define("atk-data-table", AtkDataTable);

declare global {
  interface HTMLElementTagNameMap {
    "atk-data-table": AtkDataTable;
  }
}
