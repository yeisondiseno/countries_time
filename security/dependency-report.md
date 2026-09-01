# Dependency Report

**Scan date:** 2026-08-31  
**Command:** `npm audit --audit-level=high`

## Summary

| Severity | Count |
| --- | --- |
| High | 6 |
| Moderate | 1 |
| Low | 1 |
| **Total** | **8** |

## High — Release Block

### next@16.2.6 (direct dependency)

Multiple advisories including:

- GHSA-6gpp-xcg3-4w24 — Middleware/Proxy bypass (App Router + Turbopack/single locale)
- GHSA-m99w-x7hq-7vfj — DoS via Server Actions
- GHSA-89xv-2m56-2m9x — SSRF in Server Actions (custom servers)
- GHSA-68g3-v927-f742 / GHSA-4633-3j49-mh5q — Cache confusion
- GHSA-p9j2-gv94-2wf4 — SSRF in rewrites
- GHSA-q8wf-6r8g-63ch — DoS in Image Optimization (SVG)
- GHSA-955p-x3mx-jcvp — Unauthenticated Server Function endpoint disclosure

**Fix:** `npm audit fix --force` → next@16.3.4 (outside current semver pin)

### Transitive (via next/toolchain)

| Package | Issue | Severity |
| --- | --- | --- |
| postcss ≤8.5.22 | XSS / arbitrary file read via source maps | High |
| sharp <0.35.0 | libvips CVEs | High |
| nanoid ≤3.3.17 | Infinite loop DoS | High |
| js-yaml 4.0.0–4.3.0 | Quadratic DoS | High |
| brace-expansion ≤5.0.8 | ReDoS / OOM | High |
| @babel/core ≤7.29.0 | Arbitrary file read via sourceMappingURL | Low (dev) |

## Moderate

### sanitize-html@2.17.0 (direct)

- GHSA-vccv-cmxp-4j9h — Incomplete URI scheme validation (`javascript:` via attributes)
- **Fix:** 2.17.7
- **Runtime impact:** Used in `src/lib/sanitize.ts` for input sanitization

## Client Bundle Exposure

All listed High CVEs affect build/server toolchain or Next runtime. Client JS bundle includes `next`, `react`, `luxon`, `react-hook-form` — no Critical client-only RCE identified, but framework CVEs affect deployed app integrity.

## Recommended Actions

1. Upgrade `next` to ≥16.3.4 and re-run full regression + security retest
2. Upgrade `sanitize-html` to ≥2.17.7
3. Run `npm audit` in CI on every PR (`--audit-level=high` = fail)
