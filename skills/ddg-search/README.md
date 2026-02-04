# ddg-search

Search the web using DuckDuckGo's HTML interface. No API key required.

## Installation

```bash
cd skills/ddg-search
npm install
npm link
```

This makes `ddg-search` available globally.

## Usage

```bash
# Basic search
ddg-search "nodejs async await"

# Limit to 5 results
ddg-search "best coffee beans" -n 5

# Region-specific (UK)
ddg-search "football scores" -r uk-en

# Plain text output
ddg-search "react hooks" --text

# Combine options
ddg-search "local restaurants" -n 3 -r us-en --text
```

## Options

- `-n, --count <num>` — Number of results (default: 10)
- `-r, --region <code>` — Region code (e.g., `us-en`, `uk-en`)
- `-s, --safe <level>` — Safe search: `off`, `moderate`, `strict`
- `-t, --text` — Plain text output instead of JSON
- `-h, --help` — Show help

## How It Works

This tool scrapes DuckDuckGo's HTML-only interface (`html.duckduckgo.com`), which is designed for text browsers and low-bandwidth connections. It's lightweight and doesn't require JavaScript.

**Rate limiting:** The script self-limits to 1 request per second to be respectful.

## For AI Agents

See `SKILL.md` for agent-specific instructions.

## License

MIT
