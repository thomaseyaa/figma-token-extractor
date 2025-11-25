// Pull Figma text styles out of a file payload.
// Same shape of walker as `extractFillColors`, just keyed on the `text` style.

export interface RawTextStyle {
  name: string;
  fontFamily: string;
  fontSize: number;
  fontWeight?: number;
  lineHeightPx?: number;
}

interface TextNode {
  style?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number;
    lineHeightPx?: number;
  };
  styles?: Record<string, string>;
  children?: TextNode[];
}

interface FigmaFile {
  document?: TextNode;
  styles?: Record<string, { name: string; styleType: string }>;
}

export function extractTextStyles(file: FigmaFile): RawTextStyle[] {
  const styleNames = file.styles ?? {};
  const out: RawTextStyle[] = [];

  function walk(node: TextNode | undefined): void {
    if (!node) return;
    const textStyleId = node.styles?.text;
    if (textStyleId && styleNames[textStyleId]?.styleType === "TEXT" && node.style) {
      const s = node.style;
      if (s.fontFamily && typeof s.fontSize === "number") {
        out.push({
          name: styleNames[textStyleId].name,
          fontFamily: s.fontFamily,
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          lineHeightPx: s.lineHeightPx,
        });
      }
    }
    for (const child of node.children ?? []) walk(child);
  }

  walk(file.document);

  const map = new Map<string, RawTextStyle>();
  for (const t of out) map.set(t.name, t);
  return [...map.values()];
}
