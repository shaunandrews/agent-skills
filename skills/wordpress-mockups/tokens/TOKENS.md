# Design Tokens

This document explains where the design tokens come from and the logic behind their extraction.

## Source

All tokens are extracted from the Gutenberg repository:

[github.com/WordPress/gutenberg/tree/trunk/packages/base-styles](https://github.com/WordPress/gutenberg/tree/trunk/packages/base-styles)

This is the canonical source for WordPress/Gutenberg design values. The `base-styles` package provides SCSS variables used across all Gutenberg components.

## Source Files

| File | Contents |
|------|----------|
| `_colors.scss` | Gray scale, alert colors, opacity values |
| `_variables.scss` | Typography, spacing, radii, elevation, dimensions |
| `_breakpoints.scss` | Responsive breakpoint values |
| `_z-index.scss` | Z-index layering system |
| `_animations.scss` | Animation timing and easing |
| `_default-custom-properties.scss` | Default CSS custom properties |
| `_mixins.scss` | Contains admin theme color definitions |

## Extraction Logic

### Colors

Directly mapped from SCSS variables to CSS custom properties:

```scss
// Source (_colors.scss)
$gray-900: #1e1e1e;
$gray-700: #757575;
```

```css
/* Output (wordpress-tokens.css) */
--wp-gray-900: #1e1e1e;
--wp-gray-700: #757575;
```

Comments from the source are preserved where they provide useful context (e.g., contrast ratios).

### Admin Theme Color

Gutenberg supports multiple admin color schemes. The default is `#007cba`, but we use the **blue scheme** (`#3858e9`) because:

1. It's the most common scheme in WordPress.com contexts
2. It provides better visual distinction from the default

The darker variants are calculated as the source does:
- `darker-10`: 5% darker lightness
- `darker-20`: 10% darker lightness

### Typography

Font families are copied exactly. Note that WordPress uses system fonts for performance:

```css
--wp-font-family-default: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...
```

Font sizes use pixel values (not rem) to match WordPress admin UI behavior.

The unusual `--wp-font-weight-medium: 499` ensures browsers fall back to 400 (regular) rather than 600 (semi-bold) on systems without a 500-weight font.

### Spacing (Grid System)

WordPress uses an 8px base grid. All spacing tokens are multiples:

| Token | Multiplier | Value |
|-------|------------|-------|
| `--wp-grid-unit-05` | 0.5× | 4px |
| `--wp-grid-unit-10` | 1× | 8px |
| `--wp-grid-unit-15` | 1.5× | 12px |
| `--wp-grid-unit-20` | 2× | 16px |
| `--wp-grid-unit-30` | 3× | 24px |
| `--wp-grid-unit-40` | 4× | 32px |
| `--wp-grid-unit-50` | 5× | 40px |
| `--wp-grid-unit-60` | 6× | 48px |
| `--wp-grid-unit-70` | 7× | 56px |
| `--wp-grid-unit-80` | 8× | 64px |

Reference: [WordPress Spacing System Proposal](https://make.wordpress.org/design/2019/10/31/proposal-a-consistent-spacing-system-for-wordpress/)

### Border Radius

Semantic scale from smallest (nested elements) to largest (containers):

| Token | Value | Use Case |
|-------|-------|----------|
| `--wp-radius-x-small` | 1px | Buttons nested within inputs |
| `--wp-radius-small` | 2px | Most primitives |
| `--wp-radius-medium` | 4px | Containers with smaller padding |
| `--wp-radius-large` | 8px | Containers with larger padding |
| `--wp-radius-full` | 9999px | Pills |
| `--wp-radius-round` | 50% | Circles and ovals |

### Elevation (Shadows)

Four semantic levels based on the component's role:

| Token | Use Case | Example |
|-------|----------|---------|
| `--wp-elevation-x-small` | Grouped content sections | Preview Frame |
| `--wp-elevation-small` | Non-intrusive feedback | Tooltips, Snackbar |
| `--wp-elevation-medium` | Additional actions | Menus, Command Palette |
| `--wp-elevation-large` | Decisions/interruptions | Modals |

Each shadow is a multi-layer composite for realistic depth.

### Dimensions

Component-specific sizes extracted directly:

- Button sizes: 24px (small), 32px (compact), 36px (default), 40px (next default)
- Header: 64px
- Sidebar: 280px (editor), 300px (nav)
- Modals: 350px (min), 384px (small), 512px (medium), 840px (large)

### Z-Index

Gutenberg's z-index map is extensive (100+ entries). We extract only the commonly-needed values:

| Token | Value | Use Case |
|-------|-------|----------|
| `--wp-z-header` | 30 | Fixed headers |
| `--wp-z-above-content` | 31 | Block popovers, toolbars |
| `--wp-z-sidebar` | 100000 | Sidebars |
| `--wp-z-modal` | 100000 | Modal overlays |
| `--wp-z-snackbar` | 100000 | Toast notifications |
| `--wp-z-popover` | 1000000 | Dropdown menus |
| `--wp-z-tooltip` | 1000002 | Tooltips (above everything) |

The high values (100000+) are intentional — they need to sit above WordPress admin chrome.

### Breakpoints

Standard responsive breakpoints. Note these are stored as CSS custom properties for reference, but you'll typically use them in `@media` queries directly:

```css
@media (max-width: 782px) { /* --wp-break-medium */ }
@media (max-width: 600px) { /* --wp-break-small */ }
```

## What's NOT Included

1. **Component-specific variables** — These live in component files, not base-styles
2. **Block editor styles** — Canvas/content styling (we're doing UI, not blocks)
3. **Dark mode variants** — Not yet extracted (could add later)
4. **Native/mobile values** — React Native specific values omitted

## Keeping Tokens Updated

If Gutenberg updates, re-extract from the same source files. The structure is stable; values occasionally change.

Current source version: Gutenberg trunk as of 2026-02-02.
