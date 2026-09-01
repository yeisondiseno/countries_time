# Threat Model — Countries Time

## Engagement

| Field | Value |
| --- | --- |
| **Target** | `c:\Users\USUARIO\Documents\side_proyects\countries_time` — remediation AdSense "low value content" |
| **Stack** | Next.js 16.2.6, React 19.2.0, next-intl 4.12.0, Vercel Analytics, future AdSense |
| **Data classes** | Public country/timezone metadata, editorial copy, contact email (public), theme/preference localStorage, comparator form state |
| **Conformance** | OWASP ASVS 4.0 Level 2 + OWASP Top 10 2021 |
| **Auth** | None — static informational site |
| **Assumptions** | Production on Vercel; `NEXT_PUBLIC_SITE_URL` set in production builds |

## Trust Boundaries

```
[User Browser]
    ↔ [Next.js App Router / RSC / Client Components]
    ↔ [localStorage] (theme, hour format, cookie consent, comparator form)
    ↔ [Vercel Analytics CDN] (third-party script)
    ↔ [Future: Google AdSense CDN]
```

## In-Scope Changes (Remediation Plan)

- Guide pages (`src/app/[locale]/guides/**`)
- Country detail metadata / noindex tier 3
- `CountryPageHero`, `CountryPageEditorial`
- `CookieConsentBanner`, `AppShell`
- `WorldComparator` query params + localStorage
- Editorial data (`guides/**`, `country-tiers.ts`, `country-editorial-generated.ts`)
- SEO (`sitemap.ts`, `json-ld.ts`)
- `messages/*.json`, `src/proxy.ts`

## Threat Actors

1. **External attacker** — reflected XSS via URL params, open redirect, JSON-LD breakout
2. **Supply-chain** — compromised npm package or third-party script
3. **Privacy adversary** — analytics/ads tracking without consent

## Assets to Protect

- User browser integrity (no XSS)
- Editorial/site reputation (no defacement via injection)
- Visitor privacy (consent-gated third parties)
- Build/deploy integrity (no secret leakage in client bundle)
