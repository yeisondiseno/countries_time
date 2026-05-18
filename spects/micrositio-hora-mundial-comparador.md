# Specification — Country time microsite + comparator (SEO traffic / Google Ads)

**Version:** 1.0  
**Product (working name):** Countries Time — world clock and country comparator  
**Source agent:** digital-project-ceo

---

## Purpose and problem

- **Business:** drive **large, recurring organic traffic** (queries such as “time in X”, time-zone conversions, international meetings) to **monetize with Google Ads**, while keeping pages useful and aligned with content policies.
- **Primary user:** anyone checking the current time in another country—travelers, remote teams, language learners, people who need to **align schedules across countries**.
- **Moment of use:** quick search from mobile or desktop; expectation of **immediate, clear answers** (low friction, no sign-up).

**Differentiator:** a **synchronized comparator** where the user picks up to **4 countries**, adjusts the **reference** local time in one of them, and **instantly** sees the equivalent in the others (respecting zones and DST).

---

## Hypotheses and success

**Hypotheses**

1. **Long-tail** pages per country + language capture stable search volume.
2. The comparator increases **time on page**, **pages per session**, and **direct return visits**—positive signals for SEO and ad inventory without harming UX.

**Metrics / success signals (weeks 0–8)**

| Area          | Indicator                                                        |
| ------------- | ---------------------------------------------------------------- |
| SEO           | Impressions/clicks in Search Console; indexing of key URLs       |
| Performance   | LCP < 2.5 s on mobile (target); stable INP on interactions       |
| Ads           | RPM/eCPM and policy compliance—no strikes (substantial content)  |
| Product       | Comparator usage (% sessions); countries selected per session    |
| Accessibility | Zero critical axe errors / manual keyboard + screen reader audit |

**North-star (product):** sessions where users complete **viewing a country’s time** or **comparing ≥2 countries** without bouncing in the first 10 seconds.

---

## Increment scope (recommended MVP)

### In scope

1. **Directory / country list** linking to a **per-country page**: current time, local date, primary IANA zone label (visible for technical transparency), approximate offset vs the user (optional via `Intl` detection).
2. **Country page** (one canonical URL per country and locale) with non-generic useful content: country name, capital (context), **live current time** (refresh every minute or client-side without breaking crawlable initial HTML).
3. **Comparator** (dedicated page + optional CTA from country pages):
   - Pick **2–4 countries** (minimum 2).
   - **Anchor country** (reference): user adjusts **local time of day** there (accessible control: time list or slider + date when needed).
   - **Other countries** show the matching local time for the **same absolute instant** (DST included)—see functional flows for date display rules.
4. **Internationalization:** locales `en`, `es`, `fr`, `pt`, `de`, `ja`, `it`, `ko` across **all UI**, metadata, and routes or prefixes (see i18n section).
5. **Accessibility by default:** target **WCAG 2.2 Level AA** on custom components (see a11y section).
6. **Technical and editorial SEO baseline:** metadata, hreflang, sitemap, core structured data, non–thin content on country pages.

### Explicitly out of scope (MVP)

- User accounts, server-side saves, ICS calendars.
- Alarms, complex countdowns, per-country historical DST explainers (short generic FAQ allowed).
- Native apps.
- Comparator with more than 4 countries at once.
- “Official time” for every administrative subdivision (country-level only; edge cases under assumptions).

---

## Functional flows and requirements (minimum)

### F1 — Browse and open a country

1. User lands from SEO on a **country page** or list.
2. Sees **correct current time** for the zone(s) defined for that country.
3. Can switch language while keeping the **same country entity** consistent.

### F2 — Countries with multiple time zones

- If a country has **more than one relevant IANA zone** (e.g. United States, Russia, whether overseas territories are grouped):
  - **MVP:** on the country page show a **zone selector** (list from curated static data) **or** **primary zone time + notice** (“This country has multiple zones”) with link to the selector.
  - The comparator must use the **selected zone** for that country (optional `localStorage` persistence).

### F3 — Comparator (core)

1. User adds **2–4 countries** (search by localized name + optional ISO code).
2. By default, **anchor country** = first added (switchable via “Use as reference”).
3. **Anchor time control:**
   - Pick **date** (today by default) and **local time** (accessible inputs; 1-minute steps).
   - Other countries show **local date and time** for that same absolute instant (internal UTC timestamp).
4. When changing countries in the set, if the anchor is invalid, **keep the current UTC instant** in the model until the user adjusts again.
5. **Clear copy:** “When it’s HH:MM on [date] in [Country A], in [Country B] it’s…”.

### F4 — Multilingual

- **100%** UI string coverage across all 8 languages.
- Country names from **CLDR or equivalent** per locale (avoid ad-hoc manual-only translation).
- Time/date formatting via **`Intl.DateTimeFormat`** per locale (12/24 h user toggle optional later; **MVP:** follow locale).

### F5 — Google Ads (product)

- Defined slots (e.g. leaderboard + responsive in-content) with **reserved layout** to limit CLS.
- Primary answer (time) visible **without mandatory scroll** on a typical mobile viewport (“intent match”—early visibility).

---

## Non-functional requirements

### SEO (high priority)

