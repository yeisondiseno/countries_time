# Product Factory — phase gates

Validation criteria before advancing agents. Orchestrator: [product-factory](../skills/product-factory/SKILL.md).

## System links

| Resource | Link |
| -------- | ---- |
| Checklists | [checklist.md](checklist.md) |
| Security FE | [owasp-frontend-security.md](owasp-frontend-security.md) |
| Security BE | [owasp-backend-security.md](owasp-backend-security.md) |
| Templates | [venture-templates.md](venture-templates.md) |

---

## Global gates (all phases)

- [ ] All artifacts and communication in **English** (unless user overrides)
- [ ] Upstream artifact exists — agent does **not invent** missing inputs
- [ ] User confirmed phase output when the agent requires sign-off

---

## Phase A — Discover (01, 02)

**Gate to Phase B:**

- [ ] `venture-brief.md` — problem, vision, hypothesis, priorities
- [ ] `market-brief.md` — ICP, competitors, sizing, JTBD
- [ ] Value hypothesis is testable in MVP scope

---

## Phase B — Define (03)

**Gate to Phase C:**

- [ ] `prd-mvp.md` — user stories, **explicit out-of-scope**, pricing hypothesis
- [ ] MVP fits express timeline (≤ 1 page of scope)
- [ ] Success metrics defined

---

## Phase C — Architect (04)

**Gate to Phase D:**

- [ ] `tech-spec.md` — stack, architecture, hosting, auth model, risks
- [ ] Build plan is realistic for MVP
- [ ] Database engine and API style chosen

---

## Phase D — Brand & Build (05–14, 12)

**Gate to security review:**

- [ ] Brand pipeline: see [checklist.md](checklist.md) phases 5–14
- [ ] `api-contract.md` or OpenAPI before frontend integrates live API
- [ ] Schema migrations reviewed before backend ships

---

## Security on change

<a id="security-on-change"></a>

**Mandatory:** every constructor delivery triggers a security review **before** the task is marked done.

| Trigger | Reviewer | Blocks |
| ------- | -------- | ------ |
| Agent 11 or 12 changes HTML, React, TS, SCSS, client env | **16** | Merge/release if Critical/High open |
| Agent 13 or 14 changes schema, migrations, API, auth | **17** | Merge/release if Critical/High open |
| Full-stack change | **16 + 17** | Both must pass |

### Constructor agent obligations

Agents **11, 12, 13, 14** must:

1. Not mark work **complete** until 16/17 audit is recorded
2. Document changed files/paths for the auditor
3. Fix Critical/High findings or obtain formal risk acceptance with owner + expiry

### Security reviewer obligations

Agents **16, 17** must:

1. Produce finding IDs with OWASP/API Top 10 references
2. Set release **BLOCK** on Critical/High unless risk accepted in writing
3. Allow **fast pass** only for trivial FE changes (copy/color) with no auth/data impact

### Production gate (all three)

Before production:

- [ ] **15** Accessibility — WCAG 2.2 AA sign-off
- [ ] **16** Frontend Security — no open Critical/High
- [ ] **17** Backend Security — no open Critical/High (if backend exists)

---

## Phase E — GTM (18–20)

**Gate to Phase F:**

- [ ] `gtm-plan.md` — channels, messaging, landing copy outline
- [ ] `sales-playbook.md` — ICP, pitch, objections, pricing guardrails
- [ ] `cs-playbook.md` — onboarding, metrics (optional in express)

---

## Phase F — Launch (21–23)

**Gate to go-live:**

- [ ] `release-gate.md` — DoD, smoke tests, rollback plan
- [ ] `launch-plan.md` — D0–D30 sequence, metrics
- [ ] `ops-model.md` — unit economics (optional in express)
- [ ] All Phase D production gates (15, 16, 17) still valid at release tag

---

## Express mode — minimum gates

| Step | Required gate |
| ---- | ------------- |
| 01+02 | venture + market brief |
| 03 | prd-mvp |
| 04 | tech-spec |
| 05–11 | brand checklist |
| 13→14 | schema + API + **17** per change |
| 12 | React + **16** per change |
| 15–17 | all three before ship |
| 18+19 | gtm + sales |
| 23 | launch-plan |
