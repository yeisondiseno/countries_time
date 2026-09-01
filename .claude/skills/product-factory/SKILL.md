---
name: product-factory
description: >
  Product Factory orchestrator. Routes agents 01–23 from idea to launch:
  discover, define, architect, brand, build, security gates, GTM, and scale.
  Use when creating a product from scratch, running the full pipeline, or
  coordinating venture, MVP, tech, frontend, backend, and launch work.
  Sub-skill: brand-design-system (agents 05–12, 15–16).
---

# Product Factory — Orchestrator (Agent 00)

End-to-end multi-agent system: **23 specialized agents** plus this orchestrator.
Default language: **English** (see § Global rules). Security review on every FE/BE change is **mandatory** (see § Security on change).

## System architecture

```
┌──────────────────────────────────────────────────────────────┐
│              PRODUCT FACTORY (this skill)                    │
│   Receives request → phase → agent(s) → validate gates       │
└──────────┬───────────────────────────────────────────────────┘
           │
     ┌─────┴──────────────────────────────────────────────────┐
     ▼                                                        ▼
  01–04  Discover / Define / Architect              05–12  Brand & Frontend
  13–14  Database & Backend                          15–17  Gates (a11y + security)
  18–20  GTM / Sales / CS                            21–23  Ops / QA / Launch
```

### Phase flow

| Phase | Agents | Gate artifact |
| ----- | ------ | ------------- |
| A — Discover | 01, 02 | `venture-brief.md`, `market-brief.md` |
| B — Define | 03 | `prd-mvp.md` |
| C — Architect | 04 | `tech-spec.md` |
| D — Brand & Build | 05–14, 12 | tokens, schema, API, code |
| D — Gates | 15, 16, 17 | audit reports, sign-off |
| E — GTM | 18–20 | `gtm-plan.md`, `sales-playbook.md`, `cs-playbook.md` |
| F — Launch | 21–23 | `ops-model.md`, `release-gate.md`, `launch-plan.md` |

Detailed gates: [product-gates.md](../../references/product-gates.md) · Checklists: [checklist.md](../../references/checklist.md)

## Global rules (mandatory)

### English only

All agent outputs, artifacts, code comments, and audit reports are in **English** unless the user explicitly requests another language. End-user product copy may follow the market language documented in the PRD.

### Security on change (non-negotiable)

After **every** delivery from a constructor agent, invoke the matching security agent **before** marking work done:

| Constructor | Security reviewer |
| ----------- | ----------------- |
| 11 Layout Build, 12 React Frontend | **16** Frontend Security |
| 13 Database Specialist, 14 Backend Developer | **17** Backend Security |

- No merge/release with open **Critical** or **High** findings.
- Full-stack changes require **both** 16 and 17.
- Agent 15 (accessibility) runs before production alongside 16/17.

