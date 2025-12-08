import { writeFileSync } from "node:fs";
import { Command } from "commander";
import { getFile, getStyles, getVariables } from "./api.js";
import { dumpJson } from "./dump.js";
import { extractFillColors } from "./styles.js";
import { rgbToHex } from "./color.js";
import { colorsToDTCG } from "./dtcg.js";
import { variablesToDTCG, type FigmaVariablesPayload } from "./variables.js";

export interface CliOptions {
  fileId?: string;
  token?: string;
  raw?: boolean;
  output?: string;
  format?: "tsv" | "dtcg";
  source?: "styles" | "variables";
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
    .option(
      "--source <src>",
      "where to read tokens from: styles or variables (Enterprise)",
      "styles"
    )
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

  if (opts.raw) {
    const file = await getFile(opts.fileId, token);
    dumpJson(file, "figma-file.json");
    const styles = await getStyles(opts.fileId, token);
    dumpJson(styles, "figma-styles.json");
    console.log("wrote figma-file.json and figma-styles.json");
    return;
  }

  const source = opts.source ?? "styles";
  let payload: string;

  if (source === "variables") {
    const vars = (await getVariables(opts.fileId, token)) as FigmaVariablesPayload;
    const dtcg = variablesToDTCG(vars);
    payload = JSON.stringify(dtcg, null, 2) + "\n";
  } else {
    const file = (await getFile(opts.fileId, token)) as Parameters<typeof extractFillColors>[0];
    const colors = extractFillColors(file);
    payload =
      opts.format === "dtcg"
        ? JSON.stringify(colorsToDTCG(colors), null, 2) + "\n"
        : colors.map((c) => `${c.name}\t${rgbToHex(c.r, c.g, c.b, c.a)}`).join("\n") + "\n";
  }

  if (opts.output) {
    writeFileSync(opts.output, payload, "utf8");
    console.log(`wrote ${opts.output}`);
  } else {
    process.stdout.write(payload);
  }
}
