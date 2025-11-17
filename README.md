# figma-token-extractor

Pulls design tokens out of a Figma file via the REST API. Very rough at this
stage — only solid fill colours are extracted, and the output is just
`name<TAB>#HEX` on stdout.

## Usage

```bash
export FIGMA_ACCESS_TOKEN=figd_xxx
npm run dev -- --file-id <file-id>
```

Or, to inspect the raw API responses:

```bash
npm run dev -- --file-id <file-id> --raw
# writes figma-file.json and figma-styles.json
```

## Status

POC. The data model is going to change.