| Requirement     | Detail                                                                                                   |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| Initial render  | HTML with **meaningful** server-rendered content (time may hydrate; bots must see unique title/H1/body). |
| URLs            | Stable, readable; one per country+locale pair (`hreflang` reciprocity).                                  |
| Metadata        | Unique `title` and `description` per country page and comparator page (per language).                    |
| hreflang        | Tags for all 8 equivalents + `x-default` (define strategy: English vs detection).                        |
| Sitemap         | Locale + priority country URLs; static update or ISR.                                                    |
| Structured data | `WebSite` + `WebPage`; optional `FAQPage` only with real, useful FAQs.                                   |
| Core Web Vitals | Target green field data when traffic exists; optimized images, `font-display`, minimal critical JS.      |
| Canonical       | One canonical URL per logical resource; no HTTP/www duplicates.                                          |
| robots          | `allow` monetizable content; block only technical routes if any.                                         |

**Anti-thin editorial:** each country page includes at least: **H1**, unique intro paragraph (template + variable data allowed), **time block**, **zone(s)**, **link to comparator**, **2–4 short FAQs** where repeatable without fabricated facts.

### Accessibility (default)

- **AA** contrast on text and UI; visible focus on all interactive controls.
- Logical **tab order** on country list, comparator pickers, and time controls.
- Associated labels (`label` / `aria-labelledby`); **announce** live time updates (`aria-live="polite"` in a bounded region).
- **Do not rely on color alone** for state (optional day/night: add icon or text).
- Touch targets ≥ 44×44 px where applicable.
- **200% zoom** without loss of functionality.
- **NVDA / VoiceOver** testing on comparator flow and language switching.

### Performance and robustness

- Country/zone list from a **versioned dataset** in-repo (JSON from a reliable source) to avoid drift.
- Client-side calculations after hydration acceptable; **single UTC instant** as source of truth in the comparator.
- Unit tests on **DST boundaries** (e.g. switch day) for representative zone pairs.

### Legal / trust

- **Accuracy** disclaimer (“for guidance”; IANA/OS sources).
- Cookie/consent policy where Ads requires it (EU/UK—delegate legal copy to standard templates).

---

## Dependencies and data

| Data                     | Suggested source                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------- |
| Country → IANA zone list | Curated dataset (e.g. from `tzdata` + ISO mapping; validate multi-zone countries).  |
| Localized names          | CLDR (`Intl.DisplayNames` + fallback).                                              |
| SEO keywords             | Per-language research (GSC + Search suggestions); title templates without stuffing. |

**No mandatory backend in MVP** if Ads and content are static/ISR; analytics via official script with consent where required.

---

## Assumptions and risks

**Assumptions**

- “Country” = **ISO 3166-1 alpha-2** with a project-agreed list (decide handling of dependent territories in v1).
- Users accept that the **same clock time** across cities can span **different calendar dates** near midnight; the UI must show an **explicit date** on each comparator card.

**Risks**

| Risk                               | Mitigation                                                               |
| ---------------------------------- | ------------------------------------------------------------------------ |
| Duplicate content across languages | Per-locale copy variants + unique per-country data; strict hreflang.     |
| “Thin content” penalty             | Useful paragraphs + honest FAQs + comparator as real utility.            |
| Multi-zone complexity              | Explicit selector + local persistence.                                   |
| DST / date bugs                    | Tests + maintained library or Temporal when available in target runtime. |
| Google Ads / content policies      | Avoid layouts that hide content from bots; meet useful-content policies. |

---

## Recommended work order

1. **Data:** country ↔ IANA zones table + target official country list; validation script.
2. **URL architecture + i18n:** routes, `hreflang`, SSR/ISR per repo stack (**read `node_modules/next/dist/docs/`** if using Next.js).
3. **UI shell:** accessible layout, language navigation, CLS-safe Ad placeholders.
4. **Country pages + list:** SEO templates, structured data.
5. **Comparator:** UTC state, accessible UI, DST cases.
6. **QA:** axe/Lighthouse, Search Console checks, manual checklist for 8 languages.
7. **Iterate:** add support/guide pages only after baseline metrics.

---

## Acceptance criteria (testable)

- [ ] Each target country has a unique URL per **all 8** languages with unique `title`/`description` and reciprocal hreflang.
- [ ] List and pages show **consistent current time** for the selected zone (manual check vs a simple reference).
- [ ] Comparator supports **2–4 countries**, **anchor** switching, and correct sync when moving anchor time (including **midnight crossing** in defined test cases).
- [ ] **100%** visible strings translated for `en`, `es`, `fr`, `pt`, `de`, `ja`, `it`, `ko`.
- [ ] Accessibility audit: **no critical** axe errors; full keyboard navigation; screen readers announce comparator result changes.
- [ ] LCP and CLS meet targets in mobile Lighthouse on country and comparator pages (production-like environment).
- [ ] Sitemap includes all locale variants for priority country pages + comparator page.
- [ ] Ads layout: reserved space without large layout jumps when creatives load.

---

## Implementation note (repo stack)

This repo’s `AGENTS.md` calls out non-standard **Next.js** behavior: before building, **read the guide under `node_modules/next/dist/docs/`** and align routing, Metadata API, and i18n conventions with that exact version.

---

## Deliverable

Single reference document for **architect** (routing, data, performance), **frontend** (UI, i18n, a11y), **seo-organic-expert** (keywords, GSC, snippets), and implementation.
