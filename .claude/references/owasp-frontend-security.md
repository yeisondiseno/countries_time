# OWASP frontend security — reference

Quick map for Agent 16. Official OWASP guidance takes precedence.

## Primary frameworks (default audit)

| Framework                                                                                   | Use                                                   |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [OWASP Top 10 (2021)](https://owasp.org/Top10/)                                             | Risk prioritization — client-relevant categories      |
| [OWASP ASVS 4.0](https://owasp.org/www-project-application-security-verification-standard/) | Verification checklist (Level 2 default for web apps) |
| [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/)                     | Test procedures (client-side chapters)                |
| [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)                             | Remediation patterns                                  |

## OWASP Top 10 → frontend focus

| ID  | Risk                      | Frontend audit focus                                                      |
| --- | ------------------------- | ------------------------------------------------------------------------- |
| A01 | Broken Access Control     | UI exposes admin actions; IDOR in client routes; hidden ≠ secure          |
| A02 | Cryptographic Failures    | Tokens/PII in localStorage; HTTP links; weak client crypto                |
| A03 | Injection                 | XSS (reflected/stored/DOM); `dangerouslySetInnerHTML`; URL/HTML injection |
| A04 | Insecure Design           | Trusting client validation only; sensitive flows without step-up          |
| A05 | Security Misconfiguration | Verbose errors; debug flags; permissive CSP; open CORS from browser       |
| A06 | Vulnerable Components     | Outdated npm deps; known CVEs in bundle                                   |
| A07 | Auth Failures             | Tokens in JS; session fixation; logout not clearing storage               |
| A08 | Integrity Failures        | CDN/subresource without SRI; tampered third-party scripts                 |
| A09 | Logging & Monitoring      | Sensitive data sent to analytics/error trackers from client               |
| A10 | SSRF                      | Less client-direct; flag unsafe `fetch` to internal URLs from browser     |

## ASVS — chapters to verify (Level 2 default)

| Chapter | Topic                                                     |
| ------- | --------------------------------------------------------- |
| V2      | Authentication — client session handling, token storage   |
| V3      | Session Management — cookies, timeouts, fixation          |
| V4      | Access Control — UI authorization, route guards           |
| V5      | Validation / Encoding — output encoding, input on client  |
| V7      | Error Handling — no stack traces or secrets to user       |
| V8      | Data Protection — PII minimization, masking, leakage      |
| V13     | API / Web Service — keys in client, GraphQL introspection |
| V14     | Configuration — headers, CSP, security.txt                |

## Mandatory security headers (production)

| Header                       | Minimum expectation                                   |
| ---------------------------- | ----------------------------------------------------- |
| Content-Security-Policy      | Restrict scripts; no `unsafe-inline` unless justified |
| Strict-Transport-Security    | `max-age` ≥ 31536000; includeSubDomains               |
| X-Content-Type-Options       | `nosniff`                                             |
| Referrer-Policy              | `strict-origin-when-cross-origin` or stricter         |
| Permissions-Policy           | Disable unused APIs (camera, mic, geolocation)        |
| Cross-Origin-Opener-Policy   | `same-origin` where compatible                        |
| Cross-Origin-Resource-Policy | As appropriate for assets                             |

## Data leakage hunt (aggressive checklist)

- [ ] `NEXT_PUBLIC_*` / `VITE_*` — no secrets, API keys, internal URLs
- [ ] Bundled JS/source maps — no credentials, PII, private endpoints
- [ ] `__NEXT_DATA__` / RSC payloads — no excess user records
- [ ] `localStorage` / `sessionStorage` / `IndexedDB` — no tokens or PII at rest
- [ ] Cookies — `HttpOnly`, `Secure`, `SameSite` for session cookies (set server-side)
- [ ] Query strings / hash — no tokens or PII
- [ ] Analytics (GA, Segment, Sentry) — scrub PII; no full payloads
- [ ] Error boundaries / toast messages — no raw API errors
- [ ] Comments / `data-*` / hidden inputs — no secrets
- [ ] WebSocket/SSE messages — no sensitive fields in clear text
- [ ] Clipboard / share APIs — no accidental secret copy
- [ ] Browser cache — sensitive pages `Cache-Control: no-store`
- [ ] Third-party scripts — inventory + SRI + least privilege

## Testing methods

| Method             | Tool / action                                                |
| ------------------ | ------------------------------------------------------------ |
| Dependency scan    | `npm audit`, OSV, Snyk, Dependabot                           |
| SAST               | ESLint security plugins, Semgrep OWASP rules                 |
| DAST (staging)     | OWASP ZAP baseline, Burp passive                             |
| Manual XSS         | Break every input, URL param, rich text, `javascript:` links |
| Storage inspection | DevTools → Application → all stores                          |
| Network            | DevTools → filter API responses for over-fetching            |
| CSP eval           | Report-only → enforce; attempt inline injection              |
| Auth flows         | Logout, back button, token replay, tab close                 |

## System links

- Agent 16: [16-frontend-security.md](../agents/16-frontend-security.md)
- Checklist: [checklist.md](checklist.md#phase-16-frontend-security-agent-16)
