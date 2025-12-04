// WIP: convert our extracted Figma colours into something resembling the
// Design Tokens Community Group format (https://tr.designtokens.org/format/).

import type { RawColor } from "./styles.js";
import { rgbToHex } from "./color.js";

export interface DTCGColorToken {
  $value: string;
  $type: "color";
}

export type DTCGGroup = { [key: string]: DTCGGroup | DTCGColorToken };

export function colorsToDTCG(colors: RawColor[]): DTCGGroup {
  const root: DTCGGroup = {};
  for (const c of colors) {
    const path = c.name.split("/").map(slug);
    place(root, path, { $value: rgbToHex(c.r, c.g, c.b, c.a), $type: "color" });
  }
  return root;
}

function slug(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, "-");
}

function place(group: DTCGGroup, path: string[], token: DTCGColorToken): void {
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
