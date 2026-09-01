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
| `countries-time-theme` | ThemeProvider, `theme-boot.js` | `light` \| `dark` | Whitelist on read |
| `countries-time-hour-format` | TimeFormatProvider, `theme-boot.js` | `12h` \| `24h` | Whitelist on read |
| `countries-time:cookie-consent` | CookieConsentBanner | `all` \| `essential` | Gates Analytics + AdSense load |
| `countries-time:world-comparator-form` | WorldComparator | Form JSON | `parseStoredWorldComparatorForm` whitelist |

## Third-Party Scripts

| Integration | File | Consent-gated | SRI |
| --- | --- | --- | --- |
| Vercel Analytics | `ConsentAnalytics.tsx` | **Yes** (`allowsAnalytics`) | N/A (Next component) |
| AdSense loader | `ConsentAdSenseScript.tsx` | **Yes** (load) | No (Google rotates) |
| AdSense units | `AdSlot.tsx` | **Yes** (render) | N/A |
| Theme boot | `public/theme-boot.js` | N/A (first-party) | No |

## Dangerous DOM Sinks

| Location | Pattern | User-controlled? |
| --- | --- | --- |
| `src/lib/seo/JsonLd.tsx:11` | `dangerouslySetInnerHTML` + `serializeJsonLd` | Indirect (i18n/editorial static); hardened |
| `ConsentAdSenseScript.tsx:25-30` | Dynamic `script` append | No (env + fixed Google URL) |
| `AdSlot.tsx:49-56` | `<ins data-ad-*>` attrs | No (env only) |

## Environment (client-exposed)

| Variable | Purpose | Secret? |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin | No (public) |
| `NEXT_PUBLIC_ADS_ENABLED` | Ad feature flag | No |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Publisher ID (`ca-pub-*`) | No (public by design) |
| `NEXT_PUBLIC_ADSENSE_SLOT_*` | Ad unit IDs | No (public by design) |

## Forms / Inputs

- `ComparatorCountryPicker` → `Input` with `sanitizeInputChange`
- No auth forms, file uploads, or rich-text CMS
