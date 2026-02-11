# Agent Skills

Custom skills for AI coding agents (Claude Code, Codex, Cursor, etc.).

## Skills

| Skill | Description |
|-------|-------------|
| [blogger](skills/blogger/) | Write, edit, and publish blog posts with style guides and SEO |
| [ddg-search](skills/ddg-search/) | Search the web using DuckDuckGo (no API key required) |
| [headless-browser](skills/headless-browser/) | Browse the web invisibly via headless Chromium in Docker |
| [design-mockups](skills/design-mockups/) | Build and present HTML/CSS design mockups with a local preview server |
| [pressable](skills/pressable/) | Manage Pressable WordPress hosting via API |
| [wordpress-mockups](skills/wordpress-mockups/) | WordPress/Gutenberg UI mockups using design tokens, icons, and components |

## Installation

Copy or symlink skills into your agent's skills directory:

```bash
# Example: symlink into your workspace
ln -sf /path/to/agent-skills/skills/design-mockups /path/to/your/skills/
ln -sf /path/to/agent-skills/skills/wordpress-mockups /path/to/your/skills/
ln -sf /path/to/agent-skills/skills/pressable /path/to/your/skills/
```

Each skill contains a `SKILL.md` with instructions the agent reads when the skill is activated.

## License

MIT
