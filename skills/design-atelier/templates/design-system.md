# {Prompt Name} — Design System Brief

## Concept

{2-3 sentences: mood, reference points, brand name. What should this feel like?}

**Mood:** {One-line mood description}
**Brand name:** {BRAND NAME}

---

## Palette

{⚠️ Check your references before choosing. Default to WHITE backgrounds unless the brief explicitly demands dark.}

```css
:root {
  /* Backgrounds */
  --white:       #ffffff;    /* Primary background */
  --off-white:   #f8f6f2;   /* Alternate sections */
  --cream:       #f0ece4;   /* Card backgrounds */

  /* Text */
  --black:       #1a1a1a;   /* Primary text */
  --dark-gray:   #3a3a38;   /* Secondary text */
  --mid-gray:    #888880;   /* Muted text, metadata */
  --light-gray:  #d4d0c8;   /* Borders, dividers */

  /* Accents */
  --accent:      #000000;   /* Primary accent — replace with actual color */
  --accent-dim:  #000000;   /* Secondary accent */
  --accent-bright: #000000; /* Highlight state */
}
```

**Rule:** {How should the accent color be used? Sparingly? Boldly? Where specifically?}

---

## Typography

**Google Fonts to load:**
```html
<link href="https://fonts.googleapis.com/css2?family={Font1}:wght@300;400;600;700&family={Font2}:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
```

| Role | Font | Weight | Style |
|------|------|--------|-------|
| **Display / H1** | {Font} | {Weight} | {ALL-CAPS? Letter-spacing? Color?} |
| **H2 / Section titles** | {Font} | {Weight} | {Style notes} |
| **H3 / Card titles** | {Font} | {Weight} | {Style notes} |
| **Body text** | {Font} | {Weight} | {Size/line-height, color} |
| **Technical details** | {Font} | {Weight} | {When to use, color} |
| **Navigation** | {Font} | {Weight} | {Style notes} |
| **Buttons / CTAs** | {Font} | {Weight} | {Style notes} |

---

## Grid & Layout

- **Max content width:** {width}px, centered
- **Base unit:** 8px (all spacing in multiples of 8)
- **Section padding:** {value}px vertical minimum
- **Column grid:** {columns} columns, {gutter}px gutter
- **Layout notes:** {Symmetry? Asymmetry? Off-grid elements?}

---

## Pattern System (CSS)

{Define 2-5 CSS patterns derived from the design movement/aesthetic. Each needs a code snippet and "Use for" note.}

### 1. {Pattern Name}
```css
.pattern-{name} {
  /* CSS here */
}
```
**Use for:** {Where this pattern appears}

### 2. {Pattern Name}
```css
.pattern-{name} {
  /* CSS here */
}
```
**Use for:** {Where this pattern appears}

---

## Component Vocabulary

### Navigation
{Describe: background, text style, hover state, active state, fixed/static, border}

### Hero Section
{Describe: background, typography scale, decorative elements, CTA, spacing}

### Cards
{Describe: background, borders/frames, content layout, hover state}

### Buttons
- **Primary:** {background, text, style}
- **Secondary:** {background, text, style}
- **Hover:** {behavior}

### Section Dividers
{Describe: decorative elements between sections}

### Footer
{Describe: background, layout, typography, transition from main content}

---

## Provocative Design Moves

{List 5-7 specific design choices that make this feel hand-crafted and un-AI-generated:}

1. {Move 1}
2. {Move 2}
3. {Move 3}
4. {Move 4}
5. {Move 5}

---

## Page Assignments

### Page 1: {Name}
{Brief description of content and any page-specific design notes}

### Page 2: {Name}
{Brief description}

{Continue for all pages}

---

## Technical Rules

- Self-contained HTML files with embedded `<style>` blocks
- Link to shared Google Fonts via CDN
- No JavaScript required (CSS-only interactions: hover, focus)
- No external images — use CSS patterns, gradients, and SVG for all visual elements
- Desktop-first with responsive breakpoints
- Each file viewable standalone
