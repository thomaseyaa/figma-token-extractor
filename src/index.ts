import { getFile, getStyles } from "./api.js";
import { dumpJson } from "./dump.js";

// Throwaway entry point. Will replace with a proper CLI once the data shape
// stabilises.

async function main(): Promise<void> {
  const fileId = process.argv[2];
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!fileId) {
    console.error("usage: tsx src/index.ts <file-id>");
    process.exit(1);
  }
  if (!token) {
    console.error("FIGMA_ACCESS_TOKEN env var is required");
    process.exit(1);
  }

  const file = await getFile(fileId, token);
  dumpJson(file, "figma-file.json");

  const styles = await getStyles(fileId, token);
  dumpJson(styles, "figma-styles.json");

  console.log("dumped figma-file.json and figma-styles.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
