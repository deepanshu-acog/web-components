import { describe, expect, test } from "bun:test";
import "../src/components/sidenote/sidenote.js";
import "../src/components/timeline/timeline.js";
import "../src/components/mermaid/mermaid.js";
import type { AtkSidenote } from "../src/components/sidenote/sidenote.js";
import type { AtkTimeline } from "../src/components/timeline/timeline.js";
import type { AtkMermaid } from "../src/components/mermaid/mermaid.js";

async function mount<T extends HTMLElement>(markup: string): Promise<T> {
  const host = document.createElement("div");
  host.innerHTML = markup;
  document.body.append(host);
  const element = host.firstElementChild as T;
  // @ts-expect-error Lit updateComplete
  if (element.updateComplete) await element.updateComplete;
  return element;
}

describe("atk-sidenote", () => {
  test("registers itself", () => {
    expect(customElements.get("atk-sidenote")).toBeDefined();
  });

  test("renders note label and type badge", async () => {
    const el = await mount<AtkSidenote>(
      `<atk-sidenote type="Note" label="Pharmacokinetics">Test content</atk-sidenote>`,
    );
    const text = el.shadowRoot?.textContent ?? "";
    expect(text).toContain("Note");
    expect(text).toContain("Pharmacokinetics");
  });
});

describe("atk-timeline", () => {
  test("registers itself", () => {
    expect(customElements.get("atk-timeline")).toBeDefined();
  });

  test("renders title and slot container", async () => {
    const el = await mount<AtkTimeline>(
      `<atk-timeline title="Trial Progress"><div class="step">Step 1</div></atk-timeline>`,
    );
    const text = el.shadowRoot?.textContent ?? "";
    expect(text).toContain("Trial Progress");
  });
});

import "../src/components/molstar/molstar.js";
import "../src/components/data-table/data-table.js";
import type { AtkMolstar } from "../src/components/molstar/molstar.js";
import type { AtkDataTable } from "../src/components/data-table/data-table.js";

describe("atk-mermaid", () => {
  test("registers itself", () => {
    expect(customElements.get("atk-mermaid")).toBeDefined();
  });

  test("initializes with code property", async () => {
    const el = await mount<AtkMermaid>(
      `<atk-mermaid code="graph LR; A-->B;"></atk-mermaid>`,
    );
    expect(el.code).toBe("graph LR; A-->B;");
  });
});

describe("atk-molstar", () => {
  test("registers itself", () => {
    expect(customElements.get("atk-molstar")).toBeDefined();
  });

  test("initializes with pdb-id property", async () => {
    const el = await mount<AtkMolstar>(
      `<atk-molstar pdb-id="1CRN" height="400"></atk-molstar>`,
    );
    expect(el.pdbId).toBe("1CRN");
    expect(el.height).toBe(400);
  });
});

describe("atk-data-table", () => {
  test("registers itself", () => {
    expect(customElements.get("atk-data-table")).toBeDefined();
  });

  test("parses CSV child element", async () => {
    const el = await mount<AtkDataTable>(
      `<atk-data-table title="Cohorts">
        <script type="text/csv">
          Cohort, Patients
          A, 100
        </script>
      </atk-data-table>`,
    );
    const text = el.shadowRoot?.textContent ?? "";
    expect(text).toContain("Cohorts");
    expect(text).toContain("Cohort");
  });
});

