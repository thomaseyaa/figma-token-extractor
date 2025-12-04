import { writeFileSync } from "node:fs";
import { Command } from "commander";
import { getFile, getStyles } from "./api.js";
import { dumpJson } from "./dump.js";
import { extractFillColors } from "./styles.js";
import { rgbToHex } from "./color.js";
import { colorsToDTCG } from "./dtcg.js";

export interface CliOptions {
  fileId?: string;
  token?: string;
  raw?: boolean;
  output?: string;
  format?: "tsv" | "dtcg";
}

export class UsageError extends Error {}

export function buildProgram(): Command {
  const program = new Command();
  program
    .name("figma-token-extractor")
    .description("Extract design tokens from a Figma file")
    .option("--file-id <id>", "Figma file id")
    .option("--token <token>", "Figma access token (or FIGMA_ACCESS_TOKEN env)")
    .option("--raw", "dump the raw API responses to disk", false)
    .option("-o, --output <file>", "write tokens to <file> instead of stdout")
    .option("--format <fmt>", "output format: tsv or dtcg", "tsv")
    .action(run);
  return program;
}

export async function run(opts: CliOptions): Promise<void> {
  if (!opts.fileId) {
    throw new UsageError("missing --file-id");
  }
  const token = opts.token ?? process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    throw new UsageError(
      "missing Figma access token. Pass --token <t> or set FIGMA_ACCESS_TOKEN."
    );
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
  const output =
    opts.format === "dtcg"
      ? JSON.stringify(colorsToDTCG(colors), null, 2) + "\n"
      : colors.map((c) => `${c.name}\t${rgbToHex(c.r, c.g, c.b, c.a)}`).join("\n") + "\n";

  if (opts.output) {
    writeFileSync(opts.output, output, "utf8");
    console.log(`wrote ${colors.length} colors to ${opts.output}`);
  } else {
    process.stdout.write(output);
  }
}
