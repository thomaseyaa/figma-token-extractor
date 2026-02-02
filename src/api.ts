const FIGMA_API = "https://api.figma.com/v1";

export interface FigmaVariable {
  id: string;
  name: string;
  resolvedType: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
  valuesByMode: Record<string, unknown>;
}

export interface FigmaVariableCollection {
  id: string;
  name: string;
  variableIds: string[];
}

export interface FigmaVariablesResponse {
  meta: {
    variables: Record<string, FigmaVariable>;
    variableCollections: Record<string, FigmaVariableCollection>;
  };
}

export interface FigmaStyle {
  key: string;
  name: string;
  style_type: "FILL" | "TEXT" | "EFFECT" | "GRID";
  description: string;
}

export interface FigmaStylesResponse {
  meta: {
    styles: FigmaStyle[];
  };
}

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export async function fetchVariables(fileId: string, token: string): Promise<FigmaVariablesResponse> {
  const res = await fetch(`${FIGMA_API}/files/${fileId}/variables/local`, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) throw new Error(`Figma API error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<FigmaVariablesResponse>;
}

export async function fetchStyles(fileId: string, token: string): Promise<FigmaStylesResponse> {
  const res = await fetch(`${FIGMA_API}/files/${fileId}/styles`, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) throw new Error(`Figma API error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<FigmaStylesResponse>;
}
