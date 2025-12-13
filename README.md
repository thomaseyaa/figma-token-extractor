# figma-token-extractor

Pulls design tokens out of a Figma file via the REST API. Two sources are
supported:

- `--source styles` (default) — walks the file payload and pulls solid fill
  colours linked to a Figma "Local style". Works on any plan.
- `--source variables` — calls the Figma Variables REST API. Maps each
  variable to a DTCG token. **Only available on Enterprise / Enterprise+
  plans.** Lower plans get a `403`.

Output format is `tsv` (one `name<TAB>#HEX` per line) or `dtcg` (W3C Design
Tokens Community Group JSON).

## Usage

```bash
export FIGMA_ACCESS_TOKEN=figd_xxx

# Default: extract fill colours and print TSV
npm run dev -- --file-id <file-id>

# DTCG output, written to a file
npm run dev -- --file-id <file-id> --format dtcg -o tokens.json

# Use Figma Variables (Enterprise+ only)
npm run dev -- --file-id <file-id> --source variables -o tokens.json

# Dump the raw REST responses for debugging
npm run dev -- --file-id <file-id> --raw
```

## DTCG output

The DTCG output groups tokens by slash-separated names. A variable named
`brand/primary` with value `r:0.2 g:0.4 b:0.8` becomes:

```json
{
  "brand": {
    "primary": { "$value": "#3366CC", "$type": "color" }
  }
}
```

Supported variable types:

| Figma type | DTCG `$type`  | Value shape |
|------------|---------------|-------------|
| COLOR      | `color`       | `#RRGGBB` or `#RRGGBBAA` |
| FLOAT      | `dimension`   | `Npx` |
| STRING     | `string`      | as-is |
| BOOLEAN    | (skipped)     | — |

## Status

POC. The DTCG mapping is incomplete (no aliases, no per-mode resolution, no
typography composite). Issues welcome.
