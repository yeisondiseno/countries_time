# Threat Model — Countries Time

## Engagement

| Field | Value |
| --- | --- |
| **Target** | `c:\Users\USUARIO\Documents\side_proyects\countries_time` — GSC HTML verification meta (uncommitted `src/app/layout.tsx`) |
| **Stack** | Next.js App Router, React, next-intl, Vercel Analytics, AdSense gated off |
| **Data classes** | Public country/timezone metadata, editorial copy, contact email (public), theme/preference localStorage, comparator form state, **public GSC ownership token** |
| **Conformance** | OWASP ASVS 4.0 Level 2 + OWASP Top 10 2021 |
| **Auth** | None — static informational site |
| **Assumptions** | Production on Vercel; `NEXT_PUBLIC_SITE_URL` set in production builds; ads remain disabled |

### Delta (2026-08-31)

Root layout Metadata API adds `verification.google`. Trust boundary: browser HTML `<head>` exposes a public Google Search Console HTML-tag token. Googlebot fetches the site to prove DNS/HTTP ownership. No new third-party script, no secrets, no auth.

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
- Domain ownership proofs (GSC HTML token is public by design; do not treat as a credential)
