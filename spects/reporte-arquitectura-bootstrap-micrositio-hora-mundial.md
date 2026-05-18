# Report — Technical bootstrap specification

**Project:** Countries Time — world clock and comparator microsite  
**Functional baseline:** `spects/micrositio-hora-mundial-comparador.md`  
**Reference role:** `.claude/agents/architect.md`  
**Report version:** 1.0  
**Date:** 2026-05-18

---

## 1. Executive summary

This document defines how to **start implementation** of the microsite in the product specification: SEO/Ads traffic, per-country pages, a synchronized comparator (2–4 countries), eight languages, AA accessibility, and zone data versioned in the repo.

The agreed technical stack is **Next.js (App Router)** with code under **`src/`**, package management with **Bun**, forms with **react-hook-form**, **Million** compilation, styles with **global CSS and CSS Modules**, UI organization inspired by **atomic design**, XSS mitigation with **sanitize-html**, and icons with **react-icons**.

---

## 2. Problem and goals

| Aspect               | Description                                                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Business problem** | Capture organic volume (queries such as “time in X”, time-zone conversions) and monetize with Google Ads without sacrificing usefulness or content policies. |
| **Primary user**     | Anyone who needs the current time or to align schedules across countries, from mobile or desktop, without sign-up.                                           |
| **Differentiator**   | Synchronized comparator: up to 4 countries, anchor country with local date/time control, instant equivalents (incl. DST).                                    |

Functional flows (F1–F5), SEO requirements, a11y, performance, and acceptance criteria **are the source of truth** in `micrositio-hora-mundial-comparador.md`; this report **does not replace** them—it only sets **technical bootstrap** and front-end architecture aligned with that specification.

---

## 3. Agreed stack

| Area                 | Decision                                                                           |
| -------------------- | ---------------------------------------------------------------------------------- |
| Framework            | Next.js with **App Router**                                                        |
| Code location        | Entire app under **`src/`** (`src/app`, `src/components`, etc.)                    |
| Packages and scripts | **Bun** (`bun install`, `bun run …`); lockfile `bun.lock`                          |
| Forms                | **react-hook-form** (anchor date/time, searches, accessible selects)               |
| React optimization   | **Million** (`million` + `million/compiler` in `next.config`)                      |
| Styles               | **Global CSS** (tokens, minimal reset) + **CSS Modules** per component             |
| UI organization      | **Atomic design** as folder reference (atoms → organisms)                          |
| Inputs and HTML      | **sanitize-html** with an allowlist wherever there is reflection or untrusted HTML |
| Icons                | **react-icons** (imports from submodules, e.g. `react-icons/fi`)                   |

### 3.1 Mandatory repository note

`AGENTS.md` states that the Next version in use may differ from generic knowledge: before implementing routes, the Metadata API, or i18n, **read the guide under `node_modules/next/dist/docs/`** for the installed version and heed deprecation notices.

---

## 4. Architectural impact

### 4.1 Front end

- **Server Components by default:** listings, SEO copy, layouts, static data, metadata.
- **Client Components** (`'use client'`): live clock, comparator state (UTC instant), RHF integration, `aria-live` regions for time updates, optional `localStorage` for zone selector in multi-zone countries.
- **First render:** HTML with title, H1, and crawlable body; “to the minute” time can be refined on the client without breaking the page’s main message.

### 4.2 Data

- **Versioned in-repo dataset** (JSON/TS): country (ISO 3166-1 alpha-2) → list of IANA zones; validation script; no mandatory API in MVP for the country–zone map.
- **Localized names:** `Intl.DisplayNames` (and fallback) aligned with the product’s eight locales.

### 4.3 Internationalization

- Locales: **en, es, fr, pt, de, ja, it, ko** in UI, metadata, and routes (e.g. `[locale]` segment under `src/app`).
- **hreflang**, **`x-default`**, canonical URLs, and multilingual sitemap per the product specification.

### 4.4 SEO and performance

- Unique metadata per country + language combination and comparator page.
- Reserved slots for ads (CLS control).
- Core Web Vitals targets aligned with the product doc; Million as an additional layer after a stable baseline.

### 4.5 Security

- In MVP there is no server-side persistence of forms, but any **reflected string** or **HTML built from input** must avoid XSS: **do not** use `dangerouslySetInnerHTML` with unsanitized content.
- Prefer **text in React nodes**; if HTML/markdown exists, pipe through **`sanitize-html`** with **fixed, reviewed** options (minimal allowlist). When possible, sanitize on the **server** (RSC, Server Action, route handler).

