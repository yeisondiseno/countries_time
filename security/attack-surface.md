# Attack Surface Map

## Routes (browser-accessible)

| Route | Dynamic input | Client component | Notes |
| --- | --- | --- | --- |
| `/[locale]` | `locale` | Partial | Locale whitelist via `hasLocale` |
| `/[locale]/compare` | `?a=`, `?b=` | `WorldComparator` | Codes resolved via `findCountry` whitelist |
| `/[locale]/countries/[countryCode]` | `countryCode` | `CountryPageHero` | Tier 3 → `noindex`; all tiers still served |
| `/[locale]/guides` | — | — | Static article list |
| `/[locale]/guides/[slug]` | `slug` | — | Exact match against `GUIDE_SLUGS`; else 404 |
| `/[locale]/contact` | — | — | Public email in messages |
| Legal (`/privacy`, `/terms`, `/about`) | — | — | Static |

## Middleware / Proxy (`src/proxy.ts`)

- next-intl locale routing
- 301 uppercase country code → lowercase
- 308 locale-prefixed icon redirect
- Matcher excludes static assets, `api`, `sitemap.xml`, `robots.txt`

## Client Storage

| Key | Component | Data | Validation |
| --- | --- | --- | --- |
| `countries-time-theme` | ThemeProvider, inline script | `light` \| `dark` | Whitelist on read |
| `countries-time-hour-format` | TimeFormatProvider, inline script | `12h` \| `24h` | Whitelist on read |
| `countries-time:cookie-consent` | CookieConsentBanner | `all` \| `essential` | No downstream gating observed |
| `countries-time:world-comparator-form` | WorldComparator | Form JSON | `parseStoredWorldComparatorForm` whitelist |

## Third-Party Scripts

| Integration | File | Consent-gated | SRI |
| --- | --- | --- | --- |
| Vercel Analytics | `src/app/layout.tsx:53` | **No** | N/A (Next component) |
| AdSense (future) | `src/lib/ads/config.ts`, `AdSlot` | **No** (banner exists, not wired) | Not implemented |

## Dangerous DOM Sinks

| Location | Pattern | User-controlled? |
| --- | --- | --- |
| `src/lib/seo/JsonLd.tsx:9` | `dangerouslySetInnerHTML` + `JSON.stringify` | Indirect (i18n/editorial static) |
| `src/app/layout.tsx:43-45` | Inline boot script | No (fixed string) |

## Environment (client-exposed)

| Variable | Purpose | Secret? |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin | No (public) |
| `NEXT_PUBLIC_ADS_ENABLED` | Ad feature flag | No |

## Forms / Inputs

- `ComparatorCountryPicker` → `Input` with `sanitizeInputChange`
- No auth forms, file uploads, or rich-text CMS