Policy detail: [product-gates.md](../../references/product-gates.md#security-on-change)

### Dual runtime (Claude + Cursor)

- **Source of truth:** `.claude/agents/`, `.claude/skills/`, `.claude/references/`
- **Cursor:** `.cursor/skills/`, `.cursor/rules/product-factory.mdc`, `.cursor/agents/` for subagents 16/17

## How to use

1. Read this skill and [product-gates.md](../../references/product-gates.md)
2. Identify phase from user request (routing table below)
3. Read the target agent under `.claude/agents/`
4. Validate upstream artifacts exist — **do not invent** missing inputs
5. Produce deliverable; run checklist gate before next agent
6. After agents 11/12/13/14 output → **mandatory** 16 or 17 review

### Sub-skill: brand & design (phase D partial)

For branding, UI, and frontend-only work, load [brand-design-system](../brand-design-system/SKILL.md) (agents 05–12, 15–16).

## Routing table

| User says… | Activate |
| ---------- | -------- |
| Create product from scratch | 01 → 02 → 03 → 04 → 05–14 → 12 → 15–17 → 18 → 19 → 23 |
| Venture / vision / CEO brief | 01 |
| Market research / ICP / competitors | 02 |
| MVP / PRD / scope | 03 |
| Architecture / stack / tech spec | 04 |
| Branding / logo / design system | 05–12 via brand-design-system |
| Database / schema / migrations | 13 → **17** |
| Backend / API / server | 14 → **17** |
| React / Next.js / frontend code | 12 → **16** |
| HTML / static pages | 11 → **16** |
| Accessibility / WCAG / a11y | 15 |
| Frontend security / OWASP / XSS | 16 |
| Backend security / API audit | 17 |
| GTM / marketing / launch messaging | 18 |
| Sales playbook / pitch | 19 |
| Customer success / onboarding | 20 |
| Ops / finance / unit economics / 1M ARR | 21 |
| QA / release checklist | 22 |
| Launch plan / go-live | 23 |

## Express mode (minimum viable pipeline)

| Step | Agents | Output |
| ---- | ------ | ------ |
| 1 | 01 + 02 | Brief + ICP |
| 2 | 03 | PRD MVP (1 page) |
| 3 | 04 | Tech spec |
| 4 | 05 → 11 | Brand + UI |
| 5 | 13 → 14 | Schema + API |
| 6 | 12 | React |
| 7 | 15 + 16 + 17 | Gates (16/17 per FE/BE change) |
| 8 | 18 + 19 | GTM + pitch |
| 9 | 23 | Launch checklist |

Skip initially: 20, 21. Fold 22 into gates 15–17 in express.

## Artifact chain

```
venture-brief.md (01)
  └── market-brief.md (02)
        └── prd-mvp.md (03)
              ├── tech-spec.md (04)
              ├── brand & UI (05…11)
              ├── data/ (13) ──► review 17
              ├── backend/ (14) ──► review 17
              ├── frontend/ (12) ──► review 16
              └── gtm (18, 19) ──► launch-plan.md (23)
```

Templates: [venture-templates.md](../../references/venture-templates.md)

## Agent index

| # | Agent | File |
| - | ----- | ---- |
| 01 | Venture CEO | [01-venture-ceo.md](../../agents/01-venture-ceo.md) |
| 02 | Market Researcher | [02-market-researcher.md](../../agents/02-market-researcher.md) |
| 03 | Product Manager | [03-product-manager.md](../../agents/03-product-manager.md) |
| 04 | Tech Architect | [04-tech-architect.md](../../agents/04-tech-architect.md) |
| 05–12 | Brand & Frontend | brand-design-system skill |
| 13 | Database Specialist | [13-database-specialist.md](../../agents/13-database-specialist.md) |
| 14 | Backend Developer | [14-backend-developer.md](../../agents/14-backend-developer.md) |
| 15 | Accessibility | [15-accessibility.md](../../agents/15-accessibility.md) |
| 16 | Frontend Security | [16-frontend-security.md](../../agents/16-frontend-security.md) |
| 17 | Backend Security | [17-backend-security.md](../../agents/17-backend-security.md) |
| 18 | Growth Marketer | [18-growth-marketer.md](../../agents/18-growth-marketer.md) |
| 19 | Sales Playbook | [19-sales-playbook.md](../../agents/19-sales-playbook.md) |
| 20 | Customer Success | [20-customer-success.md](../../agents/20-customer-success.md) |
| 21 | Ops & Finance | [21-ops-finance.md](../../agents/21-ops-finance.md) |
| 22 | QA & Release | [22-qa-release.md](../../agents/22-qa-release.md) |
| 23 | Launch Coordinator | [23-launch-coordinator.md](../../agents/23-launch-coordinator.md) |

## References

- [checklist.md](../../references/checklist.md)
- [product-gates.md](../../references/product-gates.md)
- [venture-templates.md](../../references/venture-templates.md)
- [brand-design-system](../brand-design-system/SKILL.md)
- [code-patterns.md](../../rules/code-patterns.md)
