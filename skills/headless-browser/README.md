# Headless Browser

Browse the web invisibly using a headless Chromium in Docker. Take screenshots, extract rendered content, and generate PDFs — all without interrupting the user's screen.

## What It Does

Runs [Browserless](https://github.com/browserless/browserless) (open source, self-hosted) in a Docker container. Agents interact with it via REST API — no visible browser windows, no focus stealing.

## Requirements

- **Docker** — installed and running
- **macOS** (Apple Silicon) or Linux (ARM64/AMD64)
- **curl** and **jq**

## Quick Start

```bash
# Start the headless browser
./scripts/ensure-running.sh

# Take a screenshot
./scripts/browse.sh screenshot "https://example.com"

# Get rendered HTML content
./scripts/browse.sh content "https://example.com"

# Generate a PDF
./scripts/browse.sh pdf "https://example.com"
```

## Security

All text content returned by `browse.sh` is wrapped in security boundaries (`<<<EXTERNAL_UNTRUSTED_CONTENT>>>`) to prevent prompt injection attacks from web page content. This matches the pattern used by `ddg-search` and OpenClaw's built-in `web_fetch`.

Screenshots are binary and can't be wrapped, but the SKILL.md instructs agents to treat all rendered content as untrusted.

## Architecture

```
Agent → browse.sh → curl → Browserless (Docker :3333) → Chromium → Web
                                  ↓
                          Screenshot/HTML/PDF
                                  ↓
                    Security-wrapped response → Agent
```

## Configuration

| Env Variable | Default | Description |
|---|---|---|
| `BROWSERLESS_PORT` | `3333` | Host port |
| `BROWSERLESS_TOKEN` | `openclaw` | Auth token |
| `BROWSERLESS_CONTAINER` | `openclaw-browser` | Container name |
| `BROWSERLESS_CONCURRENT` | `10` | Max concurrent sessions |

## License

MIT
