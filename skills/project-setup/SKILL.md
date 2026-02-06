---
name: project-setup
description: Set up a new project with standard structure, git, README, CLAUDE.md, and dev server config. Use when starting a new project or bootstrapping a workspace for a new initiative.
---

# Project Setup Skill

Use this skill when creating a new project. It establishes a consistent structure across all projects.

## When to Use

- Starting a new project
- User asks to "set up a project" or "create a new project"
- Bootstrapping a workspace for a new initiative

## Project Location

All projects live in: `~/Developer/Projects/{project-name}/`

Use kebab-case for project names (e.g., `site-editor-navigation`, `wp-cowork-plugin`).

## Standard Structure

```
{project-name}/
├── .git/                 # Initialized git repo
├── .gitignore            # Standard ignores (see below)
├── README.md             # Project overview, quick start
├── CLAUDE.md             # Guidance for Claude Code / AI agents
├── docs/                 # Documentation
│   ├── overview.md       # Project overview (always create this)
│   └── (other docs)
└── logs/                 # Session logs, dev notes (git-ignored)
    └── (daily logs)
```

## File Templates

### README.md

```markdown
# {Project Name}

{One-line description}

## Overview

{Brief explanation of what this project does and why it exists}

## Quick Start

```bash
cd ~/Developer/Projects/{project-name}
# Add setup commands here
```

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/](docs/) | Project documentation |

## Structure

```
{project-name}/
├── docs/          # Documentation
├── logs/          # Development logs (git-ignored)
└── README.md      # This file
```

## Related

- {Links to related issues, PRs, projects}
```

### CLAUDE.md

```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

{One-line description of what this project is and its goal}

## Development

```bash
# Add common commands here
```

## Architecture

{Brief description of tech stack, key patterns, important files}

## Documentation

The `/docs/` folder contains:
- {List key docs}

## Scope

- **In scope**: {What this project covers}
- **Out of scope**: {What it doesn't cover}
```

### docs/overview.md

Always create this file. It's the canonical project overview document — the first thing someone reads to understand the project.

```markdown
# {Project Name} — Overview

## What Is This?

{2-3 paragraphs explaining what the project does, why it exists, and how it works}

## Architecture

{How the project is structured — tech stack, key patterns, data flow}

## Links

- **Repo:** {URL}
- **P2/Discussion:** {URL if applicable}
- **Related:** {Other relevant links}

## Key People

- **{Name}** — {Role/context}

## What's Next

{Current focus, open questions, next steps}
```

**Required sections:** What Is This, Links. Other sections should be included when the information is available. Always capture links — they go stale fast and are hard to recover later.

### .gitignore

```gitignore
# Logs - development session logs, not for version control
logs/

# Dependencies
node_modules/
vendor/
.venv/
__pycache__/

# Build outputs
dist/
build/
*.egg-info/

# Environment
.env
.env.local
.env*.local

# IDE / Editor
.idea/
.vscode/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Package manager locks (uncomment if not needed)
# package-lock.json
# pnpm-lock.yaml
# composer.lock
```

## Setup Procedure

1. **Create project directory**
   ```bash
   mkdir -p ~/Developer/Projects/{project-name}
   cd ~/Developer/Projects/{project-name}
   ```

2. **Create folder structure**
   ```bash
   mkdir -p docs logs
   ```

3. **Create .gitignore** (use template above)

4. **Create README.md** (use template above, fill in project details)

5. **Create CLAUDE.md** (use template above, fill in project details)

6. **Create docs/overview.md** (use template above — always include What Is This and Links sections at minimum)

7. **Initialize git**
   ```bash
   git init
   git add -A
   git commit -m "Initial project setup"
   ```

8. **Report to user**
   - Confirm project location
   - List created files
   - Suggest next steps (e.g., "Ready for docs, or should I scaffold something specific?")

## Optional Additions

Depending on project type, may also create:

- **package.json** — For Node.js projects
- **requirements.txt** — For Python projects
- **composer.json** — For PHP projects
- **Makefile** — For projects with build steps
- **docker-compose.yml** — For containerized projects

Ask the user if they want any of these, or infer from context.

## Dev Server Projects

For projects with a dev server (Vite, webpack, Next.js, etc.):

### 1. Reserve a Port

Use portkeeper to avoid conflicts:
```bash
portman reserve {PORT} --name "{project-name}" --desc "{description}" --tags {tags}
```

### 2. Configure Network Access

Always expose dev servers on the local network so they're accessible from phones/tablets.

**Vite (vite.config.js):**
```js
export default defineConfig({
  server: {
    port: {PORT},
    host: true,  // Expose on local network
  },
})
```

**Next.js (package.json):**
```json
"scripts": {
  "dev": "next dev -p {PORT} -H 0.0.0.0"
}
```

**Webpack (webpack.config.js):**
```js
devServer: {
  port: {PORT},
  host: '0.0.0.0',
}
```

**Generic Node/Express:**
```js
app.listen(PORT, '0.0.0.0', () => { ... })
```

### 3. Document Access

In README.md, include:
```markdown
## Development

Dev server: http://localhost:{PORT}
Network: http://{machine-ip}:{PORT} (for mobile testing)
```

The network IP can be found with `ipconfig getifaddr en0` (macOS).

## Logs Convention

The `logs/` folder is for development session notes:
- Format: `MM-DD-YYYY-HHMM.md` (e.g., `02-06-2026-1015.md`)
- Git-ignored so they don't clutter history
- Useful for tracking decisions, debugging sessions, progress
- **Create an initial log entry during project setup**

### Sample Log (logs/MM-DD-YYYY-HHMM.md)

```markdown
# {MM-DD-YYYY} {HH:MM}

## Session Focus

{What was worked on this session — one line}

## Notes

- {Key decisions, observations, or context}
- {Things tried, what worked, what didn't}

## Changes

- {Files created/modified}
- {Features added or bugs fixed}

## Next

- {What to pick up next time}
- {Open questions or blockers}
```

## After Setup

Once project is created:
1. Update Moneypenny (`~/Developer/Projects/moneypenny/projects.json`) if it's a tracked project
2. Add to memory if significant
3. Proceed with project-specific work