---

## 5. Proposed folder structure (`src/`)

```
src/
  app/
    [locale]/
      layout.tsx
      page.tsx
      countries/
        page.tsx
        [countryCode]/
          page.tsx
      compare/
        page.tsx
    manifest.ts | robots.ts | sitemap.ts   # per Next version APIs
  components/
    atoms/
    molecules/
    organisms/
    templates/                               # optional
  lib/
    time/
    i18n/
    seo/
    sanitize.ts
  data/
    countries-zones.json
  styles/
    globals.css
```

**Atomic design:** granularity drives placement; **domain logic** (e.g. comparator UTC state) lives in `src/lib` or `src/hooks`, not in atoms.

---

## 6. Configuration and conventions

### 6.1 Bun

- Initialize or maintain the Next project with App Router and TypeScript.
- Document in the README that local and recommended CI flow is **Bun** (avoid unnecessary mixing with npm/yarn).

### 6.2 Million and `src/app`

- Wrap Next config with `million.next(nextConfig, millionConfig)`.
- With **`src/app`**, explicit **RSC** configuration may be needed (e.g. flags like `auto: { rsc: true }` per Million docs and version). **Bar:** successful `bun run build`; if regressions occur (HMR, hydration), document version pin or workaround.

### 6.3 react-hook-form

- Use **uncontrolled** mode where it reduces re-renders in long lists.
- **Molecules** with `label`, `aria-describedby`, and accessible error messages.
- Anchor date/time validation consistent with MVP (1-minute steps, midnight crossings).

### 6.4 CSS and CSS Modules

- `globals.css`: design variables, visible focus, `color-scheme` if applicable.
- Components: co-located `*.module.css` or by-folder.
- No Tailwind unless explicitly decided later.

### 6.5 react-icons

- Scoped imports per icon family; optional atomic wrappers with size and `aria-hidden` for decorative icons.

### 6.6 sanitize-html

- Central module `src/lib/sanitize.ts` exporting a single function (e.g. `sanitizeUserHtml`) with **immutable project options**.
- Tests with typical vectors (`<script>`, event handlers, `javascript:` in URLs where applicable).

---

## 7. Recommended implementation plan

1. Bootstrap Next (App Router) + `src/` + TypeScript + Bun.
2. Integrate **Million** and validate build with `src/app`.
3. Base styles, layout with stable ad regions (CLS).
4. Country ↔ IANA data + validation + TS types.
5. i18n, locale routes, metadata, and hreflang.
6. Listing and country pages with anti–thin SEO templates from the product doc.
7. Comparator: single UTC model, RHF, multi-zone, optional selector persistence.
8. XSS surface review; systematic sanitize where HTML or reflection exists.
9. QA: DST tests, axe, mobile Lighthouse, eight-language checklist, and sitemap.

---

## 8. Acceptance criteria (product + bootstrap)

The **testable criteria** in `micrositio-hora-mundial-comparador.md` (per-language URLs, 2–4 country comparator, a11y, vitals, sitemap, ads) remain in force.

**Additional bootstrap criteria:**

- [ ] All relevant application code lives under **`src/`**.
- [ ] Documented workflow with **Bun**.
- [ ] **Million** integrated and build verified; any `src/app` workaround documented.
- [ ] Key forms use **react-hook-form** with accessible patterns.
- [ ] Styles with **global CSS + CSS Modules**; components organized per **atomic design**.
- [ ] **sanitize-html** centralized; no unsanitized user HTML at render.
- [ ] Icons via **react-icons** with scoped imports.

---

## 9. Risks and assumptions

| Risk / topic                  | Note                                                                                         |
| ----------------------------- | -------------------------------------------------------------------------------------------- |
| Million + App Router + `src/` | May require specific flags or versions; prioritize build stability.                          |
| sanitize-html on the client   | Assess bundle weight; prefer server-side sanitization when the flow allows.                  |
| DST and dates                 | Align with runtime APIs and keep tests on boundary dates in the product specification.       |
| “Country” and territories     | Same as product doc: agreed ISO 3166-1 alpha-2 list and MVP rules for dependent territories. |

---

## 10. Internal references

- Product specification: `spects/micrositio-hora-mundial-comparador.md`
- Visual design (if applicable to UI): `spects/design-spec-world-clock-microsite.md`
- Architecture agent: `.claude/agents/architect.md`
- Repo Next rules: `AGENTS.md`
