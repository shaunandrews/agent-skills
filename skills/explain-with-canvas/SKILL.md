---
name: explain-with-canvas
description: Use when Codex should explain a codebase, app flow, UI surface, generated artifact set, architecture, route map, or design system visually with Agent Canvas. Triggers include requests like "explain this with canvas", "map this repo", "show the app flows visually", "help me understand this codebase", "visualize this vibe-coded app", or "create an Agent Canvas overview". Requires Agent Canvas MCP or CLI access; use read-only scanning unless the user explicitly asks to modify the target project.
---

# Explain With Canvas

Use Agent Canvas as a visual explanation surface, not as a decorative diagram. The goal is to leave the user with a canvas that shows what exists, where it lives, how it connects, and what to inspect next.

## Safety First

- Treat the target repository as read-only unless the user explicitly asks for code changes.
- Prefer `agent-canvas scan-repo` or `scripts/safe-repo-scan.mjs` for discovery. These commands read files and write only to an explicit output path.
- If the target repo is actively being edited by other agents, store Agent Canvas state outside that repo with `--workspace /safe/path/.agent-canvas/external/<project>`.
- Check `git status --short` before and after scanning when the user asks to avoid disturbing a repo.
- Do not run install, build, format, migration, or test commands in the target repo during an explanation pass unless the user asks for them.

## Quick Workflow

1. Check canvas access:
   ```bash
   agent-canvas doctor
   ```

2. Scan the target repo read-only:
   ```bash
   agent-canvas scan-repo /path/to/repo --out /tmp/repo-agent-canvas-scan.json --pretty
   ```

3. If a live Agent Canvas is available, generate the canvas:
   ```bash
   agent-canvas explain /path/to/repo --workspace /path/to/workspace/.agent-canvas
   ```

4. If no live canvas is available, prepare operations without posting them:
   ```bash
   agent-canvas explain /path/to/repo --workspace /path/to/workspace/.agent-canvas --dry-run
   ```

5. Inspect the generated canvas and refine with MCP tools:
   - Add focused nodes for unclear flows.
   - Re-layout sections if nodes overlap.
   - Add provenance to new nodes using `metadata.agentCanvas.files`.
   - Avoid focusing every created node unless the user asks to follow the generation.

## Canvas Structure

Create or update stable sections:

- Project overview: purpose, runtime, manifests, commands, current git state.
- Architecture map: major modules and responsibilities.
- Flows: route, screen, API, data, event, or user journeys.
- Source map: top directories, file types, important files.
- Questions: uncertainties, missing context, suggested next probes.

For UI apps, add optional sections when useful:

- Screens and routes.
- Components and design system.
- Data/state flow.
- Build/deploy surface.

## Node Rules

- Use deterministic node IDs based on repo name and topic so reruns update existing nodes.
- Keep summaries short enough to scan. Link detail through provenance, not giant pasted files.
- Use document nodes for synthesized explanations.
- Use website nodes only for actual generated previews or captured app screens.
- Use sections for spatial grouping, not as fake decorative frames.
- Use layout/tidy tools after creating multiple nodes.

## Provenance

Every explanation node should identify where its claim came from. Prefer this metadata shape:

```json
{
  "agentCanvas": {
    "generatedBy": "explain-with-canvas",
    "repoRoot": "/path/to/repo",
    "gitHead": "abc1234",
    "files": ["src/app.ts", "package.json"],
    "readOnly": true
  }
}
```

When the agent is uncertain, say so in the node. A useful visual map is allowed to have open questions; it should not pretend guessed architecture is fact.

## References

- Read `references/codebase-canvas-patterns.md` when deciding what kind of canvas to create for a repo.
- Use `scripts/safe-repo-scan.mjs` when `agent-canvas scan-repo` is not on PATH but this skill is available from the source package.
