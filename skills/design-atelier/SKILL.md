---
name: design-atelier
description: End-to-end design pipeline from brief to coded prototypes. Gathers visual references, builds design systems, and produces HTML/CSS mockups via parallel sub-agents. Supports multi-prompt projects.
---

# Design Atelier

A complete pipeline from design brief → visual references → design system → coded HTML/CSS prototypes. Handles the full creative process including research, mood boarding, design system creation, and parallel mockup production.

## When to Use

- Designing a website from a creative brief or prompt
- Building coded prototypes (HTML/CSS) for design concepts
- Gathering visual references and creating mood boards
- Producing multiple page mockups in a consistent design language
- Multi-prompt projects where several designs share one gallery

## Prerequisites

- **Node.js** and **npm** (for the gallery server)
- **headless-browser skill** (for taking screenshots without disrupting the user's screen)
- **portman** CLI (for dev server port management)
- Sub-agent spawning capability (for parallel mockup production)

## Workflow Overview

```
Brief → References → Design System → Parallel Mockups → Iterate
```

1. **Check if project exists** — Don't re-scaffold existing projects
2. **Parse the brief** — Extract prompts, page requirements, aesthetic direction
3. **Gather references** — Screenshot inspiration sites, compile mood board
4. **Create design system** — Palette, typography, patterns, components
5. **Spawn mockup agents** — One per page, all sharing the design system
6. **Iterate** — Handle feedback, rebuild affected pages

---

## Step 1: Project Setup

### New Project

If no project exists yet, scaffold it:

```bash
PROJECT_DIR=~/Developer/Projects/{project-name}
mkdir -p "$PROJECT_DIR"/{prompts,docs,logs}
cd "$PROJECT_DIR"
git init
npm init -y
npm install express
```

Copy the gallery server template:
```bash
cp {skillDir}/templates/server.js "$PROJECT_DIR/server.js"
```

Update `package.json`:
```bash
npx -y json -I -f package.json -e 'this.scripts={start:"node server.js"}'
```

Reserve a port:
```bash
portman request 1 --name "{project-name}" --desc "Design atelier server"
```

Update the `PORT` constant in `server.js` with the assigned port.

### Existing Project

If the project already exists:
1. Verify `server.js` is present and working
2. Check which prompts already have folders in `prompts/`
3. Add the new prompt folder: `mkdir -p prompts/{number}-{prompt-name}/{research,mockups}`
4. The gallery server auto-discovers from `prompts/*/mockups/` — no manual index updates needed

---

## Step 2: Save the Brief

Save ALL prompts/briefs to `docs/prompts.md`, not just the one you're working on. Include:
- Source URL or reference
- Full text of each prompt with page requirements
- Who claimed which prompt (if applicable)
- Design guidance and constraints

**Don't half-document.** Save everything upfront. You will need it later.

---

## Step 3: Gather Visual References

Use the **headless-browser skill** for screenshots. This runs in Docker — no windows pop up on the user's screen.

```bash
# Ensure the headless browser is running
{headlessBrowserSkillDir}/scripts/ensure-running.sh

# Take screenshots
{headlessBrowserSkillDir}/scripts/browse.sh screenshot "https://example.com" /path/to/save.jpg
```

### What to Capture

For each prompt, gather **20-30 references** across these categories. **Actual website screenshots should be the MAJORITY** — image searches supplement, not replace, real site references.

#### Category Targets (minimum counts):

1. **Style references (6-10)** — Actual websites matching the target aesthetic. Sources: Cargo templates, Readymag examples, Awwwards, SiteInspire, Brutalist Websites, Httpster, Minimal Gallery, Godly. Search for specific design movements + "website" on these platforms. **If a site fails (HTTP 500), find an alternative — don't skip the category.**
2. **Movement/era references (3-5)** — Art history sources, museum collection pages, design archive sites, portfolio sites of designers working in that movement. Wikipedia/archive.org pages with visual examples.
3. **Industry references (3-5)** — Best-in-class sites in the same business category. Use web_search to find "best [industry] websites" and screenshot the top results. These show conventional patterns you'll either adopt or subvert.
4. **Pattern/texture references (2-3)** — Specific visual patterns, textures, or techniques referenced in the brief. Can be individual site pages or curated galleries.
5. **Image search moodboards (6-10)** — Quick visual surveys via Google and Bing Images. These are supplemental density — they should NOT be the majority of your references.

#### Finding Sites That Work

The headless browser can't reach every site (some block headless Chromium). When screenshots fail:
- **Try alternative URLs.** Cargo has dozens of templates — if one fails, try another.
- **Use web_search** to find 2-3 alternatives in the same aesthetic.
- **Try Awwwards/SiteInspire collection pages** which aggregate many designs in one screenshot.
- **Never settle for <15 total references.** If you're under that, keep searching.

### Site Screenshot Research Process

1. **Use `web_search`** to find actual websites matching the aesthetic, industry, and design movement
2. **Screenshot each site** with the headless browser
3. **Retry failures** — search for alternatives, don't just skip
4. **Aim for variety** — different sites showing different aspects (typography, layout, color, interaction patterns, navigation)

```bash
# Screenshot an actual site
{headlessBrowserSkillDir}/scripts/browse.sh screenshot "https://example.com" /path/to/references/style-01-sitename.jpg

# If it fails, find an alternative
# web_search "brutalist design portfolio website" → try the results
```

### Image Search Moodboards (Supplemental)

Use the headless browser to screenshot **Google Images** and **Bing Images** searches. These provide broad visual density but should supplement — not replace — actual site screenshots. Run 4-8 searches per prompt covering:

- The design movement/aesthetic (e.g., `risograph print design aesthetic`)
- Layout/composition patterns (e.g., `zine culture layout design DIY`)
- The intersection of style + industry (e.g., `risograph yoga poster`)
- Specific techniques referenced in the brief (e.g., `misregistration print effect two color`)
- Color palettes (e.g., `risograph color palette fluorescent ink`)
- Textures and patterns (e.g., `halftone dot pattern risograph texture`)
- Industry-specific print/poster references (e.g., `community yoga studio poster flyer indie`)

```bash
# Google Images
{headlessBrowserSkillDir}/scripts/browse.sh screenshot \
  "https://www.google.com/search?q=your+search+terms&tbm=isch" \
  /path/to/research/references/search-01-google-description.jpg

# Bing Images
{headlessBrowserSkillDir}/scripts/browse.sh screenshot \
  "https://www.bing.com/images/search?q=your+search+terms" \
  /path/to/research/references/search-02-bing-description.jpg
```

**Run these in parallel** (`&` + `wait`) for speed. Name files descriptively: `search-01-google-riso-aesthetic.jpg`, `search-05-bing-zine-collage.jpg`, etc.

Include image searches in the mood board HTML under an "Image Search — Quick Moodboard" section — clearly separated from site screenshots.

### Where to Save

```
prompts/{number}-{prompt-name}/
└── research/
    ├── references/          # Screenshot files (JPG/PNG)
    │   ├── style-01-cargo-template.jpg
    │   ├── movement-01-secession.jpg
    │   └── industry-01-onyx-coffee.jpg
    ├── references.html      # Compiled mood board (use template)
    └── design-direction.md  # Written analysis of references
```

### Compile the Mood Board

Copy and populate the mood board template:
```bash
cp {skillDir}/templates/references.html prompts/{number}-{prompt-name}/research/references.html
```

Edit the HTML to add each reference as a card with:
- Screenshot image (relative path: `references/filename.jpg`)
- Source URL
- Design note — what's relevant (typography, layout, color, pattern, etc.)

Group references by category with section headers.

---

## Step 4: Create the Design System

This is the critical step. The design system brief is the shared context that every mockup agent receives. It must be specific enough to produce consistent results.

Copy and fill in the template:
```bash
cp {skillDir}/templates/design-system.md prompts/{number}-{prompt-name}/design-system.md
```

### Required Sections

**Concept** — 2-3 sentences capturing the mood, the reference points, and the brand name.

**Palette** — Exact CSS custom properties. Include:
- Primary background (usually white — see Palette Rule below)
- Text colors (primary, secondary, muted)
- Accent color(s)
- Border/divider colors

**Typography** — Specific Google Fonts with exact weights. Define roles:
- Display / H1
- Section headings / H2
- Card titles / H3
- Body text
- Technical/metadata text
- Navigation
- Buttons / CTAs

Include the Google Fonts `<link>` tag ready to copy.

**Grid & Layout** — Max width, base unit, section padding, column grid.

**Pattern System** — CSS code for any decorative patterns (gradients, repeating backgrounds, borders, SVG ornaments). Each pattern should have a "Use for" note.

**Component Vocabulary** — How key components look:
- Navigation
- Hero section
- Cards
- Buttons (primary, secondary, accent)
- Section dividers
- Footer

**Provocative Design Moves** — The specific things that make this design feel hand-crafted and un-AI-generated. These are the design decisions that matter most.

**Page Assignments** — Which pages to build, brief description of each, and any page-specific direction.

**Technical Rules** — Self-contained HTML, Google Fonts CDN, CSS-only interactions, no external images, responsive breakpoints.

### ⚠️ Palette Rule

**Default to WHITE backgrounds with bold colored/black geometric forms and accent colors.** Most design movements referenced in creative briefs (Werkstätte, Bauhaus, Secession, minimalism, etc.) use white space as a primary design element. Only go dark if the brief explicitly demands it (e.g., "cyberpunk," "dark mode," "noir").

The most common mistake is defaulting to dark/moody palettes when the reference material is actually white-dominant. **Always check the references before choosing the palette.**

---

## Step 5: Spawn Mockup Agents

⚠️ **CRITICAL: Sub-agents cannot spawn their own sub-agents.** The `sessions_spawn` tool is not available inside sub-agent sessions. This means you CANNOT use a single "orchestrator" agent that does research → design system → spawns mockup agents. That pattern fails silently — the orchestrator will fall back to building pages sequentially, losing the parallelism benefit.

### Correct Orchestration Pattern

The **main session** must be the orchestrator. Run the pipeline in two phases from the main session:

1. **Phase 1: Spawn a research + design system agent** — One sub-agent gathers references, builds the mood board, and writes the design system. Wait for it to complete.
2. **Phase 2: Spawn mockup agents in parallel** — From the main session, spawn one sub-agent per page (or logical group). These run simultaneously.

```
Main Session (you)
  ├── spawn: research + design system agent (wait for completion)
  └── spawn (parallel, after Phase 1 completes):
      ├── home page agent
      ├── shop page agent
      ├── about page agent
      └── ... (one per page)
```

**Never delegate the spawning to a sub-agent.** Always spawn from the main session.

### What Each Mockup Agent Gets

1. The design system brief (tell it to read the file)
2. Page-specific requirements
3. The output file path
4. The palette values repeated explicitly (agents sometimes skip reading files)
5. A reminder that this is a design competition — quality matters

### Agent Brief Template

```
You are building the {PAGE NAME} mockup for {brand name}.

**Output file:** {project}/prompts/{number}-{name}/mockups/{page}.html

**Read the design system brief:**
Read {project}/prompts/{number}-{name}/design-system.md

**Palette (repeated for clarity):**
{list key colors}

**Build these sections:**
{numbered list of sections with specific content}

**Provocative design moves to include:**
{list specific design choices}

**Technical:** Self-contained HTML, embedded CSS, Google Fonts CDN, CSS-only, no JS, no images, responsive.
```

### Spawn in Parallel

Use `sessions_spawn` with labels for tracking:

```
sessions_spawn(task: "...", label: "{project}-{page}")
```

All agents can run simultaneously since they share the design system but write to separate files.

---

## Step 6: Iterate

When feedback comes in:

- **Palette corrections** — Update `design-system.md`, then respawn affected agents with "CRITICAL CORRECTION" in the brief
- **Page splits** — Spawn new agents for the separated pages
- **Content changes** — Respawn only the affected page agent
- **Adding pages** — Spawn a new agent, the gallery auto-discovers the new file
- **Gallery ordering** — Update the `pageOrder` array in `server.js`

### Updating Gallery Page Order

The gallery server has a `pageOrder` array that controls display order:

```javascript
const pageOrder = ['home', 'collection', 'subscriptions', 'faq', 'contact'];
```

Add new page slugs (filename without .html) in the desired order. Unlisted pages appear at the end. Restart the server after changes.

---

## Step 7: Adding a New Prompt to an Existing Project

When adding another design prompt to an existing project:

1. Create the prompt folder:
   ```bash
   mkdir -p prompts/{number}-{new-prompt-name}/{research,mockups}
   ```

2. Gather references (Step 3) — save to the new prompt's `research/` folder

3. Create a design system (Step 4) — each prompt gets its own `design-system.md`

4. Spawn mockup agents (Step 5) — they write to the new prompt's `mockups/` folder

5. The gallery auto-discovers the new prompt section — no server changes needed

6. If the new prompt needs different page ordering, add a per-prompt `pageOrder` in the server (or update the default)

---

## Gallery Server

The included `server.js` template:
- Auto-discovers prompts from `prompts/*/mockups/*.html`
- Shows research/references links when `research/references.html` exists
- Sorts pages by configurable order
- Responsive, clean design
- Shows local and network URLs

### Starting the Server

```bash
cd {project-dir}
npm start
```

### Restarting After Changes

Kill the running server process and restart. The server reads the filesystem on each request, so new mockup files appear automatically — but `server.js` code changes require a restart.

---

## File Structure Reference

```
{project-name}/
├── server.js                           # Gallery server (auto-discovers)
├── package.json
├── README.md
├── docs/
│   ├── overview.md                     # Project overview
│   └── prompts.md                      # All prompts/briefs saved here
├── logs/
│   └── YYYY-MM-DD.md                   # Activity logs
└── prompts/
    ├── 01-hair-salon/
    │   ├── research/
    │   │   ├── references/             # Screenshot files
    │   │   ├── references.html         # Compiled mood board
    │   │   └── design-direction.md     # Written analysis
    │   ├── design-system.md            # Palette, type, patterns, components
    │   └── mockups/
    │       ├── home.html
    │       ├── services.html
    │       └── contact.html
    ├── 08-coffee-roastery/
    │   ├── research/
    │   │   └── ...
    │   ├── design-system.md
    │   └── mockups/
    │       └── ...
    └── {next-prompt}/
        └── ...
```

---

## Tips

- **References before building.** Don't skip the research phase. The mood board informs the design system, which informs the mockups. Skipping steps produces generic output.
- **Design system before mockups.** Don't let sub-agents freelance. The shared brief ensures consistency across pages.
- **Check references for palette.** The #1 mistake is defaulting to dark backgrounds when the reference material is white-dominant.
- **Repeat the palette in agent briefs.** Sub-agents sometimes skip reading files. Put the key colors directly in the spawn task.
- **Always spawn from the main session.** Sub-agents cannot use `sessions_spawn`. Never delegate spawning to a sub-agent — it will silently fall back to sequential work, losing all parallelism. The main session is always the orchestrator.
- **Commit often.** Git track your exploration — each phase gets a commit.
- **Update logs.** Document what was built, what feedback was given, what changed.
- **The gallery is your review tool.** Keep the server running. Share the network URL for mobile/remote review.

## Related Skills

- **headless-browser** — Used for taking reference screenshots without screen disruption
- **project-setup** — General project scaffolding (design-atelier handles its own setup)
- **skill-creator** — For creating new skills like this one
