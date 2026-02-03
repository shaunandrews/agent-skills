# Components

HTML/CSS component snippets extracted from `@wordpress/components`.

## Source

Styles are converted from the Gutenberg source:

[github.com/WordPress/gutenberg/tree/trunk/packages/components/src](https://github.com/WordPress/gutenberg/tree/trunk/packages/components/src)

SCSS is converted to plain CSS using our design tokens.

## Available Components

| Component | File | Description |
|-----------|------|-------------|
| Button | `button.html` | All button variants (primary, secondary, tertiary, icon, etc.) |
| Input | `input.html` | Text inputs, textareas, with labels and prefixes/suffixes |
| Checkbox | `checkbox.html` | Checkboxes, toggles, radio buttons |
| Select | `select.html` | Native selects, styled dropdowns |
| Panel | `panel.html` | Collapsible panel sections for sidebars |
| Modal | `modal.html` | Modal dialogs in various sizes |
| Toolbar | `toolbar.html` | Button groups, block toolbar, formatting bar |
| Notice | `notice.html` | Notices (info, success, warning, error) and snackbars |
| Popover | `popover.html` | Popovers, dropdown menus, tooltips |
| Spinner | `spinner.html` | Loading spinners and busy states |
| Tabs | `tabs.html` | Tab panels, horizontal and vertical |
| Card | `card.html` | Card containers with header, body, footer, media |

## Usage

1. Open the component file
2. Copy the `<style>` block into your mockup
3. Copy the HTML example(s) you need
4. Customize content and classes as needed

## Component Structure

Each file contains:

```html
<!--
  Component: Name
  Source: @wordpress/components/src/...
  
  Variants and modifiers listed here
-->

<style>
/* Component CSS */
</style>

<!-- EXAMPLES -->
<markup>...</markup>
```

## CSS Class Conventions

WordPress components follow these naming patterns:

- **Base class:** `.components-{component-name}`
- **Element:** `.components-{component-name}__{element}`
- **Modifier:** `.is-{modifier}` or `.has-{feature}`

Examples:
- `.components-button`
- `.components-button.is-primary`
- `.components-button.has-icon`
- `.components-panel__header`
- `.components-panel__body.is-opened`

## Common Modifiers

| Modifier | Meaning |
|----------|---------|
| `.is-primary` | Primary/accent style |
| `.is-secondary` | Secondary style (outlined) |
| `.is-tertiary` | Tertiary style (minimal) |
| `.is-destructive` | Destructive/danger action |
| `.is-compact` | Compact size (32px) |
| `.is-small` | Small size (24px) |
| `.is-pressed` | Toggled/active state |
| `.is-disabled` | Disabled state |
| `.is-opened` | Expanded/open state |
| `.has-icon` | Contains an icon |
| `.has-text` | Contains text (with icon) |

## Tokens Required

Components use CSS custom properties from `tokens/wordpress-tokens.css`. Include that file before using components:

```html
<link rel="stylesheet" href="tokens/wordpress-tokens.css">
<link rel="stylesheet" href="base.css">
```

## Not Yet Extracted

Components not yet in this library:

- Color Picker
- Range Control (Slider)
- Tree / Navigation
- Date/Time Picker
- Draggable

These can be added as needed. Check the Gutenberg source for reference.
