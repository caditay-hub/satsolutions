import { describe, expect, it } from "vitest";
import { isBuildSkewError } from "./buildSkew";

describe("isBuildSkewError — формулировки рассинхрона сборок из Sentry 19–20.11.2026", () => {
  it("узнаёт Chrome, Firefox, Safari и ChunkLoadError", () => {
    expect(isBuildSkewError(new TypeError("Cannot read properties of undefined (reading 'call')"))).toBe(true);
    expect(isBuildSkewError(new TypeError("can't access property \"call\", e[o] is undefined"))).toBe(true);
    expect(isBuildSkewError(new TypeError("undefined is not an object (evaluating 'e[o].call')"))).toBe(true);
    const chunk = new Error("Loading chunk 7590 failed.");
    chunk.name = "ChunkLoadError";
    expect(isBuildSkewError(chunk)).toBe(true);
    expect(isBuildSkewError("Loading CSS chunk 2147 failed")).toBe(true);
  });
  it("не трогает другие ошибки", () => {
    expect(isBuildSkewError(new TypeError("Cannot read properties of undefined (reading 'map')"))).toBe(false);
    expect(isBuildSkewError(new Error("Failed to execute 'removeChild' on 'Node'"))).toBe(false);
    expect(isBuildSkewError(new RangeError("Maximum call stack size exceeded"))).toBe(false);
    expect(isBuildSkewError(null)).toBe(false);
    expect(isBuildSkewError({ reason: 1 })).toBe(false);
  });
});
