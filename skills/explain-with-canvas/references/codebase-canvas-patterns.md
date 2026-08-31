# Codebase Canvas Patterns

Use the smallest pattern that explains the project clearly.

## Small App

Use for prototypes, vibe-coded apps, plugins, themes, and single-package tools.

- Overview section.
- Screens/routes section.
- Components or modules section.
- Data/API flow section.
- Design system section if tokens, theme files, or CSS architecture matter.

Good output: 8-16 nodes, one or two flows, direct file provenance.

## Medium Product

Use for desktop apps, monorepos, apps with CLI plus UI, or product surfaces with sync/auth/runtime layers.

- Product shell section.
- Runtime architecture section.
- Feature flows section.
- Shared packages/tools section.
- Risks/questions section.

Good output: 16-32 nodes, sections by responsibility, explicit boundaries between app packages.

## Large Repository

Use for WordPress-scale or framework-scale projects.

- Start with a high-level map only.
- Create one section per major subsystem.
- Prefer follow-up focused canvases over hundreds of nodes.
- Use dependency/symbol summaries and top directories. Do not paste large files.

Good output: a navigable starting map and clear next scans.

## PR Review

Use when the target is a diff or branch.

- Changed files section.
- Behavioral flow section.
- Test coverage section.
- Risks and review findings section.

Good output: every finding has file provenance and a short impact statement.

## UI Design System

Use when the repo has `DESIGN.md`, DTCG tokens, `theme.json`, CSS custom properties, or component specs.

- Token source section.
- Components section.
- Preview screens section.
- Gaps/questions section.

Good output: token groups, components, and live preview nodes are visually adjacent.
