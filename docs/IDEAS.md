# Skill Ideas

Future skills we're considering. Contributions welcome!

---

## 🔍 Intelligence Report: emdashcodes/wp-ability-toolkit

*Reviewed: 2026-02-03*
*Source: https://github.com/emdashcodes/wp-ability-toolkit/tree/trunk/claude-code-plugins*

### Summary

Three Claude Code plugins found. Cross-referenced with our existing arsenal.

### 1. wordpress-ability-api (ENHANCEMENT OPPORTUNITY)

**Their approach:** Comprehensive scaffolding workflow with CLI scripts and templates.

**What they have that we don't:**
- `scaffold-ability.php` - Generates complete ability code from CLI args
- `scaffold-category.php` - Generates category registration code
- `validate-ability.php` / `validate-ability.js` - Validates ability code before registration
- `validate-category.php` / `validate-category.js` - Validates category code
- Template files: `server-ability-template.php`, `client-ability-template.js`, `category-template.php`
- Detailed step-by-step workflow with user interaction prompts
- Reference docs (intro, getting-started, registering-abilities, using-abilities, rest-api, hooks, javascript-client, registering-categories)

**Our existing `wp-abilities-api`:** Procedure-focused, integrates with `wp-project-triage`, covers registration and debugging but lacks scaffolding automation.

**Recommendation:** Consider adding scaffold scripts to our skill. The validation tooling would be valuable for catching mistakes before registration.

---

### 2. wordpress-plugin-scaffold (NEW SKILL CANDIDATE)

**What it does:** Dedicated skill for `wp scaffold plugin` and `wp scaffold plugin-tests` WP-CLI commands.

**Key features:**
- Environment detection (WP install vs wp-env)
- Guided metadata gathering (slug, name, description, author)
- Test infrastructure setup with CI provider selection (GitHub Actions, GitLab CI, CircleCI, Bitbucket)
- Post-scaffold actions (activation, test running)

**Gap analysis:**
- Our `wp-plugin-development` covers plugin architecture but not initial scaffolding
- Our `wp-wpcli-and-ops` is ops-focused, not scaffolding-focused

**Recommendation:** Add as new skill. Scaffolding is a distinct workflow that deserves dedicated guidance. Would complement `wp-plugin-development` nicely.

---

### 3. wp-env (NEW SKILL CANDIDATE)

**What it does:** Docker-based local WordPress development with `@wordpress/env`.

**Key features:**
- Zero-config setup for plugins/themes
- Dual environments (dev on 8888, tests on 8889)
- Built-in WP-CLI, Composer, PHPUnit, Xdebug
- `.wp-env.json` configuration patterns
- Troubleshooting for common Docker issues

**Gap analysis:**
- Our `wp-playground` covers Playground (WebAssembly/SQLite, ephemeral, browser-first)
- wp-env is fundamentally different: Docker/MySQL, persistent, better for integration testing
- Different use cases: Playground for quick previews/demos, wp-env for full dev environments

**Recommendation:** Add as new skill. These tools serve different purposes and developers need both. Could add routing logic in `wordpress-router` to help choose between them.

---

### Action Items

1. **wp-abilities-api enhancement:** Add scaffold/validate scripts (port or rewrite)
2. **New skill: wp-plugin-scaffold:** Port/adapt their scaffolding skill
3. **New skill: wp-env:** Port/adapt their wp-env skill
4. **Update wordpress-router:** Add routing for "set up dev environment" → wp-playground vs wp-env decision

---

## UX Copy Improver

Improve UI microcopy using proven UX writing frameworks.

**Inspiration:** [dcode:improve-copy](https://github.com/madebynoam/dcode)

**Frameworks to include:**
- **JTBD (Jobs to Be Done)** — "Submit" → "Get my results"
- **Benefit-first** — "Enable notifications" → "Never miss updates"
- **Error patterns** — "Invalid input" → "Email looks wrong. Try name@example.com"
- **Empty states** — "No results" → "No projects yet. Create one to get started."
- **Loading states** — "Loading..." → "Finding your files..."
- **Confirmation dialogs** — "Are you sure?" → "This will delete all data. Continue?"
- **4 C's checklist** — Clear, Concise, Conversational, Consistent

**Modes:**
- Single string improvement with alternatives
- Interactive audit of a file/component
- Batch audit with table output

---

## Mermaid Diagram to Image

Convert Mermaid diagram syntax to PNG, SVG, or PDF images.

**Inspiration:** [mermaid-diagram-to-image](https://github.com/emdashcodes/claude-code-plugins)

**Use cases:**
- Documentation diagrams
- Architecture visualizations
- Flowcharts for presentations
- Sequence diagrams for API docs

**Requirements:**
- mermaid-cli (`npm install -g @mermaid-js/mermaid-cli`)

---

## Session Reflection

End-of-session guided reflection to capture learnings.

**Inspiration:** [dcode:reflect-session](https://github.com/madebynoam/dcode)

**Captures:**
- What you learned (technical + soft skills)
- What worked well
- What was frustrating
- Searchable record of growth over time

**Output:** Markdown file with structured reflection notes.

---

## Pattern Miner

Analyze productive sessions and suggest reusable patterns worth automating.

**Inspiration:** [dcode:mine-patterns](https://github.com/madebynoam/dcode)

**Use cases:**
- Identify repeated workflows
- Suggest new skills to create
- Surface automation opportunities

---

## Gutenberg Component Finder

Find WordPress/Gutenberg components from screenshots or descriptions.

**Concept:** Combine visual component finding (like dcode:find-component) with WordPress/Gutenberg expertise.

**Use cases:**
- "Where's the code for this block?" (from screenshot)
- "Find the Panel component in Gutenberg"
- "What styles apply to this toolbar?"

**Would leverage:**
- wordpress-mockups skill (tokens, components knowledge)
- Gutenberg source structure familiarity

---

## Google Workspace Integration

Read and work with Google Docs, Sheets, Slides.

**Inspiration:** [google-docs-reader](https://github.com/emdashcodes/claude-code-plugins)

**Approach:** Export via browser download to local formats (DOCX, XLSX, PPTX), then analyze.

**Requirements:**
- Browser with active Google session
- Access to ~/Downloads

---

## Contributing

Have an idea? Open an issue or PR with:
1. Skill name and description
2. Use cases
3. Any inspiration/references
4. Requirements (APIs, tools, etc.)
