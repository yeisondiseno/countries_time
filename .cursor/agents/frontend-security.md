---
name: frontend-security
description: >
  Mandatory security reviewer for Agent 11/12 changes. OWASP frontend audit.
  Read and execute the full agent spec at .claude/agents/16-frontend-security.md.
  Blocks ship on Critical/High findings.
model: inherit
---

# Cursor subagent — Frontend Security (Agent 16)

**Invoke after every Layout Build (11) or React Frontend (12) delivery.**

## Instructions

1. Read and follow **[.claude/agents/16-frontend-security.md](../../.claude/agents/16-frontend-security.md)** in full.
2. Read **[.claude/references/owasp-frontend-security.md](../../.claude/references/owasp-frontend-security.md)**.
3. Audit the changed files/paths provided in the task.
4. Produce deliverables under `security/` per Agent 16 spec.
5. **BLOCK** completion if Critical/High findings remain open.

## Trigger

- Any PR or task touching HTML, React, TS, SCSS, client env, middleware, or `NEXT_PUBLIC_*`
- Before production release
