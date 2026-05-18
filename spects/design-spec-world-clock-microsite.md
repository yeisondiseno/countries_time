# Design specification — Countries Time (world clock + comparator)

**Version:** 1.0  
**Derived from:** [`micrositio-hora-mundial-comparador.md`](./micrositio-hora-mundial-comparador.md)  
**Audience:** Product design, UI engineering, brand (if any)

---

## 1. Traceability

This document translates the product spec into **layout, components, visual language, and interaction patterns**. Anything not listed here defers to the parent specification (functional scope, locales, SEO structure, WCAG 2.2 AA targets, Ads CLS rules).

---

## 2. Design principles

| Principle                   | Design implication                                                                                                                                                   |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Answer first**            | The **current local time** is the primary focal object on country pages; typography and hierarchy favor digits + date over chrome.                                   |
| **Comparator as hero tool** | On the comparator route, the **synchronized grid** is above the fold on mobile after a minimal header (per product: intent visible without forced scroll).           |
| **Trust & clarity**         | Show **explicit date** next to every time in the comparator; zone label visible but secondary (caption style).                                                       |
| **Ads-safe layout**         | Reserve **fixed min-heights** for ad regions; never overlay ads on primary time content; avoid animating containers that hold ads.                                   |
| **Global readability**      | Layouts must tolerate **long translations** (German), **compact scripts** (JA/KO), and **RTL-free** MVP (all 8 locales are LTR—keep components LTR-safe for future). |
| **Accessibility is layout** | Hit targets, focus order, and zoom behavior are **non-negotiable** constraints in every mockup—not post-hoc fixes.                                                   |

---

## 3. Information architecture & templates

### 3.1 Global shell (all pages)

- **Header:** logo / wordmark → primary nav: **All countries** | **Comparator** (labels localized).
- **Language control:** persistent switcher (see §7); changing language preserves **country entity** where applicable.
- **Footer:** legal links (privacy, cookies/consent if required), accuracy disclaimer (short), optional secondary links.
- **Skip link:** “Skip to main content” as first focusable element.

### 3.2 Page types

| Template                  | Purpose               | Primary hero                        |
| ------------------------- | --------------------- | ----------------------------------- |
| **T-Home** (optional MVP) | Entry + shortcuts     | Links to comparator + browse        |
| **T-Country-list**        | SEO hub / browse      | Search + scrollable index           |
| **T-Country**             | Long-tail landing     | Live time block + context           |
| **T-Comparator**          | Differentiator        | 2–4 country cards + anchor controls |
| **T-Legal**               | Policy / consent copy | Plain article typography            |

_If MVP ships without T-Home, search traffic lands on **T-Country** or **T-Country-list**._

---

## 4. Layout priorities by viewport

### 4.1 Mobile (default)

- Single column; **sticky minimal header** optional (avoid hiding primary content).
- **Above-the-fold stack (T-Country):** H1 → time block → primary CTA (“Compare with other countries”) → optional leaderboard placeholder → intro paragraph → FAQs → in-content ad placeholder.
- **Above-the-fold stack (T-Comparator):** page title + short helper → **country slot row/column** → anchor controls → results grid.

### 4.2 Tablet / desktop

- Country page: optional **two-column** layout below hero (main column: content + FAQs; side column: comparator promo + secondary ad placeholder)—only if side column does not push time below fold on typical laptop heights.

**Breakpoints (suggested):** `640px`, `1024px` (tune during implementation).

---

## 5. Component inventory & behavior

### 5.1 `TimeDisplay` (country page hero)

- **Elements:** local time (dominant numeral size), calendar date, weekday optional, **zone string** (muted).
- **States:** loading skeleton (structured, same dimensions as final text to reduce CLS); error (“Unable to refresh—showing last known” if product allows).
- **Live updates:** subtle change (no flashy animation); `aria-live="polite"` region scoped to this block.

### 5.2 `MultiZoneNotice` + `ZoneSelector`

- Inline notice pattern: icon + short text + **“Choose zone”** expand or jump link.
- Selector: native `<select>` acceptable if styled with AA contrast; combobox acceptable if fully accessible (listbox, arrows, typeahead).

### 5.3 `CountrySearch`

- Used on list + comparator add flow.
- Typeahead list: keyboard navigable; debounced; shows **localized country name** + optional ISO code in secondary text.
- Empty state: “No matches—try another spelling.”

### 5.4 `CountryList` (browse)

- Virtualized or paginated list if needed for perf; each row: country name, **current time** (optional preview), chevron.
- Region grouping optional post-MVP.

### 5.5 `ComparatorSlot` (×4 max)

Each slot represents **one selected country** (or empty invite).

**Filled state:**

- Country name (title).
- **Local date** + **local time** (same visual weight as country page or slightly reduced—not smaller than body minimum).
- Zone caption.
- **Badge:** “Reference” when anchor (not color-only; includes text label).
- Actions: remove slot; “Set as reference” (when not anchor).

**Empty state:**

- Dashed affordance “Add country”; opens search or drawer.

**Interaction rules:**

- Minimum **2 filled slots** before comparator is “active”; if user removes below 2, show inline validation (localized).

### 5.6 `AnchorControls`

- **Date picker:** accessible (native date input acceptable if localized correctly); manual entry fallback.
- **Time control:** prefer **accessible time input** (`input type="time"`) or separate hour/minute selects if `type="time"` is weak in target browsers—design must show chosen pattern consistently.
- Helper text: one line explaining anchor (“Times below update when you change the reference country’s date and time”).
- Changing anchor country **does not** reset date/time unless product logic requires—mirror engineering spec (preserve UTC instant).

