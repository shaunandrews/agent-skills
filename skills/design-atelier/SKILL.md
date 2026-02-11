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

### Automatic Cleanup

The headless browser automatically removes cookie banners, newsletter popups, GDPR overlays, chat widgets, and other noise before capturing screenshots. It also validates HTTP status codes — 404s, 403s, and server errors are skipped automatically. No extra steps needed.

For image search URLs (Google/Bing Images), set `BROWSE_SKIP_VALIDATE=1` since these can return non-standard status codes.

### What to Capture

For each prompt, gather **30-40 references** across 4 categories. Quality and breadth matter — these references are the foundation that the design system and every mockup will be built from. Weak references = weak output.

---

#### Category 1: Sites (15-20 actual live website screenshots)

This is your most important category. Screenshot **actual live websites** — real sites with real design decisions. These cover style references, industry references, and designer portfolios all in one category.

**⚠️ CRITICAL: Screenshot DESTINATION sites, NOT gallery/aggregator pages.**

Screenshotting Behance search results, Awwwards listing pages, or Dribbble grids gives you the PLATFORM'S UI over and over — not the actual design work. Those platforms are for **discovering** sites, not for screenshotting directly.

**The two-step research process:**

**Step A — Discover site URLs using `web_search`:**
```bash
# Find sites matching the aesthetic
web_search "{aesthetic} website design"
web_search "{design style} portfolio website"
web_search "site:awwwards.com {aesthetic}"  # find NAMED sites on Awwwards

# Find sites in the industry
web_search "best {industry} website design 2025"
web_search "best {industry} websites"
web_search "site:awwwards.com {industry}"

# Find designer/studio portfolios working in the style
web_search "{designer name} portfolio website"
web_search "{design style} design studio website"
```

**Step B — Screenshot the actual sites:**
```bash
{headlessBrowserSkillDir}/scripts/browse.sh screenshot "https://the-actual-site.com" /path/to/references/site-01-name.jpg
```

**Example workflow:**
1. `web_search "swiss grid typography website design"` → finds links to actual sites
2. `web_search "site:awwwards.com swiss design"` → Awwwards pages NAME the actual sites
3. Extract the actual site URLs from search results
4. Screenshot `https://the-actual-site.com` — NOT `https://awwwards.com/sites/the-actual-site`

