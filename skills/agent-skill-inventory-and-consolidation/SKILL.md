---
name: "agent-skill-inventory-and-consolidation"
description: "Audit skills across agent runtimes, resolve canonical copies, and plan safe consolidation without overwriting divergent repositories."
---

# Agent Skill Inventory and Consolidation

## Procedure

1. Anchor the audit on every exact skill path or name the requester supplied. Inspect that target before considering similarly named skills from indexes or other runtimes. Complete when each supplied target is mapped to an observed path and identity.

2. Enumerate each agent runtime’s skill directories, skill configuration entries, workspace-managed skills, and project-local skills. Record whether each entry is a directory, symlink, configured reference, or bundled system/vendor skill. Complete when every runtime has an inventory with source type and location.

3. Resolve every symlink and compare duplicate names by actual content and target, not by basename alone. Keep similarly named skills separate until their procedures prove equivalent. Complete when duplicates, forks, aliases, and unrelated name collisions are labeled.

4. Identify canonical ownership for each personal skill: public shared repository, private shared repository, or project repository. Treat agent-local copies as uncategorized until ownership is evidenced. Complete when each personal skill has one proposed canonical class or an explicit unresolved status.

5. Inspect repository branch, remote, worktree, and deletion state before proposing moves or replacements. Preserve intentional divergence and avoid using a dirty or divergent checkout as a consolidation target without an explicit reconciliation decision. Complete when every proposed canonical repository has a documented safe or blocked state.

6. Cross-check runtime configuration against the filesystem. Flag configured entries with no target, unconfigured local skills, duplicate registrations, and agent-local copies that would drift from a canonical source. Complete when every discrepancy points to both the configuration entry and filesystem evidence.

7. Separate the audit from mutation. Produce a change plan that names the canonical source, intended consumers, proposed symlink or registration changes, retirement candidates, and required verification; do not move or delete skills during the audit unless the requester separately approves execution. Complete when every proposed change is individually reviewable and reversible.

8. Verify consolidation after execution by resolving each consumer’s link or registration back to the intended canonical skill and confirming project-local and vendor/system skills remained in place. Complete when all intended consumers resolve correctly and no protected skill class changed unexpectedly.

## Classification Reference

- **Canonical shared skill:** maintained once and consumed by multiple agents.
- **Agent-local skill:** exists directly under one runtime and may drift.
- **Project-local skill:** belongs with one repository and stays there.
- **Vendor/system skill:** runtime-managed; exclude from personal consolidation.
- **Alias:** different entry that resolves to identical canonical content.
- **Fork:** related content with meaningful procedural differences.
- **Name collision:** similar name but unrelated purpose; keep distinct.
- **Stale registration:** configuration points to no observed skill target.
