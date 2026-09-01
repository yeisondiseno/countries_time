# Phase validation checklists

Before advancing to the next agent, the orchestrator verifies these criteria.

## System links

| Resource         | Link                                                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Orchestrator     | [product-factory](../skills/product-factory/SKILL.md) · [brand-design-system](../skills/brand-design-system/SKILL.md) |
| Phase gates      | [product-gates.md](product-gates.md) |
| UX principles    | [design-principles.md](design-principles.md)                                                                               |
| Agents | [05](../agents/05-brand-strategist.md) · … · [15](../agents/15-accessibility.md) · [16](../agents/16-frontend-security.md) · [17](../agents/17-backend-security.md) |
| A11y standards   | [accessibility-standards.md](accessibility-standards.md)                                                                   |
| Security (OWASP) | [owasp-frontend-security.md](owasp-frontend-security.md)                                                                   |

---

## Phase 5: Brand Strategy (Agent 05)

### Gate check — Can we proceed to Agent 06?

- [ ] Complete brief with the 5 essential questions answered
- [ ] Brand personality defined (primary + secondary dimension)
- [ ] Archetype selected and justified
- [ ] Positioning statement formulated
- [ ] Design attributes defined (`color_direction`, `type_direction`, `logo_direction`)
- [ ] User explicitly confirmed the brief

---

## Phase 6: Identity & Logo (Agent 06)

### Gate check — Can we proceed to Agents 07/08?

- [ ] At least 3 conceptual directions presented
- [ ] Direction chosen by the user
- [ ] Primary logo defined with construction geometry
- [ ] Minimum 4 variants specified (primary, stacked, symbol, mono)
- [ ] Clear space defined
- [ ] Minimum sizes established
- [ ] Correct and incorrect usage rules documented
- [ ] SVG generated and functional
- [ ] Logo legible in black & white
- [ ] Logo recognizable at 16×16px

---

## Phase 7: Color System (Agent 07)

### Gate check — Can we integrate with Agent 09?

- [ ] Color harmony chosen and justified
- [ ] Core palette: primary, secondary, accent, neutral (3–5 colors)
- [ ] Semantic colors: success, warning, error, info
- [ ] Extended ramps: minimum 7 stops per core color
- [ ] WCAG AA verified on ALL text/background combinations
- [ ] Dark mode designed (not merely inverted)
- [ ] Color-blind simulation verified
- [ ] Tokens exported as JSON
- [ ] CSS variables generated
- [ ] Values in HEX and RGB (CMYK if print)

---

<a id="phase-8-typography-agent-08"></a>

## Phase 8: Typography (Agent 08)

### Gate check — Can we integrate with Agent 09?

- [ ] Maximum 2 type families (3 exceptionally)
- [ ] Modular scale defined with justified ratio
- [ ] Minimum 7 levels in the scale (display → overline)
- [ ] Line-heights defined and multiples of 4px
- [ ] Fonts available (Google Fonts or open license)
- [ ] Language support verified (ñ, accents, etc.)
- [ ] Body ≥ 16px
- [ ] Fluid type with `clamp()` for responsive
- [ ] Font stack with full fallbacks
- [ ] Tokens exported as JSON

---

<a id="phase-5-uiux-components-agent-05"></a>

## Phase 9: UI/UX Components (Agent 09)

### Gate check — Can we proceed to Agents 10/11?

- [ ] Minimum catalog: buttons, inputs, cards, nav, modals, feedback
- [ ] EACH component has: states, variants, tokens, accessibility
- [ ] All colors come from Agent 07 tokens
- [ ] All typographic sizes from Agent 08
- [ ] Focus ring visible on ALL interactive elements
- [ ] ARIA roles defined for each component
- [ ] Keyboard navigation documented
- [ ] Touch targets ≥ 44×44px verified
- [ ] WCAG AA contrast in all states
- [ ] Dark mode functional for all components
- [ ] Example code for each component

---

<a id="phase-6-spacing--layout-agent-06"></a>

## Phase 10: Spacing & Layout (Agent 10)