**What to cover across your 15-20 site screenshots:**
- 4-6 sites matching the **primary aesthetic** (the design style/movement)
- 3-4 sites matching the **secondary aesthetic** (if the brief names two styles)
- 3-4 sites in the **same industry** (to know what's conventional and what to subvert)
- 2-3 **designer/studio portfolios** working in the style (their own sites, not Behance profiles)
- 1-2 sites showing the **intersection** of the aesthetics (if they exist)

**If a site fails (blocks headless, times out):**
- Find another from your search results — don't skip the slot
- Some well-known sites that DO work headless: Stripe, Linear, Notion, Vercel, Apple, Aesop, Kinfolk
- `web_search` for 2-3 more alternatives

**Sites known to FAIL in headless browser (avoid):**
- ❌ Cargo (`cargo.site`) — times out
- ❌ Pinterest — login wall
- ❌ ReadyMag — times out
- ❌ LandBook — times out
- ❌ Bang Bang NYC (`bangbangnyc.com`) — doesn't load
- ❌ SiteInspire — images break
- ❌ Godly — newsletter overlay
- ❌ DarkModeDesign — renders blank

**File naming:** `site-01-sitename.jpg`, `site-02-sitename.jpg`, etc.

---

#### Category 2: Typography (3-5)

Screenshot type specimen sites and typography archives. These ARE the content — OK to screenshot directly.

```bash
# Typographic Posters — richest visual density (50+ posters per screenshot)
https://www.typographicposters.com/

# Fonts in Use — real-world typography in context
https://fontsinuse.com/in/2/formats/1/web

# Typewolf — curated typography showcase
https://typewolf.com/

# Typography.com — professional specimens
https://www.typography.com/
```

Also use `web_search` to find specific type specimens relevant to the brief's typographic direction, and screenshot those pages.

**File naming:** `type-01-source.jpg`, `type-02-source.jpg`, etc.

---

#### Category 3: Color & Pattern (2-4)

Screenshot palette tools and pattern libraries. These are content pages — OK to screenshot directly.

```bash
# Color Hunt — palette grid with style categories
https://colorhunt.co/palettes/{style}
# Styles: pastel, vintage, retro, neon, gold, light, dark, warm, cold

# Coolors — palette generator
https://coolors.co/

# Hero Patterns — SVG pattern library
https://heropatterns.com/
```

For specific textures or patterns referenced in the brief, use `web_search` to find relevant examples.

**File naming:** `color-01-source.jpg`, `pattern-01-source.jpg`, etc.

---

#### Category 4: Moodboard Searches (8-12)

Google Images and Bing Images for broad visual surveys. These are supplemental — they cover history, aesthetics, techniques, and everything else in a quick sweep.

```bash
BROWSE_SKIP_VALIDATE=1 {headlessBrowserSkillDir}/scripts/browse.sh screenshot \
  "https://www.google.com/search?q=your+search+terms&tbm=isch" \
  /path/to/references/search-01-google-description.jpg

BROWSE_SKIP_VALIDATE=1 {headlessBrowserSkillDir}/scripts/browse.sh screenshot \
  "https://www.bing.com/images/search?q=your+search+terms" \
  /path/to/references/search-02-bing-description.jpg
```

**Run 8-12 searches covering these angles:**

1. The primary design aesthetic (e.g., `Swiss International Typographic Style poster`)
2. The secondary aesthetic (e.g., `psychedelic gradient art 1960s`)
3. Key designers/artists (e.g., `Müller-Brockmann poster design`)
4. The intersection of aesthetics + industry (e.g., `brutalist tattoo studio branding`)
5. Layout/composition (e.g., `Swiss grid layout website`)
6. Color palettes (e.g., `psychedelic neon color palette`)
7. Textures/patterns from the brief (e.g., `moiré optical illusion pattern`)
8. Typography direction (e.g., `Helvetica modernist poster`)
9. Industry-specific design (e.g., `tattoo studio brand identity modern`)
10. Specific CSS/web techniques (e.g., `CSS gradient text effect psychedelic`)

**Run searches in parallel** (`&` + `wait`) for speed.

**File naming:** `search-01-google-description.jpg`, `search-02-bing-description.jpg`, etc.

---

### Reference Quality Checklist

Before moving to the design system, verify:
- [ ] **30+ total references**
- [ ] **At least 15 are actual live website screenshots** (not gallery UI, not image searches)
- [ ] **No two screenshots show the same platform UI** (no Behance/Awwwards/Dribbble chrome)
- [ ] **Variety** — typography, color, layout, patterns, navigation, hero design, grid systems
- [ ] **Industry context** — you've seen what the conventional version looks like
- [ ] **No broken screenshots** — delete anything under 10KB

### Where to Save

```
prompts/{number}-{prompt-name}/
└── research/
    ├── references/          # Screenshot files (JPG/PNG)
    │   ├── site-01-stripe.jpg
    │   ├── site-02-linear.jpg
    │   ├── type-01-typographic-posters.jpg
    │   ├── color-01-colorhunt-neon.jpg
    │   └── search-01-google-swiss-posters.jpg
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

### Gallery Design Philosophy

The gallery is a **neutral review tool**, not a branded experience. It uses system fonts, neutral grays, and minimal styling so the mockups are the focus. Features:

- **Iframe previews** — Each card shows a live scaled-down preview of the page via a lazy-loaded iframe (`loading="lazy"`, `sandbox="allow-same-origin"`, `pointer-events: none`). No screenshot pipeline needed.
- **Dynamic scaling** — A small JS function scales iframes to fill the card width on load and resize. Never use fixed CSS `transform: scale()` values — they leave gaps when card widths vary.
- **Light/dark mode** — Automatic via `prefers-color-scheme`, plus a manual toggle persisted to localStorage.
- **Research as a grid card** — References pages appear as regular cards with iframe previews, not as separate UI elements.

### Static Export for Sharing

To deploy to Vercel or any static host:

```bash
# With the server running locally:
mkdir -p dist
curl -s http://localhost:PORT > dist/index.html
cp -r prompts dist/prompts
cd dist && vercel --prod --yes
```

The gallery HTML is self-contained — no build tools needed. Just capture the rendered page and copy the prompts folder alongside it.

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
- **The gallery is a neutral review tool.** Keep it minimal — system fonts, no personality. The mockups should be the star, not the gallery chrome. Keep the server running and share the network URL for mobile/remote review.
- **Iframe previews > screenshots.** Lazy-loaded scaled iframes work well for galleries up to ~40 pages. No screenshot pipeline or build step needed. Only consider static screenshots if performance becomes an issue.
- **Deploy static for sharing.** `curl localhost:PORT > dist/index.html` + copy prompts folder. No build tools needed for Vercel/static hosts.

## Related Skills

- **headless-browser** — Used for taking reference screenshots without screen disruption
- **project-setup** — General project scaffolding (design-atelier handles its own setup)
- **skill-creator** — For creating new skills like this one
