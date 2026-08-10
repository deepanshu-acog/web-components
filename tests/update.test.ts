import { describe, expect, test } from "bun:test";
import { is_compiled_binary, is_newer_version } from "../src/core/update.js";

describe("is_compiled_binary", () => {
  test("refuses to self-update when running via `bun run`", () => {
    // The test runner itself is `bun`, exactly the case this guards against —
    // no separate mock needed, `process.execPath` already proves the point.
    expect(is_compiled_binary()).toBe(false);
  });
});

describe("is_newer_version", () => {
  test("recognises a later release tag", () => {
    expect(is_newer_version("1.2.3", "v1.2.4")).toBe(true);
  });

  test("does not offer the current or an older release", () => {
    expect(is_newer_version("1.2.3", "v1.2.3")).toBe(false);
    expect(is_newer_version("1.2.3", "v1.2.2")).toBe(false);
  });

  test("rejects a release tag that is not semantic versioning", () => {
    expect(() => is_newer_version("1.2.3", "latest")).toThrow("not a valid semantic version");
  });
});
