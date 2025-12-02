import { describe, it, expect } from "vitest";
import { colorsToDTCG } from "../src/dtcg.js";

describe("colorsToDTCG", () => {
  it("nests slash-separated names into groups", () => {
    const out = colorsToDTCG([
      { name: "brand/primary", r: 0.2, g: 0.4, b: 0.8, a: 1 },
      { name: "brand/secondary", r: 0.4, g: 0.4, b: 0.8, a: 1 },
    ]);
    expect(out).toHaveProperty("brand.primary.$type", "color");
    expect(out).toHaveProperty("brand.secondary.$type", "color");
  });

  it("lower-cases and slug-ifies segment names", () => {
    const out = colorsToDTCG([
      { name: "Brand / Hot Pink", r: 1, g: 0, b: 0.5, a: 1 },
    ]);
    const brand = out.brand as Record<string, unknown>;
    expect(brand["hot-pink"]).toBeDefined();
  });
});
