# figma-token-extractor

Extract design tokens from a Figma file via the REST API and output them in DTCG JSON format (W3C standard).

> **Important:** This tool uses the Figma Variables REST API (`/v1/files/:id/variables/local`), which is only available on **Enterprise and Enterprise+** plans. For other plans, consider using the Figma Plugin API (`figma.variables.getLocalVariables()`) via a custom plugin.

## Usage

```bash
# Print tokens to stdout
npx figma-token-extractor --file-id YOUR_FILE_ID --token YOUR_FIGMA_TOKEN

# Write to file
npx figma-token-extractor --file-id YOUR_FILE_ID --token YOUR_FIGMA_TOKEN -o tokens.json

# Using an environment variable for the token
export FIGMA_ACCESS_TOKEN=your_token_here
npx figma-token-extractor --file-id YOUR_FILE_ID -o tokens.json
```

## What It Extracts

| Figma Variable Type | DTCG Token Type |
|---|---|
| Color | `color` (`#hex`) |
| Number (Float) | `dimension` (`Npx`) |
| String | `fontFamily` |

## Output Format (DTCG)

```json
{
  "color": {
    "primary": { "$value": "#3B82F6", "$type": "color" },
    "secondary": { "$value": "#6366F1", "$type": "color" }
  },
  "spacing": {
    "sm": { "$value": "8px", "$type": "dimension" },
    "md": { "$value": "16px", "$type": "dimension" }
  },
  "typography": {
    "heading": {
      "font-family": { "$value": "Inter", "$type": "fontFamily" }
    }
  }
}
```

## Getting Your Figma Token

1. Go to Figma → Settings → Personal access tokens
2. Generate a new token
3. Pass it via `--token` or set the `FIGMA_ACCESS_TOKEN` environment variable

## Getting the File ID

From your Figma URL: `https://www.figma.com/file/ABC123/...` → the file ID is `ABC123`

## License

MIT