### Gate check — Can we proceed to Agent 11?

- [ ] Spacing scale based on 8pt (4pt half-step)
- [ ] Internal ≤ external rule verified on components
- [ ] Column grid defined for mobile, tablet, desktop
- [ ] 4px baseline grid documented
- [ ] Breakpoints defined
- [ ] Z-index scale established
- [ ] Layout patterns documented (at least 3)
- [ ] Spacing tokens exported
- [ ] CSS utilities generated
- [ ] Token keys / CSS variables aligned with [code-patterns.md](../rules/code-patterns.md) and [front-dev-patterns](../skills/front-dev-patterns/SKILL.md) (ready for `@constants/index` / `src/styles/index.scss`)

---

<a id="phase-7-layout-build-agent-07"></a>

## Phase 11: Layout Build (Agent 11)

### Final checklist — Ready to deliver?

**Code:**

- [ ] [code-patterns.md](../rules/code-patterns.md) and [front-dev-patterns](../skills/front-dev-patterns/SKILL.md) applied to all HTML/CSS/SCSS (read before Phase 4)
- [ ] Semantic HTML (no divitis)
- [ ] Correct heading hierarchy
- [ ] ZERO magic values — everything references tokens
- [ ] Mobile-first CSS
- [ ] Dark mode functional
- [ ] No unnecessary frameworks

**Visual:**

- [ ] Consistent with brand brief
- [ ] Logo used correctly
- [ ] Colors from approved palette
- [ ] Typography from defined scale
- [ ] Spacing from tokens
- [ ] Grid respected

**Responsive:**

- [ ] 320px ✓
- [ ] 768px ✓
- [ ] 1024px ✓
- [ ] 1440px ✓
- [ ] Legible text in all viewports

**Accessibility (WCAG 2.1 AA):**

- [ ] Skip to content link
- [ ] Focus visible on interactive elements
- [ ] Alt text on images
- [ ] Contrast ≥ 4.5:1 normal text
- [ ] Contrast ≥ 3:1 large text
- [ ] Keyboard navigation
- [ ] `prefers-reduced-motion`
- [ ] `prefers-color-scheme`
- [ ] `lang` on `html` tag
- [ ] ARIA landmarks

**Performance:**

- [ ] `font-display: swap`
- [ ] Images lazy loaded
- [ ] CSS optimized
- [ ] Lighthouse ≥ 90 (all categories)

**Deliverables:**

- [ ] Complete HTML pages
- [ ] Organized CSS (tokens, reset, base, components, layouts, pages)
- [ ] Organized assets (logo SVGs, images, fonts)
- [ ] Brand guidelines document/page
- [ ] README with instructions

---

<a id="phase-8-react-frontend-agent-08"></a>

## Phase 12: React Frontend (Agent 12)

### Gate check — Ready to ship React/Next code?

**Prerequisites:**

- [ ] Color, typography, and spacing tokens available (Agents 07, 08, 10)
- [ ] Component specs from Agent 09 (variants, states, a11y)
- [ ] Page structure or HTML prototype from Agent 11 (or approved wireframe)
- [ ] Target repo rules reviewed (AGENTS.md, INDEX_COMPONENTS, `.cursor/rules`)

**Code quality:**

- [ ] [code-patterns.md](../rules/code-patterns.md) followed (canonical import order + comment schema, body order, arrow functions)
- [ ] Atomic design layers respected (atoms → molecules → organisms → templates; no upward imports)
- [ ] Public API only via barrel `index` files (components, utils, constants, services, icons, hooks, types)
- [ ] No `any`; interfaces/types for props and DTOs
- [ ] Existing catalog components reused where applicable
- [ ] No magic color/type/spacing values — tokens only
- [ ] `npm run lint` passes

**React / Next:**

- [ ] App Router structure matches project conventions
- [ ] SSR (`await` in Server Components) vs CSR (`useQuery`) used correctly
- [ ] Services layer respected (actions → components, fetchers → `axiosInstance`)
- [ ] i18n via next-intl keys when project uses translations
- [ ] State: no unnecessary `useEffect`; justified if present

