# Allow/Deny Lists for External Content

## Idea

Layer domain-level trust on top of the security wrapper. Instead of treating all external content the same, use curated + user-built lists to:

- **Allow**: Reduce friction for known-good sources (official docs, trusted repos)
- **Deny**: Block or flag known-bad sources before content ever reaches the LLM

## How It Works

### Three layers of lists

1. **Curated lists** — Maintained in the agent-skills repo. Seeded from trusted sources (e.g., OWASP, community blocklists). Updated over time.
2. **User local lists** — Stored on the user's machine (e.g., `~/.config/agent-skills/allow.txt`, `deny.txt`). Persists across sessions.
3. **Session decisions** — When the agent encounters a new domain during a search, the user can approve or deny it inline. That decision gets saved to their local list.

### In-flow UX

When a search result includes a domain not on any list:
- Agent presents the result normally (with security wrapper)
- User can say "trust this source" or "block this domain"
- Decision writes to their local allow/deny list
- Future searches respect the list automatically

When a result matches a denied domain:
- Result is either stripped entirely or shown with a strong warning
- Agent doesn't fetch/summarize content from denied sources

When a result matches an allowed domain:
- Security wrapper still applies (defense in depth)
- But agent can note the source is trusted for context

### Curated list sources to investigate

- OWASP/community-maintained blocklists
- Known SEO spam / content farm domains
- Known prompt injection test domains (if catalogued)
- Official documentation domains (developer.wordpress.org, developer.mozilla.org, etc.)

## File Format

Simple text files, one domain per line. Comments with `#`.

```
# allow.txt — trusted sources
developer.wordpress.org
developer.mozilla.org
docs.github.com
cheatsheetseries.owasp.org

# deny.txt — blocked sources  
seo-spam-example.com
prompt-injection-test.example
```

## Open Questions

- Should allow/deny apply at the domain level or URL pattern level?
- How aggressive should deny be — strip results entirely, or show with warning?
- Should the curated lists ship as part of the skill or as a separate updatable package?
- How to handle subdomains (e.g., trust `developer.wordpress.org` but not all of `wordpress.org`)?
- Could we score trust levels (0-1) instead of binary allow/deny?

## Status

Idea stage. No implementation yet.
