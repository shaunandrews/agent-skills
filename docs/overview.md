# agent-skills - Project Overview

## What Is This

Custom skills repository for AI agents. A collection of specialized tools and capabilities that can be integrated into various AI agent frameworks.

## Key Details

- **Repository:** https://github.com/shaunandrews/agent-skills
- **Local path:** `~/Developer/Projects/agent-skills/`
- **Workspace symlinks:** Skills are symlinked from this repo into `~/.openclaw/workspace/skills/`
- **Agent-agnostic:** Keep repo free of OpenClaw-specific branding to support multiple agent frameworks

## Skills List

### Active Skills
- **blogger** ✍️ — Blog writing companion with style guides, post analysis, and editing tools
- **design-mockups** 🎨 — Generate design mockups with proper tokens and components
- **wordpress-mockups** 🖼️ — WordPress-specific design system tokens, components, and icons for admin UI mockups
- **pressable** 🚀 — Pressable hosting API integration for site management, backups, and caching

### Work In Progress
- **wpcom** 🌐 — WordPress.com concierge skill (research phase)

## Blogger Skill Details

Built in February 2026 to replace wordpress-writer as a comprehensive writing companion:

### Features
- **Style guide system** — Auto-generates voice.md by analyzing existing blog posts
- **Post analyzer** — Dual mode support:
  - Authenticated: Analyzes raw WordPress blocks
  - Public: Analyzes rendered HTML from public URLs
- **Reference documentation** — Writing guides, editing tips, SEO best practices, headline formulas, fact-checking protocols

### Analysis Results (Shaun's Blog)
- **Reading level:** Grade 6.3
- **Sentence length:** 11.5 words average
- **Writing style:** Heavy first-person, conversational tone

## wpcom Skill Research Status

### Key Findings
- **MCP server available:** `https://public-api.wordpress.com/wpcom/v2/mcp/v1`
- **Authentication:** OAuth2 works well, requires browser redirect
- **API capabilities:** Mostly read-only (posts, stats, settings, users)
- **SSH/WP-CLI:** Available on Business+ plans only

### Critical Limitations
**Cannot programmatically:**
- Create user accounts
- Create new sites
- Purchase plans or domains
- All purchases/provisioning require web checkout

### Documentation
Research files located in `docs/wpcom-research/` (6 comprehensive research documents)

## Workspace Integration

Skills from this repository are symlinked into the OpenClaw workspace at:
`~/.openclaw/workspace/skills/[skill-name]/`

This allows for development in the git repository while making skills available to the agent runtime.

## Links

- **GitHub:** https://github.com/shaunandrews/agent-skills
- **License:** MIT
- **OpenClaw workspace:** `~/.openclaw/workspace/skills/`