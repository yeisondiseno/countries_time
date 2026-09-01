---
name: brand-design-system
description: >
  Multi-agent system for holistic brand design. Coordinates specialized agents
  in: brand strategy, visual identity & logo, color theory & palettes,
  typography & scale, UI/UX & components, spacing & layout, final layout build,
  React/Next.js frontend implementation, accessibility (WCAG 2.2), and OWASP frontend security.
  Use this skill when the user wants to create a brand from scratch, define visual
  identity, design a logo, pick a color palette, establish a typographic system,
  design UI/UX interfaces, build pages or screens, create a design system,
  or any combination of these tasks. Also when they mention "branding",
  "brand identity", "look and feel", "style guide", "brand guidelines",
  "design tokens", or want a review/audit of existing design.
  For full-stack products, use with product-factory skill (agents 13–14, 17).
---

# Brand Design System — Multi-Agent Orchestrator

Part of the **[Product Factory](../product-factory/SKILL.md)** pipeline (agents 05–12, 15–16). For venture, backend, and launch phases use the parent orchestrator.

A system of specialized agents (05–12, 15–16 in the product-factory pipeline) working
in coordination to take a brand from strategy through final layout build, React
implementation, accessibility conformance, and OWASP-aligned frontend security audits.

For database, backend, and backend security, see [product-factory](../product-factory/SKILL.md)
agents **13**, **14**, and **17**.

## System architecture

```
┌─────────────────────────────────────────────────────────┐
│         brand-design-system (sub-orchestrator)          │
│  Receives brief → determines phase → activates agent(s)  │
│  Validates outputs → advances to next step               │
└──────────┬──────────────────────────────────────────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
  Agent 05     Agents 06–12 (sequential / parallel)
               Agents 15–16 audit before release
```

### Main workflow (agents 05–12, 15–16)

1. **Brand Strategist (05)** → Brief, positioning, personality, values
2. **Identity & Logo (06)** → Logo, variants, usage rules
3. **Color (07)** → Color palette, color system, accessibility
4. **Typography (08)** → Type system, scale, hierarchy
5. **UI/UX (09)** → Components, patterns, interactions
6. **Spacing & Layout (10)** → Grid, spacing, visual rhythm
7. **Layout Build (11)** → Full pages, responsive, HTML/CSS deliverables
8. **React Frontend (12)** → Next.js/React implementation, components, hooks, services
9. **Accessibility (15)** → WCAG 2.2 / ARIA audits, remediation, conformance docs
10. **Frontend Security (16)** → OWASP aggressive audits, data leakage hunts, release gate

Agents 07 and 08 may run in parallel. Agent 09 depends on 06, 07, and 08.
Agent 10 depends on 09. Agent 11 integrates everything for static delivery.
Agent 12 depends on 09, 10, and 11 (or equivalent tokens + specs); runs when the stack is React/Next.js.
**Agent 15** runs after 07/09, 11, and 12 for accessibility — or on demand.
**Agent 16** runs after 11 (static) and **must** run after 12 before production — aggressive OWASP pass; blocks Critical/High.

**Constructor agents (10, 11, 12)** must follow [code-patterns.md](../../rules/code-patterns.md) and [front-dev-patterns](../../skills/front-dev-patterns/SKILL.md) on all code output — non-negotiable.

## How to use this skill

> **Language**: English is the default language for all system documentation,
> agent outputs, deliverables, and user communication. Only switch to another
> language if the user explicitly requests it.

> **Paths**: All paths in this system are relative to the project's `.claude/`
> folder. Copy the entire `.claude/` folder (agents, skills, references)
> to use the system in any repository.

### When you receive a user request:

1. Read this file to understand the overall architecture
2. Identify which phase the user is in:
   - Starting from zero? → Start with Agent 05 (Brand Strategist)
   - Already have logo/colors? → Jump to the phase they need
   - Asking for something specific? → Go straight to the matching agent
3. Read the relevant agent file under `.claude/agents/`
4. Execute the rules and produce the outputs
5. Before moving on to the next agent, validate against `.claude/references/checklist.md`

### Agent routing

