# Remediation Backlog

| ID      | Severity | OWASP   | Owner          | Action                                                                | Status   |
| ------- | -------- | ------- | -------------- | --------------------------------------------------------------------- | -------- |
| SEC-001 | High     | A05     | Ops / Agent 12 | Implement security headers + CSP (see `optional/security-headers.md`) | **done** |
| SEC-002 | High     | A06     | Agent 12       | Upgrade next ≥16.3.4; `npm audit fix`; CI gate                        | **done** |
| SEC-003 | Medium   | A03     | Agent 12       | Harden `JsonLd.tsx` serialization                                     | **done** |
| SEC-004 | Medium   | A04/A09 | Agent 12       | Wire `CookieConsentBanner` → Analytics/AdSlot                         | **done** |
| SEC-005 | Medium   | A06     | Agent 12       | Upgrade sanitize-html ≥2.17.7                                         | **done** |
| SEC-006 | Medium   | A05     | Agent 12       | Refactor theme boot script to `/public/theme-boot.js`                 | **done** |
| SEC-007 | Medium   | A08     | Agent 12       | AdSense CSP allowlist + consent before load                           | **done** |
| SEC-008 | Low      | A04     | User           | Accept public email or add contact form                               | open     |
| SEC-009 | Low      | A03     | Agent 12       | Require `parseStored` in `usePersistedForm`                           | open     |
| SEC-010 | Low      | —       | —              | Informational only                                                    | accepted |
| SEC-011 | Medium   | A09     | Agent 12       | Remove AdSense script on consent revoke                               | **done** |
| SEC-012 | Low      | A08     | Agent 12       | Validate AdSense env format (`ca-pub-*`, numeric slots)               | **done** |

## Release gate

- ✅ SEC-001 and SEC-002 closed
- ✅ SEC-003 + SEC-004 closed before `NEXT_PUBLIC_ADS_ENABLED=true`
- ✅ SEC-006/007/011/012 closed
- CSP still Report-Only (`unsafe-inline` required for Next.js hydration)
- ✅ **2026-08-31 GSC HTML verification** (`src/app/layout.tsx`): no new findings; Agent 16 sign-off for this delta
