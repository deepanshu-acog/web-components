import { describe, expect, test } from "bun:test";
import "../src/components/go-ribbon/go-ribbon.js";
import type { AtkGoRibbon } from "../src/components/go-ribbon/go-ribbon.js";

async function mount(markup: string): Promise<AtkGoRibbon> {
  const host = document.createElement("div");
  host.innerHTML = markup;
  document.body.append(host);
  const element = host.firstElementChild as AtkGoRibbon;
  await element.updateComplete;
  return element;
}

const text = (element: AtkGoRibbon): string =>
  element.shadowRoot?.textContent?.replace(/\s+/g, " ").trim() ?? "";

describe("atk-go-ribbon", () => {
  test("registers itself", () => {
    expect(customElements.get("atk-go-ribbon")).toBeDefined();
  });

  test("shows a loading message before the upstream component arrives", async () => {
    const element = await mount(
      `<atk-go-ribbon subject="UniProtKB:Q8NER5"></atk-go-ribbon>`,
    );
    expect(text(element)).toContain("Loading");
  });

  // The package is an optional dependency and is not installed here, so the
  // dynamic import fails. That is exactly the case worth testing: a missing
  // optional dependency must degrade visibly, not blank the region.
  test("a failed load says so and keeps the subject visible", async () => {
    const element = await mount(
      `<atk-go-ribbon subject="UniProtKB:Q8NER5"></atk-go-ribbon>`,
    );

    // Wait for the import to reject and the re-render to settle.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await element.updateComplete;

    expect(text(element)).toContain("could not be loaded");
    expect(text(element)).toContain("UniProtKB:Q8NER5");
  });

  test("the fallback links somewhere useful", async () => {
    const element = await mount(
      `<atk-go-ribbon subject="UniProtKB:Q8NER5"></atk-go-ribbon>`,
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
    await element.updateComplete;

    const link = element.shadowRoot?.querySelector("a");
    expect(link?.getAttribute("href")).toContain("QuickGO");
    expect(link?.getAttribute("href")).toContain(encodeURIComponent("UniProtKB:Q8NER5"));
  });

  test("does not fail without a subject", async () => {
    const element = await mount(`<atk-go-ribbon></atk-go-ribbon>`);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector("a")).toBeNull();
  });
});