### 5.7 `ComparatorSummary`

- Sentence pattern from product spec: _“When it’s … in [A], in [B] it’s …”_ — design as optional **summary strip** above cards for cognitive reinforcement (sr-visible duplication acceptable if noisy visually).

### 5.8 Editorial blocks (SEO)

- **Intro paragraph:** readable measure (~65–75ch max width on large screens).
- **FAQ:** accordion or headings+answers; if accordion, enforce keyboard + expanded/collapsed state visibility (not icon-only).

### 5.9 `AdPlaceholder`

- Named slots: **leaderboard-top**, **in-content-mid**, **sidebar-desktop** (if used).
- Each placeholder has **min-height** defined in design tokens (e.g. 90px mobile leaderboard common sizes—confirm with ad partner).
- Background: neutral subtle **only if** it does not mimic ad creative (policy-safe).

---

## 6. Visual foundation

### 6.1 Typography

- **Primary numerals:** tabular lining figures for times (`font-variant-numeric: tabular-nums`) to prevent jitter on updates.
- **Locales:** test **JA/KO** line-height and baseline; avoid ultra-tight leading on CJK.
- **Scale:** define a modular scale (e.g. 14 / 16 / 20 / 28 / 40); **minimum body 16px** on mobile for readability.
- **Avoid:** decorative fonts for core time digits (legibility > brand flourish).

### 6.2 Color

- **Semantic tokens:** `text-primary`, `text-muted`, `surface`, `surface-elevated`, `border`, `focus-ring`, `danger`, `success` (sparingly).
- **Contrast:** meet **AA** for text; **3:1** for UI components and graph icons per WCAG.
- **Day/night hint (optional):** if used, pair hue change with **sun/moon icon + text label** (“Night” / “Day”).

### 6.3 Iconography

- Simple line icons (globe, clock, compare/swap, chevron); SVG preferred; each decorative icon `aria-hidden="true"` with adjacent text.

### 6.4 Spacing & rhythm

- 8px base grid; generous vertical spacing around **TimeDisplay** (attention + touch).

### 6.5 Motion

- **Minimal:** respect reduced motion (`prefers-reduced-motion`); no autoplay distractions near ads.
- Time updates: optional 150ms crossfade **only if** CLS-neutral.

---

## 7. Language switcher (UX)

- **Placement:** header; persistent on scroll.
- **Pattern:** menu or modal list of the 8 locales with **endonym** + optional English hint (e.g. “日本語”).
- On **T-Country**, switching language navigates to **same country code** path with new locale prefix.
- Visual state: current locale clearly labeled (not flag-only—flags ≠ languages).

---

## 8. Comparator — detailed arrangement

### 8.1 Grid

- **Mobile:** stacked cards (anchor card first **or** pinned summary—pick one pattern and keep consistent; recommended: **anchor card first** with highlighted border + “Reference” badge).
- **Desktop:** 2×2 grid when 4 countries; 2×1 or 1×2 when 2–3; maintain reading order LTR matching DOM order for SR.

### 8.2 Anchor emphasis

- Distinct **outline** (2px) + **badge**; focus moves logically from anchor controls to results after change.

### 8.3 Errors & edge cases (visible design)

- DST ambiguity: show footnote icon linking to short FAQ entry (“Times follow current zone rules”).
- Invalid time during DST gap (if possible in UX): inline error on anchor control with suggested correction.

---

## 9. Content hierarchy (SEO-visible)

| Region       | Tag          | Notes                                                  |
| ------------ | ------------ | ------------------------------------------------------ |
| Page title   | `<title>`    | Unique per locale/page                                 |
| Main heading | `<h1>`       | Country name or comparator title                       |
| Sections     | `<h2>`       | FAQs, “About this time”, etc.                          |
| Time         | visible text | Must remain in initial meaningful HTML per parent spec |

---

## 10. Design deliverables checklist

- [ ] Wireframes: **T-Country-list**, **T-Country** (single + multi-zone), **T-Comparator** (2 / 3 / 4 countries).
- [ ] Hi-fi mocks: mobile + desktop for **T-Country** and **T-Comparator** (primary).
- [ ] UI kit: buttons, inputs, cards, badges, notice, FAQ, ad placeholders.
- [ ] Specs: spacing tokens, type scale, color tokens, focus ring style.
- [ ] Prototype (optional): comparator add/remove + anchor swap **keyboard path**.
- [ ] Handoff notes: `aria-live` regions, landmark roles (`header`, `main`, `footer`), tab order diagram.

---

## 11. Acceptance criteria (design QA)

Aligned with parent acceptance criteria plus:

- [ ] **Primary time** on **T-Country** visible on common mobile viewports (e.g. 390×844) **without scroll** beyond browser chrome + site header.
- [ ] All interactive targets ≥ **44×44 px** on touch surfaces.
- [ ] Comparator usable at **200% zoom** without horizontal scroll **or** with intentional single-axis scroll documented.
- [ ] No information conveyed by **color alone** for anchor vs non-anchor.
- [ ] Ad placeholders use **fixed min-heights** documented in design specs (CLS budget).
- [ ] Visual regression baseline for **en + ja + de** (long strings / CJK).

---

## 12. Open decisions (design × product)

Record choices in Figma or repo wiki:

1. Optional **T-Home** in MVP or redirect `/` to list/comparator.
2. Illustrations vs pure UI (illus affect LCP—defer if used).
3. Exact ad slot map per geography (EU consent banner impact on header height).

---

## References

- Parent: [`micrositio-hora-mundial-comparador.md`](./micrositio-hora-mundial-comparador.md)
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
