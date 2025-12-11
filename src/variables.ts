// Map a Figma Variables API payload to DTCG-shaped tokens.
//
// The payload looks roughly like:
//   { meta: { variables: { <id>: { name, resolvedType, valuesByMode } } } }
//
// Each variable can have a different value per "mode" (e.g. light / dark).
// For now we only emit the value of the first mode.

import { rgbToHex } from "./color.js";

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface FigmaVariable {
  id: string;
  name: string;
  resolvedType: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
  valuesByMode: Record<string, unknown>;
}

export interface FigmaVariablesPayload {
  meta?: {
    variables?: Record<string, FigmaVariable>;
  };
}

export interface DTCGToken {
  $value: string | number | boolean;
  $type: "color" | "dimension" | "fontFamily" | "string";
}

export type DTCGGroup = { [key: string]: DTCGGroup | DTCGToken };

export function variablesToDTCG(payload: FigmaVariablesPayload): DTCGGroup {
  const root: DTCGGroup = {};
  const vars = Object.values(payload.meta?.variables ?? {});

  for (const v of vars) {
    if (!v?.name || !v?.resolvedType) continue;
    if (!v.valuesByMode || typeof v.valuesByMode !== "object") continue;

    const value = firstValue(v.valuesByMode);
    if (value === undefined || value === null) continue;

    const token = toToken(v.resolvedType, value);
    if (!token) continue;

    const path = v.name.split("/").map(slug).filter(Boolean);
    if (path.length === 0) continue;

    place(root, path, token);
  }

  return root;
}

function firstValue(modes: Record<string, unknown>): unknown {
  const keys = Object.keys(modes);
  return keys.length ? modes[keys[0]] : undefined;
}

function toToken(type: FigmaVariable["resolvedType"], value: unknown): DTCGToken | null {
  switch (type) {
    case "COLOR": {
      const c = value as FigmaColor;
      if (typeof c?.r !== "number") return null;
      return { $value: rgbToHex(c.r, c.g, c.b, c.a), $type: "color" };
    }
    case "FLOAT":
      if (typeof value !== "number") return null;
      return { $value: `${value}px`, $type: "dimension" };
    case "STRING":
      if (typeof value !== "string") return null;
      return { $value: value, $type: "string" };
    case "BOOLEAN":
      return null;
  }
}

function slug(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, "-");
}

function place(group: DTCGGroup, path: string[], token: DTCGToken): void {
  const [head, ...rest] = path;
  if (!head) return;
  if (rest.length === 0) {
    group[head] = token;
    return;
  }
  const existing = group[head];
  const child: DTCGGroup =
    existing && !("$value" in existing) ? (existing as DTCGGroup) : {};
  group[head] = child;
  place(child, rest, token);
}
