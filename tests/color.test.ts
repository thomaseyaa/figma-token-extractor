import { describe, it, expect } from "vitest";
import { rgbToHex } from "../src/color.js";

describe("rgbToHex", () => {
  it("converts pure red", () => {
    expect(rgbToHex(1, 0, 0)).toBe("#FF0000");
  });

  it("converts pure black", () => {
    expect(rgbToHex(0, 0, 0)).toBe("#000000");
  });

  it("rounds to nearest integer", () => {
    expect(rgbToHex(0.5, 0.5, 0.5)).toBe("#808080");
  });

  it("clamps out of range values", () => {
    expect(rgbToHex(1.5, -0.1, 0)).toBe("#FF0000");
  });

  it("appends alpha byte when alpha < 1", () => {
    expect(rgbToHex(0, 0, 0, 0.5)).toBe("#00000080");
  });

  it("omits alpha byte when alpha is 1", () => {
    expect(rgbToHex(1, 1, 1, 1)).toBe("#FFFFFF");
  });
});
