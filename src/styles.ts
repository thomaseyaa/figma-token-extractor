// Walk a Figma file payload and pull out anything that looks like a fill colour.
// This is intentionally crude: we only care about solid paints for now.

export interface RawColor {
  name: string;
  r: number;
  g: number;
  b: number;
  a: number;
}

interface FigmaNode {
  id?: string;
  name?: string;
  type?: string;
  fills?: Array<{ type?: string; color?: { r: number; g: number; b: number; a?: number }; opacity?: number }>;
  styles?: Record<string, string>;
  children?: FigmaNode[];
}

interface FigmaFile {
  document?: FigmaNode;
  styles?: Record<string, { name: string; styleType: string }>;
}

export function extractFillColors(file: FigmaFile): RawColor[] {
  const styleNames = file.styles ?? {};
  const out: RawColor[] = [];

  function walk(node: FigmaNode | undefined): void {
    if (!node) return;
    const fillStyleId = node.styles?.fill;
    if (fillStyleId && styleNames[fillStyleId]?.styleType === "FILL") {
      const fill = (node.fills ?? []).find((f) => f.type === "SOLID" && f.color);
      if (fill?.color) {
        out.push({
          name: styleNames[fillStyleId].name,
          r: fill.color.r,
          g: fill.color.g,
          b: fill.color.b,
          a: fill.color.a ?? fill.opacity ?? 1,
        });
      }
    }
    for (const child of node.children ?? []) walk(child);
  }

  walk(file.document);

  // Deduplicate by name (last write wins, which mirrors what Figma does)
  const map = new Map<string, RawColor>();
  for (const c of out) map.set(c.name, c);
  return [...map.values()];
}
