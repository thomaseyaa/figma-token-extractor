// Minimal Figma REST API client.
// Docs: https://www.figma.com/developers/api

const FIGMA_API_BASE = "https://api.figma.com/v1";

export async function getFile(fileId: string, token: string): Promise<unknown> {
  return getJson(`/files/${fileId}`, token);
}

export async function getStyles(fileId: string, token: string): Promise<unknown> {
  return getJson(`/files/${fileId}/styles`, token);
}

// Figma Variables REST API. Enterprise / Enterprise+ plans only — other
// plans return 403. See https://www.figma.com/developers/api#variables.
export async function getVariables(fileId: string, token: string): Promise<unknown> {
  return getJson(`/files/${fileId}/variables/local`, token);
}

async function getJson(path: string, token: string): Promise<unknown> {
  const res = await fetch(`${FIGMA_API_BASE}${path}`, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) {
    throw new Error(`Figma API ${res.status}: ${res.statusText}`);
  }
  return res.json();
}
