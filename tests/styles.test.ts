import { describe, it, expect } from "vitest";
import { extractFillColors } from "../src/styles.js";

describe("extractFillColors", () => {
  it("pulls solid fill colours linked to a fill style", () => {
    const file = {
      styles: {
        "S:1": { name: "primary", styleType: "FILL" },
        "S:2": { name: "background", styleType: "FILL" },
      },
      document: {
        type: "DOCUMENT",
        children: [
          {
            type: "RECTANGLE",
            styles: { fill: "S:1" },
            fills: [{ type: "SOLID", color: { r: 0.2, g: 0.4, b: 0.8, a: 1 } }],
          },
          {
            type: "RECTANGLE",
            styles: { fill: "S:2" },
            fills: [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 1 } }],
          },
        ],
      },
    };
    const colors = extractFillColors(file);
    expect(colors).toHaveLength(2);
    expect(colors.find((c) => c.name === "primary")?.r).toBeCloseTo(0.2);
  });

  it("ignores non-solid paints", () => {
    const file = {
      styles: { "S:1": { name: "gradient", styleType: "FILL" } },
      document: {
        children: [
          { styles: { fill: "S:1" }, fills: [{ type: "GRADIENT_LINEAR" }] },
        ],
      },
    };
    expect(extractFillColors(file)).toHaveLength(0);
  });
});
