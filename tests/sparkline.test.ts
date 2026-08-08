import { describe, expect, test } from "bun:test";
import { sparkline_geometry } from "../src/components/metric/sparkline.js";

const size = { width: 100, height: 20 };

describe("sparkline_geometry", () => {
  test("refuses to draw fewer than two points", () => {
    expect(sparkline_geometry([], size)).toBeNull();
    expect(sparkline_geometry([5], size)).toBeNull();
  });

  test("ignores values that are not finite", () => {
    // One real point survives, which is not enough to draw.
    expect(sparkline_geometry([1, NaN, Infinity], size)).toBeNull();
  });

  test("a flat series does not divide by zero", () => {
    const geometry = sparkline_geometry([4, 4, 4], size);
    expect(geometry).not.toBeNull();
    for (const pair of geometry!.points.split(" ")) {
      const y = Number(pair.split(",")[1]);
      expect(Number.isFinite(y)).toBe(true);
    }
  });

  test("spans the full height when there is a range", () => {
    const geometry = sparkline_geometry([0, 10], size)!;
    const ys = geometry.points.split(" ").map((p) => Number(p.split(",")[1]));
    // Lowest value sits at the bottom, highest at the top.
    expect(Math.max(...ys)).toBeCloseTo(20);
    expect(Math.min(...ys)).toBeCloseTo(0);
  });

  test("a value outside the normal range stays inside the chart", () => {
    // 40 is far above the stated normal range, so the scale has to grow to
    // fit it. Clipping here would hide exactly the case that matters most.
    const geometry = sparkline_geometry([12, 40], { ...size, low: 10, high: 20 })!;
    const ys = geometry.points.split(" ").map((p) => Number(p.split(",")[1]));
    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(20);
    }
  });

  test("the band covers the normal range and nothing else", () => {
    const geometry = sparkline_geometry([0, 100], { ...size, low: 0, high: 100 })!;
    expect(geometry.band).not.toBeNull();
    expect(geometry.band!.y).toBeCloseTo(0);
    expect(geometry.band!.height).toBeCloseTo(20);
  });

  test("no band without both bounds", () => {
    expect(sparkline_geometry([1, 2], { ...size, low: 1 })!.band).toBeNull();
    expect(sparkline_geometry([1, 2], size)!.band).toBeNull();
  });

  test("the last point is the most recent reading", () => {
    const geometry = sparkline_geometry([0, 5, 10], size)!;
    expect(geometry.last.x).toBeCloseTo(100);
    expect(geometry.last.y).toBeCloseTo(0);
  });
});
