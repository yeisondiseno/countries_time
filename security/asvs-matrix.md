# ASVS 4.0 Level 2 — Spot Check

| Req ID | Requirement (summary) | Verdict | Notes |
| --- | --- | --- | --- |
| V2.1.1 | Password security | N/A | No auth |
| V3.2.1 | Session token not in localStorage | **Pass** | No session tokens |
| V3.4.1 | Logout clears session | N/A | No auth |
| V4.1.1 | Access control enforced | **Pass** | Public read-only site |
| V5.1.1 | Input validation | **Pass** | `findCountry`, `parseStoredWorldComparatorForm`, `sanitizeInputChange` |
| V5.3.3 | Output encoding | **Partial** | React text nodes OK; JsonLd gap (SEC-003) |
| V7.4.1 | No stack traces to user | **Pass** | No verbose errors observed |
| V8.2.2 | Consent for sensitive processing | **Fail** | Analytics without consent (SEC-004) |
| V13.2.1 | No API keys in client | **Pass** | Only public env vars |
| V14.2.1 | Dependency patching | **Fail** | SEC-002 |
| V14.4.1 | Security headers | **Fail** | SEC-001 |
| V14.4.3 | CSP | **Fail** | SEC-001, SEC-006 |
| V14.4.7 | Subresource integrity | **Partial** | No third-party SRI yet |

**Level 2 conformance:** Not met — 4 Fail, 2 Partial
