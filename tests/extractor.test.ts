import { describe, it, expect } from "vitest";
import { variablesToDTCG } from "../src/extractor.js";
import type { FigmaVariablesResponse } from "../src/api.js";

const mockResponse: FigmaVariablesResponse = {
  meta: {
    variables: {
      "var1": {
        id: "var1",
        name: "color/primary",
        resolvedType: "COLOR",
        valuesByMode: {
          "mode1": { r: 0.231, g: 0.510, b: 0.965, a: 1 }
        }
      },
      "var2": {
        id: "var2",
        name: "color/secondary",
        resolvedType: "COLOR",
        valuesByMode: {
          "mode1": { r: 0.388, g: 0.400, b: 0.945, a: 1 }
        }
      },
      "var3": {
        id: "var3",
        name: "spacing/sm",
        resolvedType: "FLOAT",
        valuesByMode: {
          "mode1": 8
        }
      },
      "var4": {
        id: "var4",
        name: "spacing/md",
        resolvedType: "FLOAT",
        valuesByMode: {
          "mode1": 16
        }
      },
      "var5": {
        id: "var5",
        name: "typography/heading/font-family",
        resolvedType: "STRING",
        valuesByMode: {
          "mode1": "Inter"
        }
      },
      "var6": {
        id: "var6",
        name: "color/overlay",
        resolvedType: "COLOR",
        valuesByMode: {
          "mode1": { r: 0, g: 0, b: 0, a: 0.5 }
        }
      }
    },
    variableCollections: {}
  }
};

describe("variablesToDTCG", () => {
  it("converts color variables to hex", () => {
    const result = variablesToDTCG(mockResponse);
    const color = result.color as Record<string, unknown>;
    const primary = color.primary as { $value: string; $type: string };
    expect(primary.$value).toMatch(/^#[0-9A-F]{6}$/);
    expect(primary.$type).toBe("color");
  });

  it("converts float variables to dimension tokens", () => {
    const result = variablesToDTCG(mockResponse);
    const spacing = result.spacing as Record<string, unknown>;
    const sm = spacing.sm as { $value: string; $type: string };
    expect(sm.$value).toBe("8px");
    expect(sm.$type).toBe("dimension");
  });

  it("converts string variables to fontFamily tokens", () => {
    const result = variablesToDTCG(mockResponse);
    const typography = result.typography as Record<string, unknown>;
    const heading = typography.heading as Record<string, unknown>;
    const fontFamily = heading["font-family"] as { $value: string; $type: string };
    expect(fontFamily.$value).toBe("Inter");
    expect(fontFamily.$type).toBe("fontFamily");
  });

  it("handles alpha channel in colors", () => {
    const result = variablesToDTCG(mockResponse);
    const color = result.color as Record<string, unknown>;
    const overlay = color.overlay as { $value: string; $type: string };
    expect(overlay.$value).toMatch(/^#[0-9A-F]{8}$/);
  });

  it("creates nested structure from slash-separated names", () => {
    const result = variablesToDTCG(mockResponse);
    expect(result.color).toBeDefined();
    expect(result.spacing).toBeDefined();
    expect(result.typography).toBeDefined();
  });
});