**UI / a11y / responsive:**

- [ ] Matches Agent 09 component states and variants
- [ ] WCAG AA (focus, contrast, keyboard, touch targets)
- [ ] Mobile-first responsive (320px → 1440px+)
- [ ] Dark mode from approved tokens

**Deliverables:**

- [ ] Components and pages in `src/` per project layout
- [ ] Tokens mapped to theme/SCSS/CSS variables
- [ ] Assets (logos, images) wired correctly
- [ ] README or PR notes listing consumed design artifacts
- [ ] Agent 15 code audit passed (or remediation backlog closed)
- [ ] Agent 16 security audit passed (no open Critical/High)

---

<a id="phase-9-accessibility-agent-09"></a>

## Phase 15: Accessibility (Agent 15)

### Gate check — Ready to ship (accessibility sign-off)?

**Scope documented:**

- [ ] Conformance target stated (default: WCAG 2.2 Level AA)
- [ ] Legal context noted if applicable (EN 301 549, Section 508, ADA, EAA)
- [ ] Audit scope listed (pages, components, codebase paths)

**WCAG 2.2 AA (POUR):**

- [ ] Perceivable: alt text, contrast (4.5:1 / 3:1), 200% zoom, reduced motion, no color-only state
- [ ] Operable: full keyboard, visible focus, no traps, skip link, 44×44 touch targets
- [ ] Understandable: `lang`, labels, errors, consistent navigation
- [ ] Robust: valid semantics, ARIA only when needed, status messages announced

**WCAG 2.2-specific (verify):**

- [ ] 2.4.11 Focus not obscured (AA)
- [ ] 2.5.7 Dragging has alternative (AA)
- [ ] 2.5.8 Target size minimum 24×24px (AA)
- [ ] 3.3.8 Accessible authentication (AA)

**Patterns & code:**

