# OWASP Top 10 2021 — Frontend Matrix

| ID | Category | Verdict | Key evidence |
| --- | --- | --- | --- |
| A01 | Broken Access Control | **Pass** | No auth; no admin UI; tier-3 noindex is SEO-only |
| A02 | Cryptographic Failures | **Pass** | No tokens in storage; HTTPS enforced for prod site URL |
| A03 | Injection | **Partial** | URL params safe; JsonLd sink unhardened (SEC-003) |
| A04 | Insecure Design | **Partial** | Cookie banner not wired to script loading (SEC-004) |
| A05 | Security Misconfiguration | **Fail** | No CSP/HSTS/headers (SEC-001); inline script (SEC-006) |
| A06 | Vulnerable Components | **Fail** | next@16.2.6 + 6 High CVEs (SEC-002); sanitize-html (SEC-005) |
| A07 | Auth Failures | **N/A** | No authentication |
| A08 | Integrity Failures | **Partial** | No SRI on third parties; AdSense not yet integrated (SEC-007) |
| A09 | Logging & Monitoring | **Partial** | Analytics without consent gating (SEC-004) |
| A10 | SSRF | **N/A** | No client-initiated fetch to user URLs |

**Overall:** 2 Fail, 4 Partial, 2 Pass, 2 N/A
