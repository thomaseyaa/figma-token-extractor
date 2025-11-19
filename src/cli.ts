import { Command } from "commander";
import { getFile, getStyles } from "./api.js";
import { dumpJson } from "./dump.js";
import { extractFillColors } from "./styles.js";
import { rgbToHex } from "./color.js";

export interface CliOptions {
  fileId?: string;
  token?: string;
  raw?: boolean;
}

export function buildProgram(): Command {
  const program = new Command();
  program
    .name("figma-token-extractor")
    .description("Extract design tokens from a Figma file")
    .option("--file-id <id>", "Figma file id")
    .option("--token <token>", "Figma access token (or FIGMA_ACCESS_TOKEN env)")
    .option("--raw", "dump the raw API responses to disk", false)
    .action(run);
  return program;
}

export async function run(opts: CliOptions): Promise<void> {
  const token = opts.token ?? process.env.FIGMA_ACCESS_TOKEN;
  if (!opts.fileId) {
    throw new Error("missing --file-id");
  }
  if (!token) {
    throw new Error("missing token: pass --token or set FIGMA_ACCESS_TOKEN");
  }

  const file = await getFile(opts.fileId, token) as Parameters<typeof extractFillColors>[0];

  if (opts.raw) {
    dumpJson(file, "figma-file.json");
    const styles = await getStyles(opts.fileId, token);
    dumpJson(styles, "figma-styles.json");
    console.log("wrote figma-file.json and figma-styles.json");
    return;
  }

  const colors = extractFillColors(file);
  for (const c of colors) {
    console.log(`${c.name}\t${rgbToHex(c.r, c.g, c.b)}`);
  }
}
