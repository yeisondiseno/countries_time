# Data Leakage Report

## Client Environment Variables

| Variable | File | Leaked to browser? | Sensitive? | Verdict |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `src/lib/seo/site-origin.ts:4` | Yes | No (public canonical URL) | ✅ OK |
| `NEXT_PUBLIC_ADS_ENABLED` | `src/lib/ads/config.ts:3` | Yes | No (boolean flag) | ✅ OK |
| `VERCEL_*` | `site-origin.ts` (server fallback) | No (build-time only) | No | ✅ OK |

**No secrets, API keys, or tokens found in `NEXT_PUBLIC_*` or client bundles.**

## localStorage / sessionStorage

| Key | Sensitive data? | XSS exfiltration risk | Verdict |
| --- | --- | --- | --- |
| `countries-time-theme` | No | Low (preference only) | ✅ OK |
| `countries-time-hour-format` | No | Low | ✅ OK |
| `countries-time:cookie-consent` | No | Low | ✅ OK |
| `countries-time:world-comparator-form` | No (country codes, dates) | Low | ✅ OK |

**No JWT, session tokens, or PII stored.**

## JSON-LD / Metadata / RSC

| Source | Data exposed | Risk |
| --- | --- | --- |
| `buildWebPageJsonLd` | Title, description, URL | Public SEO — OK |
| `buildArticleJsonLd` (guides) | Headline, dateModified | Public — OK |
| `buildFaqPageJsonLd` | FAQ Q&A | Public — OK |
| Contact page | Email **not** in JSON-LD | ✅ OK |
| `messages/*.json` via `NextIntlClientProvider` | All UI strings including `contactEmail` | Public by design |

## Analytics

| SDK | Data sent | PII scrubbed? | Consent? |
| --- | --- | --- | --- |
| `@vercel/analytics` | Page views, Web Vitals | Default (no explicit PII) | ❌ Not gated |

## Third-party script inventory

1. **Vercel Analytics** — loaded unconditionally in root layout
2. **AdSense** — disabled (`isAdsEnabled()` → false); placeholder UI only

## Bundle / source maps

- Not audited in production build artifacts in this pass
- Recommend: verify production deploy does not expose `.map` files with internal paths

## Query strings

- `?a=` / `?b=` — country codes only; not logged in client analytics explicitly
- No tokens or PII in URLs observed

## Recommendations

1. Gate analytics/ads on cookie consent (SEC-004)
2. Harden JsonLd serialization (SEC-003)
3. Add CSP to limit exfiltration if XSS occurs (SEC-001)
