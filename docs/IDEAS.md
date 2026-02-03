# Skill Ideas

Future skills we're considering. Contributions welcome!

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
