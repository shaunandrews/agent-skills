# Agent Skills

Custom skills for AI coding agents (Claude Code, Codex, Cursor, etc.).

## Skills

| Skill | Description |
|-------|-------------|
| [blogger](skills/blogger/) | Write, edit, and publish blog posts with style guides and SEO |
| [pressable](skills/pressable/) | Manage Pressable WordPress hosting via API |
| [project-setup](skills/project-setup/) | Bootstrap a consistent project workspace |

## Installation

Copy or symlink skills into your agent's skills directory:

```bash
# Example: symlink into your workspace
ln -sf /path/to/agent-skills/skills/blogger /path/to/your/skills/
ln -sf /path/to/agent-skills/skills/pressable /path/to/your/skills/
```

Each skill contains a `SKILL.md` with instructions the agent reads when the skill is activated.

## License

MIT
