# ddg-search Skill Plan

*Draft: 2026-02-03*

---

## Overview

A web search skill that scrapes DuckDuckGo's HTML-only interface (`html.duckduckgo.com`) to provide search results without API keys or rate limits.

**Why:**
- Brave Search API has usage limits
- No API key management needed
- Works anywhere with internet access
- DuckDuckGo's lite site is designed for programmatic/text-browser access

---

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Language | Node.js | Better HTML parsing (cheerio), maintainable, ubiquitous |
| Output | JSON (default), plain text (flag) | Structured for agents, readable for humans |
| Integration | Standalone skill | Agent chooses based on context |
| Rate limiting | 1 req/second self-imposed | Be a good citizen |

---

## Script: `ddg-search`

### Usage

```bash
ddg-search "your query here"
ddg-search "your query" --count 5
ddg-search "your query" --region us-en
ddg-search "your query" --text
```

### Options

| Flag | Default | Description |
|------|---------|-------------|
| `--count`, `-n` | 10 | Number of results to return |
| `--region`, `-r` | (none) | Region code (e.g., `us-en`, `uk-en`, `de-de`) |
| `--text`, `-t` | false | Output plain text instead of JSON |
| `--safe` | moderate | Safe search: `off`, `moderate`, `strict` |

### Output (JSON)

```json
{
  "query": "wordpress block development",
  "results": [
    {
      "title": "Block Editor Handbook – WordPress Developer Resources",
      "url": "https://developer.wordpress.org/block-editor/",
      "snippet": "The Block Editor Handbook provides documentation for building blocks..."
    },
    {
      "title": "Creating Your First Block | Block Editor Handbook",
      "url": "https://developer.wordpress.org/block-editor/getting-started/create-block/",
      "snippet": "This tutorial will guide you through creating your first block..."
    }
  ],
  "count": 2
}
```

### Output (Plain Text)

```
Query: wordpress block development

1. Block Editor Handbook – WordPress Developer Resources
   https://developer.wordpress.org/block-editor/
   The Block Editor Handbook provides documentation for building blocks...

2. Creating Your First Block | Block Editor Handbook
   https://developer.wordpress.org/block-editor/getting-started/create-block/
   This tutorial will guide you through creating your first block...
```

---

## Technical Approach

### DuckDuckGo HTML Interface

**URL Pattern:**
```
https://html.duckduckgo.com/html/?q={query}&kl={region}&kp={safesearch}
```

**Parameters:**
- `q` — Search query (URL encoded)
- `kl` — Region/language (e.g., `us-en`, `uk-en`, `wt-wt` for no region)
- `kp` — Safe search: `-2` (off), `-1` (moderate), `1` (strict)

**Response:** Plain HTML with results in a predictable structure (`.result` elements with `.result__title`, `.result__url`, `.result__snippet`).

### Implementation

1. Build URL with query and options
2. Fetch HTML with appropriate headers
3. Parse with cheerio to extract results
4. Format and output

### Headers

```
User-Agent: ddg-search/1.0 (https://github.com/shaunandrews/agent-skills)
Accept: text/html
```

### Dependencies

- `cheerio` — HTML parsing
- `node-fetch` or built-in `fetch` (Node 18+)

Package will be self-contained with bundled deps or use npx-style execution.

---

## Skill Structure

```
skills/ddg-search/
├── SKILL.md              # Agent instructions
├── bin/
│   └── ddg-search        # Executable script
├── package.json          # Dependencies
├── src/
│   └── index.js          # Main logic
└── README.md             # Human documentation
```

### SKILL.md (Draft)

```markdown
# DuckDuckGo Search

Search the web using DuckDuckGo's HTML interface. No API key required.

## When to Use

- Web searches when you want to avoid API rate limits
- Quick lookups that don't need Brave's advanced features
- Any general web search task

## Usage

\`\`\`bash
# Basic search
ddg-search "query"

# Limit results
ddg-search "query" -n 5

# Region-specific
ddg-search "query" -r uk-en

# Plain text output (for reading)
ddg-search "query" --text
\`\`\`

## Notes

- Results are from DuckDuckGo's index (may differ from Google/Brave)
- Rate limited to 1 request/second — don't spam
- No instant answers or rich snippets — just organic results
```

---

## Installation

Two options:

### Option A: Global Install (Recommended)

```bash
cd skills/ddg-search
npm install
npm link
```

Then `ddg-search` is available globally.

### Option B: Direct Execution

```bash
node /path/to/agent-skills/skills/ddg-search/src/index.js "query"
```

---

## Scope for V1

**In scope:**
- Basic web search
- Result count control
- Region filtering
- Safe search
- JSON and text output

**Out of scope (future):**
- Pagination (fetch more results)
- Time filtering (past day/week/month)
- Caching
- Image/video search
- Instant answers

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| HTML structure changes | Medium | Keep parser simple, test regularly |
| DDG blocks scraping | Low | Respectful rate limiting, proper user-agent |
| Results differ from Brave | Expected | Document as a feature, not a bug |

---

## Open Questions

1. Should we add this to the agent's PATH automatically during skill installation?
2. Worth adding a `--verbose` flag for debugging?
3. Cache results locally to reduce requests?

---

## Next Steps

1. [ ] Review and approve plan
2. [ ] Build script with tests
3. [ ] Write SKILL.md
4. [ ] Test with agent
5. [ ] Add to README.md skill list

---

*Ready for review.*