- [ ] Interactive widgets match [ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
- [ ] Agent 09 component a11y specs complete or updated
- [ ] Agent 11 page audit: landmarks, headings, forms, media
- [ ] Agent 12 fixes follow [code-patterns.md](../rules/code-patterns.md)
- [ ] Automated scan run (axe / Lighthouse a11y) — Blockers resolved

**Deliverables:**

- [ ] `accessibility/conformance-statement.md`
- [ ] `accessibility/audit-report.md` with WCAG SC citations
- [ ] `accessibility/remediation-backlog.md` (all Blocker/Major closed or accepted)
- [ ] `accessibility/testing-record.md`

---

<a id="phase-16-frontend-security-agent-16"></a>

## Phase 16: Frontend Security (Agent 16)

### Gate check — Ready for production (security sign-off)?

**Scope documented:**

- [ ] Threat model and attack surface inventory complete
- [ ] OWASP ASVS Level 2 + Top 10 2021 cited in report
- [ ] Staging/build URL or repo paths audited

**OWASP Top 10 (aggressive — client):**

- [ ] A01 Broken access control — UI/route exposure verified
- [ ] A02 Cryptographic failures — no secrets in client storage or env
- [ ] A03 Injection — XSS vectors tested (reflected, stored, DOM)
- [ ] A04 Insecure design — no client-only security for sensitive flows
- [ ] A05 Misconfiguration — CSP, HSTS, headers, no verbose errors
- [ ] A06 Vulnerable components — `npm audit` High/Critical addressed or accepted
- [ ] A07 Auth failures — tokens not in localStorage; logout clears state
- [ ] A08 Integrity — third-party scripts inventoried; SRI where required
- [ ] A09 Logging — analytics/errors do not leak PII or tokens
- [ ] A10 SSRF — no user-controlled fetch to internal URLs from browser

**Data leakage (mandatory hunt):**

- [ ] No secrets in `NEXT_PUBLIC_*` / client bundles / source maps
- [ ] No tokens or PII in localStorage, sessionStorage, URL, or `__NEXT_DATA__`
- [ ] API/DTO responses not over-fetched to client components
- [ ] Server Actions return minimal fields only

**Deliverables:**

- [ ] `security/audit-report.md` with PoC for Critical/High
- [ ] `security/data-leakage-report.md`
- [ ] `security/remediation-backlog.md` — all Critical/High closed or formal risk acceptance
- [ ] `security/dependency-report.md`


---

<a id="phase-13-database-specialist-agent-13"></a>

## Phase 13: Database Specialist (Agent 13)

### Gate check — Can we proceed to Agent 14?

- [ ] `erd.md` and entity relationships documented
- [ ] Initial migrations ordered and reversible
- [ ] Indexes defined for MVP query patterns
- [ ] PII columns flagged in `data-dictionary.md`
- [ ] App vs migration DB roles documented
- [ ] Schema aligns with `prd-mvp.md` and `tech-spec.md`

---

<a id="phase-14-backend-developer-agent-14"></a>

## Phase 14: Backend Developer (Agent 14)

### Gate check — Ready for frontend integration?

- [ ] `api-contract.md` or OpenAPI published
- [ ] Auth model implemented and documented
- [ ] Authorization on every mutating endpoint
- [ ] Parameterized queries / ORM only — no raw SQL concatenation
- [ ] `.env.example` documents required vars (no secrets in repo)
- [ ] Critical path tests or manual test record for auth flows

---

<a id="phase-17-backend-security-agent-17"></a>

## Phase 17: Backend Security (Agent 17)

### Gate check — Ready for production (backend sign-off)?

- [ ] Threat model and API attack surface complete
- [ ] OWASP API Top 10 + ASVS Level 2 cited in report
- [ ] IDOR tested on object-level routes
- [ ] No secrets in repo or verbose error responses
- [ ] `npm audit` / equivalent: High/Critical addressed or accepted
- [ ] `security/backend/remediation-backlog.md` — all Critical/High closed or accepted

---

<a id="phase-1-venture-ceo-agent-01"></a>

## Phase 1: Venture CEO (Agent 01)

### Gate check — Can we proceed to Agent 02?

- [ ] `venture-brief.md` complete (template in venture-templates.md)
- [ ] Value hypothesis stated and testable
- [ ] User confirmed brief

---

<a id="phase-2-market-research-agent-02"></a>

## Phase 2: Market Research (Agent 02)

### Gate check — Can we proceed to Agent 03?

- [ ] `market-brief.md` with ICP, competitors, JTBD
- [ ] Sizing assumptions documented

---

<a id="phase-3-product-manager-agent-03"></a>

## Phase 3: Product Manager (Agent 03)

### Gate check — Can we proceed to Agent 04?

- [ ] `prd-mvp.md` with P0 stories and **out-of-scope** list
- [ ] Success metrics and pricing hypothesis

---

<a id="phase-4-tech-architect-agent-04"></a>

## Phase 4: Tech Architect (Agent 04)

### Gate check — Can we proceed to Phase D?

- [ ] `tech-spec.md` with stack, auth, hosting, build plan

---

<a id="phase-18-growth-marketer-agent-18"></a>

## Phase 18: Growth Marketer (Agent 18)

- [ ] `gtm-plan.md` with positioning, channels, landing outline

---

<a id="phase-19-sales-playbook-agent-19"></a>

## Phase 19: Sales Playbook (Agent 19)

- [ ] `sales-playbook.md` with pitch, objections, pricing guardrails

---

<a id="phase-20-customer-success-agent-20"></a>

## Phase 20: Customer Success (Agent 20)

- [ ] `cs-playbook.md` with onboarding and metrics

---

<a id="phase-21-ops-finance-agent-21"></a>

## Phase 21: Ops & Finance (Agent 21)

- [ ] `ops-model.md` with unit economics and hiring plan

---

<a id="phase-22-qa-release-agent-22"></a>

## Phase 22: QA & Release (Agent 22)

- [ ] `release-gate.md` — gates 15–17 satisfied

---

<a id="phase-23-launch-coordinator-agent-23"></a>

## Phase 23: Launch Coordinator (Agent 23)

- [ ] `launch-plan.md` — D0–D30 metrics and owners
