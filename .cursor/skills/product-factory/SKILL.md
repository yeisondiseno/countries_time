---
name: product-factory
description: >
  Cursor entry point for Product Factory. Loads the orchestrator from .claude.
---

# Product Factory (Cursor)

This skill mirrors **[.claude/skills/product-factory/SKILL.md](../../.claude/skills/product-factory/SKILL.md)**.

When activated:

1. Read the `.claude` orchestrator file above in full.
2. Apply [.cursor/rules/product-factory.mdc](../../rules/product-factory.mdc) (English + security gates).
3. Load agents from `.claude/agents/`.
4. After agents 11/12/13/14 work → invoke Cursor subagents `frontend-security` / `backend-security`.

Do not duplicate orchestrator logic here — **edit `.claude/skills/product-factory/SKILL.md`** as source of truth.
