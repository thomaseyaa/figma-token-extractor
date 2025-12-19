import { writeFileSync } from "node:fs";

// Dump raw API responses to disk for inspection.

export function dumpJson(data: unknown, outPath: string): void {
  writeFileSync(outPath, JSON.stringify(data, null, 2) + "\n", "utf8");
}