| User says…                                              | Agent(s) to activate                          |
| ------------------------------------------------------- | --------------------------------------------- |
| "Create a brand from scratch"                           | 05 → 06 → 07 → 08 → 09 → 10 → 11              |
| "Design a logo"                                         | 06 (ask for brief if missing)                 |
| "Pick colors / palette"                                 | 07                                            |
| "Define typography"                                     | 08                                            |
| "Design components / UI"                                | 09 (needs 07 + 08)                            |
| "Build a page / screen"                                 | 11 (needs 09 + 10); add 12 if React/Next      |
| "Implement in React / Next.js"                          | 12 (+ 11 for structure; needs 09 + 10 tokens) |
| "Components in code / hooks / API layer"                | 12                                            |
| "Database / schema / migrations"                        | 13 (via product-factory)                      |
| "Backend / API / server"                                | 14 (via product-factory)                      |
| "Accessibility / WCAG / a11y audit / VPAT / 508"        | 15                                            |
| "Security audit frontend / OWASP / XSS / data leakage"  | 16                                            |
| "Security audit backend / API / SQL injection / IDOR"   | 17 (via product-factory)                      |
| "Create style guide / brand guidelines"                 | 05–11 → compile; 15 for a11y chapter          |
| "Review / audit existing design"                        | Agent for the facet; 15 for accessibility     |
| "Design system / design tokens"                         | 07 + 08 + 09 + 10                             |

### Output format per agent

Each agent delivers a standardized output. Read the agent file
under `.claude/agents/` for full rules and output format.

### Global system rules

1. **Consistency first**: every design decision should reference earlier
   decisions. Color reinforces brand personality. Type aligns with tone.
   Components use the defined tokens.

2. **Accessibility is not optional**: WCAG **2.2 Level AA** minimum ([Agent 15](../../agents/15-accessibility.md)).
   4.5:1 contrast for text, 3:1 for large graphical elements. Everything
   keyboard-accessible. Run Agent 15 before shipping pages or React code.

3. **Mobile-first**: design for mobile first, scale up to desktop afterward.
   Touch targets at least 44×44px.

4. **Document everything**: include the "why" for each decision, not only the "what".

5. **Design tokens as the bridge**: the token system (color, type, spacing)
   is the contract between design and development. Define it early.

6. **Continuous feedback**: before advancing to the next agent, confirm
   with the user that the current output is acceptable.

7. **Security before production**: run [Agent 16](../../agents/16-frontend-security.md) on React/Next
   deliverables and [Agent 17](../../agents/17-backend-security.md) on backend/API;
   treat Critical/High findings as release blockers unless risk is formally accepted.

## References

### Agents (`.claude/agents/`)

- [05-brand-strategist.md](../../agents/05-brand-strategist.md) — Strategy & positioning
- [06-identity-logo.md](../../agents/06-identity-logo.md) — Logo & visual identity
- [07-color-system.md](../../agents/07-color-system.md) — Color theory & palettes
- [08-typography.md](../../agents/08-typography.md) — Typographic system
- [09-ui-ux.md](../../agents/09-ui-ux.md) — Components & experience
- [10-spacing-layout.md](../../agents/10-spacing-layout.md) — Spacing, grid & layout
- [11-layout-build.md](../../agents/11-layout-build.md) — Layout build & HTML/CSS deliverables
- [12-react-frontend.md](../../agents/12-react-frontend.md) — React/Next.js implementation
- [13-database-specialist.md](../../agents/13-database-specialist.md) — Database schema & migrations
- [14-backend-developer.md](../../agents/14-backend-developer.md) — Backend APIs & services
- [15-accessibility.md](../../agents/15-accessibility.md) — WCAG 2.2, ARIA, international conformance
- [16-frontend-security.md](../../agents/16-frontend-security.md) — OWASP frontend security
- [17-backend-security.md](../../agents/17-backend-security.md) — OWASP backend/API security

### Shared references (`.claude/references/`)

- [design-principles.md](../../references/design-principles.md) — Gestalt principles & UX laws
- [accessibility-standards.md](../../references/accessibility-standards.md) — WCAG, EN 301 549, Section 508 map
- [owasp-frontend-security.md](../../references/owasp-frontend-security.md) — OWASP Top 10, ASVS, leakage checklist
- [owasp-backend-security.md](../../references/owasp-backend-security.md) — OWASP API Top 10, backend checklist
- [checklist.md](../../references/checklist.md) — Phase validation checklists

### Companion skills (`.claude/skills/`)

- [code-patterns.md](../../rules/code-patterns.md) — Frontend enforcement (always apply); mandatory for Agent 12
- [front-dev-patterns](../../skills/front-dev-patterns/SKILL.md) — Full examples & rationale; consult when implementing
- [product-factory](../product-factory/SKILL.md) — Full product pipeline orchestrator (agents 01–23)
