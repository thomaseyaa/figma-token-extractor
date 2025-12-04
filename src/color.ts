// Convert Figma's normalised 0-1 RGB(A) to a hex string.
// Alpha is appended as a fourth byte when it's less than 1.

export function rgbToHex(r: number, g: number, b: number, a?: number): string {
  const rgb = [r, g, b].map(channel).join("");
  if (a === undefined || a >= 1) return "#" + rgb;
  return "#" + rgb + channel(a);
}

function channel(c: number): string {
  const n = Math.max(0, Math.min(255, Math.round(c * 255)));
  return n.toString(16).padStart(2, "0").toUpperCase();
}
