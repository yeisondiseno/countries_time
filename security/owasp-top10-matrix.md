# OWASP Top 10 2021 — Frontend Matrix

| ID | Category | Verdict | Key evidence |
| --- | --- | --- | --- |
| A01 | Broken Access Control | **Pass** | No auth; no admin UI; tier-3 noindex is SEO-only |
| A02 | Cryptographic Failures | **Pass** | No tokens in storage; HTTPS enforced for prod site URL |
| A03 | Injection | **Pass** | URL params safe; JsonLd hardened (SEC-003 closed) |
| A04 | Insecure Design | **Partial** | Consent gates load; revoke path incomplete (SEC-011) |
| A05 | Security Misconfiguration | **Partial** | Headers + CSP Report-Only (SEC-001); theme externalized (SEC-006) |
| A06 | Vulnerable Components | **Pass** | next upgraded; `npm audit` 0 High (SEC-002, SEC-005 closed) |
| A07 | Auth Failures | **N/A** | No authentication |
| A08 | Integrity Failures | **Partial** | No SRI on Google scripts (accepted); first-party boot without SRI |
| A09 | Logging & Monitoring | **Partial** | Analytics gated; AdSense revoke gap (SEC-011) |
| A10 | SSRF | **N/A** | No client-initiated fetch to user URLs |

**Overall:** 0 Fail, 4 Partial, 4 Pass, 2 N/A (post SEC-006/007 retest 2026-08-31)

**Delta 2026-08-31 (GSC meta):** no category verdict change. A02/A05/A08 remain Pass/Partial as above; new public meta is not a secret and adds no scripts.
