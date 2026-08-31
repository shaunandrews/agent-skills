---
name: copy-to-clipboard
description: Copy exact text to the user's macOS clipboard. Use when the user asks to copy something to the clipboard, put something in their clipboard, copy the previous answer, copy "this" or "that", or otherwise make text immediately pasteable on macOS via pbcopy.
---

# Copy To Clipboard

## Workflow

1. Resolve the exact text to copy.
   - If the user says "this", "that", "it", or "the above", infer the target from the immediate conversation context.
   - If the target is ambiguous, ask one concise clarification before copying.
   - Preserve line breaks, bullets, code fences, URLs, and punctuation exactly unless the user asks for cleanup.

2. Copy with macOS `pbcopy`.
   - Prefer a direct `pbcopy` invocation when possible.
   - For short text, a shell-safe command such as `printf '%s' $'escaped text' | pbcopy` is acceptable.
   - For long or quoting-sensitive text, start `pbcopy` in an interactive command session, send the text to stdin, then send EOF.

3. Handle sandbox restrictions.
   - If `pbcopy` fails because pasteboard access is blocked by the sandbox, immediately retry the same copy operation with `sandbox_permissions: "require_escalated"` and a short justification such as "Do you want to allow writing this text to your macOS clipboard?"
   - Do not ask separately before the escalation request; the tool approval prompt is the confirmation.

4. Confirm briefly.
   - Final response should be short, for example: "Copied it to your clipboard."
   - Do not repeat the copied text unless the user asks.

## Guardrails

- Copy only the content the user asked to copy.
- Do not modify files or create artifacts for clipboard-only requests.
- Do not use the clipboard for secrets unless the user explicitly provided the secret and asked to copy it.
- If the user asks to copy command output, run or summarize the requested command first only when needed, then copy the requested output.
