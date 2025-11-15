// Convert Figma's normalised 0-1 RGB to a hex string.
// Alpha is dropped for now; opaque colours only.

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(channel).join("");
}

function channel(c: number): string {
  const n = Math.max(0, Math.min(255, Math.round(c * 255)));
  return n.toString(16).padStart(2, "0").toUpperCase();
}
