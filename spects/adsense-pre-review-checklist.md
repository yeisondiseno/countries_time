# AdSense pre-review checklist

Use this checklist **after deploying** all AdSense content changes and **before** requesting a new review in the AdSense panel.

## Deployment gate (code)

- [ ] `/guides` index and 17 guide articles live (10 editorial + 7 comparison pairs)
- [ ] Home links to featured guides; footer links to `/guides`
- [ ] Tier 3 country pages return `noindex, follow` and are **excluded** from `sitemap.xml`
- [ ] Tier 1 (20) + Tier 2 (~50) countries in sitemap only (~70 × 8 locales)
- [ ] Country editorial rendered in Server Components (`CountryPageEditorial`)
- [ ] Comparator accepts `?a=ES&b=MX` deep links
- [ ] Cookie consent banner visible (CMP prep; ads still disabled)
- [ ] `NEXT_PUBLIC_ADS_ENABLED=false` in production

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

| Day | Action |
| --- | --- |
| 0 | Deploy all changes to production |
| 1–7 | Do **not** request AdSense review |
| 7 | Check GSC indexed pages count |
| 14 | Verify Tier 3 de-indexing progress |
| **30** | If all boxes above are checked → AdSense → Sites → Request review |

## After approval only

1. Set `NEXT_PUBLIC_ADS_ENABLED=true`
2. Integrate AdSense script per `spects/plan-ejecucion-adsense-aprobacion.md` Phase 6.2
3. Respect cookie consent before loading ads in EU/UK
