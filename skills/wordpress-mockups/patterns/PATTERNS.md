# Patterns

Pre-built layout patterns showing how WordPress UIs are actually composed.

## Why Patterns?

Components give you the building blocks. Patterns show you how to assemble them correctly. Without patterns, you have to guess at composition — and you'll get details wrong.

## Available Patterns

| Pattern | File | Description |
|---------|------|-------------|
| Site Editor Header | `site-editor-header.html` | Full header bar for Site Editor |

## Composition Rules

These rules apply across WordPress editor UIs. **Memorize them.**

### Header Toolbar

| Element | Position | Style | Notes |
|---------|----------|-------|-------|
| Site Icon | Far left, flush | 60×60, no radius | Shows site's actual icon, not WP logo |
| Block Inserter (+) | After site icon | **PRIMARY (blue)** | Always blue, always visible |
| Undo/Redo | After inserter | Compact, disabled when unavailable | Gray when disabled |
| List View | After undo/redo | Compact | Opens block list panel |
| Document Bar | Center (absolute) | 450px wide, gray bg | Shows current doc + ⌘K shortcut |
| View Site | Right side | Compact, external link icon | Opens site in new tab |
| Preview | Right side | Compact, desktop icon | Preview dropdown |
| Settings Toggle | Right side | Compact, sidebar icon | Toggles settings panel |
| Save | Right side | **PRIMARY (blue)** | Main save action |
| Options (⋮) | Far right | Compact, vertical dots | More menu |

### Button Styling Rules

1. **Inserter is ALWAYS primary (blue)** — this is the main action
2. **Save is ALWAYS primary (blue)** — the commit action
3. **All other toolbar buttons are default** — no fill, just icon
4. **Disabled buttons use `disabled` attribute** — grayed out automatically
5. **Toggled/active buttons use `.is-pressed`** — inverted colors

### Site Icon

- **Size:** 60×60 (matches header height)
- **Position:** Flush left, no margin before it
- **Border radius:** None (square)
- **Content:** The actual site icon/logo, NOT the WordPress logo
- **Margin after:** 12px (`--wp-grid-unit-15`)

### Document Bar

- **Width:** 450px
- **Height:** 32px (compact)
- **Background:** Gray (`--wp-gray-100`)
- **Hover:** Darker gray (`--wp-gray-200`)
- **Border radius:** 4px (`--wp-radius-medium`)
- **Position:** Absolutely centered in header
- **Contents:** Document icon, title, type label, keyboard shortcut

### Spacing

- **Between toolbar buttons:** 4px (`--wp-grid-unit-05`)
- **After site icon:** 12px (`--wp-grid-unit-15`)
- **Header padding:** 8px right (`--wp-grid-unit-10`), 0 left

## Pattern Structure

Each pattern file contains:

```html
<!--
  Pattern: Name
  Reference: source file it's based on
  
  Description of the layout and key details
-->

<style>
/* Pattern-specific layout CSS */
</style>

<!-- The HTML pattern -->
<header>...</header>
```

## How to Use

1. Find the pattern that matches your mockup type
2. Copy the entire pattern as your starting point
3. Modify content (titles, icons) as needed
4. Add additional components from `components/`

**Start with patterns, customize from there** — don't build headers from scratch.

## Adding New Patterns

When you encounter a WordPress layout that's not here:

1. Find a reference (real WordPress, existing mockup, or screenshot)
2. Document the exact composition
3. Create the pattern file with all CSS and HTML
4. Add composition rules to this document

Patterns should be **complete and correct** — someone copying them should get pixel-perfect results.
