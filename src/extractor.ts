import type { FigmaVariable, FigmaVariablesResponse, FigmaColor } from "./api.js";

export interface DTCGToken {
  $value: string;
  $type: string;
}

export type DTCGOutput = Record<string, unknown>;

export function variablesToDTCG(data: FigmaVariablesResponse): DTCGOutput {
  const output: DTCGOutput = {};
  const variables = Object.values(data.meta.variables);

  for (const variable of variables) {
    const path = variable.name.replace(/\//g, ".").replace(/\s+/g, "-").toLowerCase();
    const modeValues = Object.values(variable.valuesByMode);
    const value = modeValues[0];

    if (value === undefined || value === null) continue;

    let token: DTCGToken;

    switch (variable.resolvedType) {
      case "COLOR":
        token = { $value: figmaColorToHex(value as FigmaColor), $type: "color" };
        break;
      case "FLOAT":
        token = { $value: `${value}px`, $type: "dimension" };
        break;
      case "STRING":
        token = { $value: String(value), $type: "fontFamily" };
        break;
      case "BOOLEAN":
        continue;
      default:
        continue;
    }

    setNestedValue(output, path, token);
  }

  return output;
}

function figmaColorToHex(color: FigmaColor): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);

  if (color.a < 1) {
    const a = Math.round(color.a * 255);
    return `#${hex(r)}${hex(g)}${hex(b)}${hex(a)}`;
  }

  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

function hex(n: number): string {
  return n.toString(16).padStart(2, "0").toUpperCase();
}

function setNestedValue(obj: DTCGOutput, path: string, value: DTCGToken): void {
  const parts = path.split(".");
  let current = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (!(key in current) || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key] as DTCGOutput;
  }

  current[parts[parts.length - 1]] = value;
}
