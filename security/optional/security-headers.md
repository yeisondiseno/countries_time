# Security Headers Template (Production)

Apply via `next.config.ts` `headers()` or Vercel project settings.

## Recommended baseline

```typescript
// next.config.ts — example (tune CSP before enforce)
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-site",
  },
];
```

## CSP — phased rollout

### Phase 1: Report-Only

```
Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://vitals.vercel-insights.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

### Phase 2: Enforce (after fixing inline theme script)

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{NONCE}' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://vitals.vercel-insights.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

### Phase 3: AdSense enabled

Add to `script-src` / `frame-src`:

- `https://pagead2.googlesyndication.com`
- `https://www.googletagservices.com`
- `https://googleads.g.doubleclick.net`

Only after SEC-004 consent wiring.

## Verification

```bash
curl -sI "https://www.countries-time.info/en" | grep -Ei 'content-security|strict-transport|x-frame|x-content-type'
```

## Notes

- `unsafe-inline` in Phase 1 required for `layout.tsx` theme boot script (SEC-006).
- HSTS preload requires HTTPS on all subdomains.
- Vercel may add some headers automatically; verify no duplicates/conflicts.
