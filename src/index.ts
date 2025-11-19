import { buildProgram } from "./cli.js";

buildProgram()
  .parseAsync()
  .catch((err: Error) => {
    console.error(err.message);
    process.exit(1);
  });
