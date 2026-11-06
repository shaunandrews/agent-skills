---
name: tweak-controls
description: Add temporary floating, draggable controls for tuning UI values live in a running app. Use when the user asks for tweak controls, a tweaks panel, knobs, temporary controls, or an easy way to try UI states and values without repeatedly editing source.
---

# Tweak Controls

Create a small temporary control panel inside the target app so the user can adjust the requested values while judging the real rendered UI. Keep the product UI itself unchanged apart from responding to the temporary override values.

## Interpret the request

- Treat phrases such as “I need tweaks for this,” “give me tweak controls,” or “add some knobs” as a request for this panel.
- Infer the useful controls from the current UI change and conversation. Prefer implementing obvious controls immediately over asking the user to enumerate them.
- Expose the smallest set that makes the design decision easy: exact numeric/text/color inputs where precision matters, a few named presets for important states, and a reset to the real value.
- Use local component state and persist the panel's local UI state in a namespaced browser-storage record so it survives reloads. Never write tweak values to the backend, account, or production data.

## Standard panel

Keep the panel consistent across tasks:

- Float above the app with `position: fixed`, a high stacking order, and an initial offset of about 16 px from the top/start edge.
- Use a compact width around 220–280 px. Default to a dark, semi-transparent frosted surface with `backdrop-filter`, dark controls, clear contrast, a subtle border/elevation, and the app’s existing design tokens. Include an opaque dark fallback when backdrop filtering is unavailable.
- Keep controls small, simple, and out of the way of the work being judged. Prefer short labels, compact radio-button grids for a handful of scenarios or variations, and one clear primary control group over a large settings dashboard. Do not let the panel cover the key UI at common viewport sizes.
- Put a short contextual title in a dedicated drag handle. Use pointer capture so dragging continues smoothly outside the handle; clamp the panel so its top/start position cannot become negative.
- Make the panel collapsible to a compact title bar, with a keyboard-accessible expand/collapse button whose expanded state is announced. Keep the drag handle usable in both states and do not start a drag when the toggle is clicked.
- Show named presets as a compact radio list or grid of small buttons in the panel’s primary view. Presets are state shortcuts, not claims about an exact scale unless the product truly has one.
- Put granular fields and secondary controls behind a single keyboard-accessible **Advanced** disclosure. Keep the primary view limited to the title, presets, reset, and that disclosure.
- Stack labeled controls with predictable spacing. Keep buttons and inputs keyboard accessible, and ensure the dark treatment reaches native and design-system inputs rather than styling only the panel shell.
- Apply changes immediately to the actual UI. Do not add an Apply button unless live updating would be unsafe or expensive.
- Include a Reset control when the panel overrides real application data.
- Persist the panel position, collapsed state, Advanced disclosure state, active preset, and current control values in a task-specific `localStorage` key. Restore them safely, clamp a restored position to the current viewport, tolerate missing or malformed storage, and do not persist secrets or sensitive account data.
- Keep the implementation isolated in a clearly named temporary component and adjacent styles so it can be removed cleanly.

Adapt the implementation to the project’s framework and conventions rather than adding a new UI dependency. Reuse an existing debug-panel pattern when the project already has one.

## Temporary activation

The panel is a development aid, not a product feature.

- Choose the simplest activation that works in the user’s actual test build: an existing development flag, a local-only/query-parameter gate, or a temporary unconditional render in the working branch.
- Do not commit or push the panel unless the user explicitly asks. Keep it as an uncommitted testing aid by default, separate from the intended product diff.
- Do not let the panel alter production behavior when it is disabled or removed.

## Handoff

- Run focused tests, typechecking, linting, and the build needed for the preview.
- Launch the preview and leave its processes and any existing browser tab intact.
- Tell the user the exact URL, what each control changes, the preset values, and whether the tweak panel remains uncommitted.
- Do not control, click, navigate, reload, inspect, or capture the browser unless the user explicitly asks for browser-based verification.
- After the user settles on values, apply the selected values to the real implementation and remove the temporary panel before committing unless they request otherwise.
