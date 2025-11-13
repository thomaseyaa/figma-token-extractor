// Minimal Figma REST API client.
// Docs: https://www.figma.com/developers/api

const FIGMA_API_BASE = "https://api.figma.com/v1";

export async function getFile(fileId: string, token: string): Promise<unknown> {
  const res = await fetch(`${FIGMA_API_BASE}/files/${fileId}`, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) {
    throw new Error(`Figma API ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export async function getStyles(fileId: string, token: string): Promise<unknown> {
  const res = await fetch(`${FIGMA_API_BASE}/files/${fileId}/styles`, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) {
    throw new Error(`Figma API ${res.status}: ${res.statusText}`);
  }
  return res.json();
}
