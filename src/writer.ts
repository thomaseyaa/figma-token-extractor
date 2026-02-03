import { writeFileSync } from "fs";
import type { DTCGOutput } from "./extractor.js";

export function writeTokens(output: DTCGOutput, filePath: string): void {
  writeFileSync(filePath, JSON.stringify(output, null, 2) + "\n");
}

export function printTokens(output: DTCGOutput): void {
  console.log(JSON.stringify(output, null, 2));
}
