# AdSense pre-review checklist

Use this checklist **after deploying** all AdSense content changes and **before** requesting a new review in the AdSense panel.

**Production deploy verified:** 2026-08-31 (`https://www.countries-time.info`)

## Deployment gate (code)

- [x] `/guides` index and 17 guide articles live (10 editorial + 7 comparison pairs)
- [x] Home links to featured guides; footer links to `/guides`
- [x] Tier 3 country pages return `noindex, follow` and are **excluded** from `sitemap.xml`
- [x] Tier 1 (20) + Tier 2 (~50) countries in sitemap only (~70 × 8 locales)
- [x] Country editorial rendered in Server Components (`CountryPageEditorial`)
- [x] Comparator accepts `?a=ES&b=MX` deep links
- [x] Cookie consent banner visible (CMP prep; ads still disabled)
- [x] `NEXT_PUBLIC_ADS_ENABLED=false` in production
- [x] Theme boot moved to `/theme-boot.js` (SEC-006)
- [x] AdSense script gated by consent + env (SEC-007; inactive until approval)

Run automated checks anytime: `bun run verify:production`

## Google Search Console

- [ ] Submit updated `sitemap.xml`
- [ ] Request indexing for: `/en/guides`, `/en/about`, `/en/countries/es`, `/en/countries/mx`
- [ ] Monitor Tier 3 URLs dropping from index (`site:countries-time.info/countries/aw` etc.)
- [ ] No critical crawl errors

## Manual reviewer simulation (sample 10 URLs)

| URL | Value without widget? | ≥400 words in view-source? |
| --- | --- | --- |
| `/en` | | |
| `/en/guides/como-programar-reuniones-internacionales` | | |
| `/en/countries/es` | | |
| `/en/countries/ru` (Tier 2) | | |
| `/en/compare` | | |
| `/en/about` | | |
| `/en/contact` | | |
| `/en/guides/diferencia-horaria-espana-mexico` | | |
| `/es/countries/mx` | | |
| `/en/countries/aw` (Tier 3 — should be noindex) | | |

- [ ] No visible ad placeholders on any page
- [ ] Second-person review completed (not only the developer)

## Lighthouse (target SEO ≥ 95)

- [ ] `/en` (home)
- [ ] `/en/countries/us`
- [ ] `/en/guides/que-es-horario-verano`

## Maturation period (mandatory after 3 rejections)

| Day | Date | Action |
| --- | --- | --- |
| 0 | **2026-08-31** | Deploy all changes to production ✓ |
| 1–7 | Sep 1–7 | Do **not** request AdSense review |
| 7 | **2026-09-07** | Check GSC indexed pages count |
| 14 | **2026-09-14** | Verify Tier 3 de-indexing progress |
| **30** | **~2026-09-30** | If all boxes above are checked → AdSense → Sites → Request review |

## After approval only

1. Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` and slot IDs in Vercel env
2. Set `NEXT_PUBLIC_ADS_ENABLED=true`
3. Ads load only after cookie consent (Accept)
4. Respect cookie consent before loading ads in EU/UK
