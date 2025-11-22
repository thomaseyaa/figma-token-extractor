import { buildProgram } from "./cli.js";

buildProgram()
  .parseAsync()
  .catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`figma-token-extractor: ${msg}`);
    process.exit(1);
  });
