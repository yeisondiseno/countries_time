# Component catalog (`src/components`)

| Path                         | Component                                                       |
| ---------------------------- | --------------------------------------------------------------- |
| `providers/ThemeProvider`    | Light/dark theme (`data-theme` + localStorage)                  |
| `molecules/Toggle`           | Accessible collapsible section (title, meta, panel)             |
| `molecules/ThemeToggle`      | Sun/moon toggle in the header                                   |
| `molecules/TimeDisplay`      | Time hero (mono, `aria-live`, day/night)                        |
| `molecules/MultiZoneNotice`  | Notice + IANA zone selector                                     |
| `molecules/AdSlot`           | CLS-safe ad placeholder                                         |
| `molecules/LocaleSwitcher`   | Language selector (endonyms)                                    |
| `organisms/SiteHeader`       | Sticky header, pill nav, tools                                  |
| `organisms/AppShell`         | Global shell (skip link, ads, footer)                           |
| `organisms/CountryDirectory` | Searchable list grouped by region                               |
| `organisms/CountryPageView`  | T-Country template (hero, FAQ, promo)                           |
| `organisms/WorldComparator`  | Card-based comparator (2–4 countries)                           |
| `atoms/Input`                | Native `<input>` with `sanitizeUserHtml` + `sanitizeInputValue` |
| `atoms/LiveClock`            | Legacy clock (replaced by `TimeDisplay` on new pages)           |

Copy lives in `messages/{locale}.json`; routing in `src/i18n/routing.ts`.

Import from `@/components` (barrel). Layer barrels: `@/components/atoms`, `@/components/molecules`, `@/components/organisms`.
