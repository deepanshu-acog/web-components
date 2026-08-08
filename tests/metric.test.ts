import { describe, expect, test } from "bun:test";
import "../src/components/metric/metric.js";
import type { AtkMetric } from "../src/components/metric/metric.js";

async function mount(markup: string): Promise<AtkMetric> {
  const host = document.createElement("div");
  host.innerHTML = markup;
  document.body.append(host);
  const element = host.firstElementChild as AtkMetric;
  await element.updateComplete;
  return element;
}

const text = (element: AtkMetric): string =>
  element.shadowRoot?.textContent?.replace(/\s+/g, " ").trim() ?? "";

describe("atk-metric", () => {
  test("registers itself", () => {
    expect(customElements.get("atk-metric")).toBeDefined();
  });

  test("shows the label, value and unit", async () => {
    const element = await mount(
      `<atk-metric label="Hemoglobin" value="10.2" unit="g/dL"></atk-metric>`,
    );
    expect(text(element)).toContain("Hemoglobin");
    expect(text(element)).toContain("10.2");
    expect(text(element)).toContain("g/dL");
  });

  test("reads history from the JSON child", async () => {
    const element = await mount(
      `<atk-metric label="WBC" value="6"><script type="application/json">[4,5,6]</script></atk-metric>`,
    );
    expect(element.series).toEqual([4, 5, 6]);
    expect(element.shadowRoot?.querySelector("polyline")).not.toBeNull();
  });

  test("survives malformed JSON without throwing", async () => {
    const element = await mount(
      `<atk-metric label="WBC" value="6"><script type="application/json">{not json</script></atk-metric>`,
    );
    expect(element.series).toEqual([]);
    expect(text(element)).toContain("History unavailable");
  });

  test("rejects a JSON array that is not all numbers", async () => {
    const element = await mount(
      `<atk-metric label="WBC" value="6"><script type="application/json">[1,"two",3]</script></atk-metric>`,
    );
    expect(element.series).toEqual([]);
    expect(text(element)).toContain("History unavailable");
  });

  test("draws no chart when there is too little history", async () => {
    const element = await mount(
      `<atk-metric label="WBC" value="6"><script type="application/json">[6]</script></atk-metric>`,
    );
    expect(element.shadowRoot?.querySelector("polyline")).toBeNull();
    // The value itself is still shown.
    expect(text(element)).toContain("6");
  });

  test("states out-of-range in words, not only in colour", async () => {
    const low = await mount(
      `<atk-metric label="Hb" value="10.2" low="13.5" high="17.5"></atk-metric>`,
    );
    expect(text(low)).toContain("Below normal");

    const high = await mount(
      `<atk-metric label="Hb" value="20" low="13.5" high="17.5"></atk-metric>`,
    );
    expect(text(high)).toContain("Above normal");
  });

  test("says nothing about range when the value is normal", async () => {
    const element = await mount(
      `<atk-metric label="Hb" value="15" low="13.5" high="17.5"></atk-metric>`,
    );
    expect(text(element)).not.toContain("normal range");
    expect(text(element)).toContain("Normal 13.5");
  });

  test("the chart carries an accessible label", async () => {
    const element = await mount(
      `<atk-metric label="WBC" value="6"><script type="application/json">[4,5,6]</script></atk-metric>`,
    );
    const svg = element.shadowRoot?.querySelector("svg");
    expect(svg?.getAttribute("role")).toBe("img");
    expect(svg?.getAttribute("aria-label")).toContain("WBC");
  });
});
