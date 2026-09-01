# Remediation Backlog

| ID | Severity | OWASP | Owner | Action | Status |
| --- | --- | --- | --- | --- | --- |
| SEC-001 | High | A05 | Ops / Agent 12 | Implement security headers + CSP (see `optional/security-headers.md`) | open |
| SEC-002 | High | A06 | Agent 12 | Upgrade next ≥16.3.4; `npm audit fix`; CI gate | open |
| SEC-003 | Medium | A03 | Agent 12 | Harden `JsonLd.tsx` serialization | open |
| SEC-004 | Medium | A04/A09 | Agent 12 | Wire `CookieConsentBanner` → Analytics/AdSlot | open |
| SEC-005 | Medium | A06 | Agent 12 | Upgrade sanitize-html ≥2.17.7 | open |
| SEC-006 | Medium | A05 | Agent 12 | Refactor theme boot script for CSP nonce | open |
| SEC-007 | Medium | A08 | Agent 12 | AdSense CSP allowlist + consent before load | open |
| SEC-008 | Low | A04 | User | Accept public email or add contact form | open |
| SEC-009 | Low | A03 | Agent 12 | Require `parseStored` in `usePersistedForm` | open |
| SEC-010 | Low | — | — | Informational only | accepted |

## Release gate

- ⛔ **BLOCK** until SEC-001 and SEC-002 closed
- Recommend SEC-003 + SEC-004 before `NEXT_PUBLIC_ADS_ENABLED=true`
