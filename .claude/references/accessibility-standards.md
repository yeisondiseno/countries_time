# International accessibility standards — reference

Quick map for Agent 15. Official specs take precedence over this summary.

## Primary conformance target (default)

| Standard                                            | Level  | Scope                                 |
| --------------------------------------------------- | ------ | ------------------------------------- |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/)           | **AA** | Web content — default for this system |
| [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) | —      | Roles, states, properties for rich UI |
| [ARIA APG 1.2](https://www.w3.org/WAI/ARIA/apg/)    | —      | Keyboard and interaction patterns     |

## Legal and procurement alignment

| Standard / law                                                                                                | Region            | Typical mapping                                         |
| ------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------- |
| [EN 301 549](https://www.etsi.org/standards#page=1&search=301%20549) v3.2.1                                   | EU                | WCAG 2.1 Level AA for web                               |
| [Section 508](https://www.section508.gov/) (2018 refresh)                                                     | US federal        | WCAG 2.0 AA baseline; agencies often require 2.1/2.2 AA |
| ADA Title III (US courts)                                                                                     | US private sector | WCAG 2.1/2.2 AA as de facto standard                    |
| [EAA](https://employment-social-affairs.ec.europa.eu/policies/social-inclusion/european-accessibility-act_en) | EU (from 2025)    | Products/services incl. e-commerce — EN 301 549 / WCAG  |
| [ISO/IEC 40500:2012](https://www.iso.org/standard/58625.html)                                                 | International     | Technically identical to WCAG 2.0                       |
| [ATAG 2.0](https://www.w3.org/TR/ATAG20/)                                                                     | Authoring tools   | Design tools, CMS, page builders                        |

When the user names a jurisdiction, set the conformance statement explicitly and cite the row above.

## WCAG 2.2 — four principles (audit structure)

### 1. Perceivable

- Text alternatives (`alt`, `aria-label`, visible text for icons)
- Captions/transcripts for time-based media
- Adaptable structure (semantic HTML, correct heading order)
- Distinguishable: contrast, resize 200%, `prefers-reduced-motion`, no information by color alone

### 2. Operable

- Keyboard accessible; no keyboard trap
- Enough time (timeouts, pausing carousels)
- Seizure-safe (no flashing > 3/s)
- Navigable: skip link, focus order, page titles, link purpose
- **2.5 Target Size (Minimum)** — 24×24 CSS px (AA); brand system uses **44×44** touch targets

### 3. Understandable

- Readable language (`lang`)
- Predictable navigation and components
- Input assistance: labels, errors, suggestions

### 4. Robust

- Valid, nameable, operable in assistive tech
- Status messages: `role="status"` / `aria-live`

## New in WCAG 2.2 (beyond 2.1) — verify explicitly

| Criterion                 | ID                        | Summary                                     |
| ------------------------- | ------------------------- | ------------------------------------------- |
| Focus not obscured        | 2.4.11 (AA), 2.4.12 (AAA) | Focused element visible                     |
| Dragging movements        | 2.5.7 (AA)                | Alternative to drag                         |
| Target size               | 2.5.8 (AA)                | Min 24×24px (exceptions apply)              |
| Consistent help           | 3.2.6 (A)                 | Help in same relative order                 |
| Redundant entry           | 3.3.7 (A)                 | Autocomplete / avoid re-entry               |
| Accessible authentication | 3.3.8 (AA), 3.3.9 (AAA)   | No cognitive-only tests without alternative |

## Testing methods (minimum)

| Method        | Tool / action                                                        |
| ------------- | -------------------------------------------------------------------- |
| Automated     | axe DevTools, WAVE, Lighthouse accessibility                         |
| Contrast      | APCA-aware check; system uses WCAG 2.x contrast ratios from Agent 07 |
| Keyboard      | Tab / Shift+Tab / Enter / Space / Esc — full task flows              |
| Screen reader | VoiceOver (macOS/iOS), NVDA (Windows), TalkBack (Android) smoke      |
| Zoom          | 200% browser zoom — no loss of content/function                      |
| Motion        | `prefers-reduced-motion: reduce`                                     |
| Color         | Grayscale + color-blind simulation                                   |

## System links

- Agent 15: [15-accessibility.md](../agents/15-accessibility.md)
- Orchestrator: [brand-design-system](../skills/brand-design-system/SKILL.md)
- Checklist: [checklist.md](checklist.md#phase-15-accessibility-agent-15)
