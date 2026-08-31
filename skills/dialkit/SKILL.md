---
name: "dialkit"
description: "Integrate DialKit for live UI parameter and motion tuning."
---

# DialKit Live Tuning

## Procedure

1. Inspect the target before installing anything.
   - Confirm the project uses React 18+, Solid 1.6+, Svelte 5.8+, or Vue 3.3+.
   - Identify its package manager, development command, styling conventions, existing debug tooling, and whether Motion is already installed.
   - Prefer an existing project tuning panel when it already provides the requested capability.
   - Complete when the framework entry point, install command, preview command, and values to tune are known.

2. Install DialKit for the target framework.
   - Add `dialkit` and its required Motion peer with the project's package manager.
   - Import `dialkit/styles.css`.
   - Mount one `DialRoot` at the application or preview root.
   - Use `dialkit` for React, `dialkit/solid` for Solid, `dialkit/svelte` for Svelte, and `dialkit/vue` for Vue.
   - Keep the default production protection. Do not enable `productionEnabled` unless the user explicitly requests a production-visible panel.
   - Complete when the development build renders one DialKit panel and the ordinary application still runs.

3. Model the design question as a small control schema.
   - Expose only values that help answer the current question.
   - Use explicit numeric ranges when the meaningful bounds are known; use bare numbers only when DialKit's inferred range is appropriate.
   - Use booleans for states, select controls for named alternatives, hex colors for color pickers, nested objects for related controls, and spring or easing controls for motion.
   - Name groups and controls in product language rather than implementation jargon.
   - Use action controls only for safe, repeatable preview actions such as replay or reset.
   - Keep application data, accounts, backend state, and production configuration outside the panel.
   - Complete when each control maps directly to a rendered property or repeatable preview state.

4. Wire controls without changing the product contract.
   - Keep DialKit registration in a clearly named development helper or adjacent preview component.
   - Apply returned values to the real rendered UI immediately.
   - Preserve the component's exports, props, data flow, accessibility semantics, responsive behavior, and reduced-motion behavior.
   - Use `id` only when multiple mounts must share one logical panel.
   - Leave persistence disabled unless the user asks for values to survive reloads; when requested, choose localStorage or sessionStorage deliberately.
   - Complete when changing every control produces the intended visible effect and removing the helper restores the original runtime path.

5. Support a useful comparison loop.
   - Add named presets only when the user needs to compare meaningful states.
   - Use DialKit's JSON copy as a handoff snapshot, not as the final source of truth.
   - For motion work, provide a repeatable trigger and tune the spring, easing, duration, and affected values together.
   - For structural alternatives with different markup or hierarchy, use a variation workflow instead of forcing the choice into continuous controls.
   - Complete when the user can compare the relevant states without editing source or reconstructing values.

6. Bake the decision into source.
   - Record the selected values.
   - Replace temporary DialKit-driven values with ordinary project constants, tokens, styles, or component defaults.
   - Remove the DialKit hook, root, style import, and dependency when the project does not intend to keep development tooling.
   - Preserve DialKit only when the user explicitly wants an ongoing development panel.
   - Complete when the chosen design works without the temporary control path.

7. Verify and hand off.
   - Run the focused typecheck, lint, tests, and build appropriate to the changed surface.
   - Confirm the production build does not expose the panel.
   - Report the preview URL, controls, selected values, files changed, whether DialKit remains installed, and any cleanup still requested.
   - Complete when the user can reproduce the tuned result from the checked source alone.

## Boundaries

Use this skill for DialKit integration or complex continuous tuning in supported JavaScript frameworks. Use a lightweight temporary panel for a few simple values or unsupported stacks. Use a variation workflow for multiple structurally different design directions.
