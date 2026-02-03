#!/usr/bin/env node

import { Command } from "commander";
import { fetchVariables } from "./api.js";
import { variablesToDTCG } from "./extractor.js";
import { writeTokens, printTokens } from "./writer.js";

const program = new Command();

program
  .name("figma-token-extractor")
  .description("Extract design tokens from Figma and output DTCG JSON")
  .version("0.1.0")
  .requiredOption("--file-id <id>", "Figma file ID")
  .option("--token <token>", "Figma access token (or set FIGMA_ACCESS_TOKEN env var)")
  .option("-o, --output <file>", "Output file path (prints to stdout if omitted)")
  .action(async (opts) => {
    const token = opts.token || process.env.FIGMA_ACCESS_TOKEN;
    if (!token) {
      console.error("Error: Figma access token required. Use --token or set FIGMA_ACCESS_TOKEN env var.");
      process.exit(1);
    }

    try {
      console.log("Fetching variables from Figma...");
      const data = await fetchVariables(opts.fileId, token);

      const tokens = variablesToDTCG(data);
      const tokenCount = countTokens(tokens);

      if (tokenCount === 0) {
        console.log("No variables found in this Figma file.");
        return;
      }

      if (opts.output) {
        writeTokens(tokens, opts.output);
        console.log(`${tokenCount} tokens written to ${opts.output}`);
      } else {
        printTokens(tokens);
      }
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      process.exit(1);
    }
  });

function countTokens(obj: Record<string, unknown>): number {
  let count = 0;
  for (const value of Object.values(obj)) {
    if (typeof value === "object" && value !== null) {
      if ("$value" in value) count++;
      else count += countTokens(value as Record<string, unknown>);
    }
  }
  return count;
}

program.parse();
