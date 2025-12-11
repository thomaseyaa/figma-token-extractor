import { describe, it, expect } from "vitest";
import { variablesToDTCG } from "../src/variables.js";

describe("variablesToDTCG", () => {
  it("maps COLOR variables to a hex DTCG token", () => {
    const out = variablesToDTCG({
      meta: {
        variables: {
          "v1": {
            id: "v1",
            name: "brand/primary",
            resolvedType: "COLOR",
            valuesByMode: { "1:0": { r: 0.2, g: 0.4, b: 0.8, a: 1 } },
          },
        },
      },
    });
    const brand = out.brand as Record<string, unknown>;
    expect(brand.primary).toEqual({ $value: "#3366CC", $type: "color" });
  });

  it("maps FLOAT variables to a dimension DTCG token", () => {
    const out = variablesToDTCG({
      meta: {
        variables: {
          "v2": {
            id: "v2",
            name: "spacing/sm",
            resolvedType: "FLOAT",
            valuesByMode: { "1:0": 8 },
          },
        },
      },
    });
    const spacing = out.spacing as Record<string, unknown>;
    expect(spacing.sm).toEqual({ $value: "8px", $type: "dimension" });
  });

  it("maps STRING variables to a string DTCG token", () => {
    const out = variablesToDTCG({
      meta: {
        variables: {
          "v3": {
            id: "v3",
            name: "font/sans",
            resolvedType: "STRING",
            valuesByMode: { "1:0": "Inter" },
          },
        },
      },
    });
    const font = out.font as Record<string, unknown>;
    expect(font.sans).toEqual({ $value: "Inter", $type: "string" });
  });

  it("skips BOOLEAN variables", () => {
    const out = variablesToDTCG({
      meta: {
        variables: {
          "v4": {
            id: "v4",
            name: "flags/dark",
            resolvedType: "BOOLEAN",
            valuesByMode: { "1:0": true },
          },
        },
      },
    });
    expect(Object.keys(out)).toHaveLength(0);
  });

  it("skips variables with an empty valuesByMode", () => {
    const out = variablesToDTCG({
      meta: {
        variables: {
          "v5": {
            id: "v5",
            name: "unset",
            resolvedType: "COLOR",
            valuesByMode: {},
          },
        },
      },
    });
    expect(Object.keys(out)).toHaveLength(0);
  });

  it("skips variables with a blank name", () => {
    const out = variablesToDTCG({
      meta: {
        variables: {
          "v6": {
            id: "v6",
            name: "  /  ",
            resolvedType: "FLOAT",
            valuesByMode: { "1:0": 1 },
          },
        },
      },
    });
    expect(Object.keys(out)).toHaveLength(0);
  });
});
