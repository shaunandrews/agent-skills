---
name: pr-review-guide
description: Draft, update, or restructure GitHub pull request descriptions into reviewer-friendly guides for large, AI-assisted, proof-of-concept, or hard-to-review PRs. Use when the user asks to update a PR body, preserve screenshots or existing sections, explain what reviewers should focus on, categorize a large diff, document architecture decisions, add safety/testing evidence, or turn "please read this giant diff" into a practical review map.
---

# PR Review Guide

## Purpose

Turn a large or hard-to-review PR into a useful human review artifact. Treat the PR description as the primary guide for reviewer judgment, not as a file-by-file diff summary.

## Workflow

1. Read the current PR body before writing anything.
2. Identify sections that must be preserved, especially screenshots, videos, image links, demo GIFs, and explicit reviewer notes.
3. Validate every new screenshot before uploading it:
   - Reset browser zoom to 100%.
   - Keep the pointer outside the captured surface or use a cursor-free capture.
   - Capture the full relevant UI without accidental cropping.
   - Inspect the saved file at actual size.
   - Use comparable framing for before/after images and confirm they visibly prove the reported problem and fix.
4. Inspect the PR enough to understand the conceptual shape of the change:
   - `gh pr view`
   - `gh pr diff --name-only`
   - local `git diff` or `git log` when the branch is checked out
   - key files only; do not pretend to review every line if the request is description-focused
5. Replace disposable boilerplate with a concise review guide.
6. Preserve protected sections exactly unless the user asks to edit them.
7. If updating GitHub, write the new body to a temp file and use `gh pr edit --body-file`.
8. Re-read the PR body after editing and confirm preserved sections survived and all media renders.

## Recommended Structure

Use this structure as the default for large PRs:

```markdown
## Related issues

## How AI was used in this PR

## Executive summary

## Proposed changes

## Review guide

## Okay to skim

## Diff breakdown

## Screenshots

## Known tradeoffs and follow-ups

## Safety checklist

## Testing instructions

## Pre-merge checklist
```

Adapt the headings to the repository's PR template. Preserve required template headings when the repo has them.

## Writing Rules

- Write for reviewers who cannot spend a week reading the diff.
- Make reviewer asks concrete: ask reviewers to validate decisions, architecture, API compatibility, migrations, safety, UX, and rollback strategy.
- Separate human-judgment areas from mechanical or generated changes.
- Call out what to skim, what to ignore, and what needs careful review.
- Keep implementation file lists short and purposeful; the diff already shows every file.
- Prefer "what changed and why" over "how the code is written."
- Be explicit about known risks, user-facing behavior changes, follow-up issues, and testing evidence.
- Do not remove screenshots, videos, or demo links unless the user explicitly asks.

## Safety Checklist Items

Include relevant checked or unchecked items for:

- Feature flags or gating
- Rollback plan
- Data migrations or persistence changes
- API compatibility
- Default UI / existing user flow impact
- Performance
- Security and privacy
- Tests or manual verification
- Follow-up issues for non-blocking gaps

## GitHub Editing Pattern

Use a body file to avoid shell quoting problems:

```bash
gh pr view <number> --repo <owner/repo> --json body
# create /tmp/pr-body.md with the revised body
gh pr edit <number> --repo <owner/repo> --body-file /tmp/pr-body.md
gh pr view <number> --repo <owner/repo> --json body
```

After updating, tell the user exactly what changed and whether protected sections were preserved.
