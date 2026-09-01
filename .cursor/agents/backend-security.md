---
name: backend-security
description: >
  Mandatory security reviewer for Agent 13/14 changes. OWASP API/backend audit.
  Read and execute the full agent spec at .claude/agents/17-backend-security.md.
  Blocks ship on Critical/High findings.
model: inherit
---

# Cursor subagent — Backend Security (Agent 17)

**Invoke after every Database (13) or Backend (14) delivery.**

## Instructions

1. Read and follow **[.claude/agents/17-backend-security.md](../../.claude/agents/17-backend-security.md)** in full.
2. Read **[.claude/references/owasp-backend-security.md](../../.claude/references/owasp-backend-security.md)**.
3. Audit changed API routes, schema, migrations, auth, and config.
4. Produce deliverables under `security/backend/` per Agent 17 spec.
5. **BLOCK** completion if Critical/High findings remain open.

## Trigger

- Any PR or task touching API, database migrations, auth, server middleware, or secrets
- Before production release
