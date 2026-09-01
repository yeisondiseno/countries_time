# OWASP backend security — reference

Quick map for Agent 17. Official OWASP guidance takes precedence.

## Primary frameworks (default audit)

| Framework | Use |
| --------- | --- |
| [OWASP Top 10 (2021)](https://owasp.org/Top10/) | Risk prioritization — server/API focus |
| [OWASP ASVS 4.0](https://owasp.org/www-project-application-security-verification-standard/) | Verification checklist (Level 2 default for APIs) |
| [OWASP API Security Top 10 (2023)](https://owasp.org/API-Security/) | API-specific risks |
| [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/) | Server-side test procedures |
| [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) | Remediation patterns |

## OWASP Top 10 → backend focus

| ID | Risk | Backend audit focus |
| --- | --- | --- |
| A01 | Broken Access Control | IDOR, horizontal/vertical privilege escalation, missing auth on routes |
| A02 | Cryptographic Failures | Weak hashing, plaintext secrets, TLS misconfig, bad key management |
| A03 | Injection | SQL/NoSQL/LDAP/command injection; unsafe ORM raw queries |
| A04 | Insecure Design | Trusting client input; missing rate limits; business logic flaws |
| A05 | Security Misconfiguration | Debug mode in prod; default creds; verbose errors; open CORS `*` |
| A06 | Vulnerable Components | Outdated server deps; known CVEs in runtime |
| A07 | Auth Failures | Weak session/JWT; missing MFA on sensitive flows; credential stuffing |
| A08 | Integrity Failures | Unsigned webhooks; missing package lock integrity; CI/CD tampering |
| A09 | Logging & Monitoring | No audit trail for auth/admin; PII in logs; missing alerts |
| A10 | SSRF | User-controlled URLs fetching internal services/metadata |

## OWASP API Security Top 10 (2023)

| ID | Risk | Hunt |
| --- | --- | --- |
| API1 | Broken Object Level Authorization | `/users/{id}` without ownership check |
| API2 | Broken Authentication | API keys in query; long-lived tokens; no rotation |
| API3 | Broken Object Property Level Authorization | Mass assignment; exposing internal fields |
| API4 | Unrestricted Resource Consumption | No rate limits; expensive queries; file upload abuse |
| API5 | Broken Function Level Authorization | Admin endpoints reachable by regular role |
| API6 | Unrestricted Access to Sensitive Business Flows | OTP bypass; coupon abuse; race conditions |
| API7 | Server Side Request Forgery | Webhook URL, image proxy, import URL |
| API8 | Security Misconfiguration | Stack traces; unnecessary HTTP methods |
| API9 | Improper Inventory Management | Shadow APIs, deprecated routes without auth |
| API10 | Unsafe Consumption of APIs | Trusting third-party API responses without validation |

## ASVS — chapters to verify (Level 2 default)

| Chapter | Topic |
| ------- | ----- |
| V1 | Architecture — trust boundaries, threat model |
| V2 | Authentication — password policy, lockout, MFA |
| V3 | Session Management — fixation, timeout, invalidation |
| V4 | Access Control — RBAC/ABAC, deny by default |
| V5 | Validation / Sanitization — input on every boundary |
| V6 | Stored Cryptography — at-rest encryption, key rotation |
| V7 | Error Handling — no stack traces or secrets to client |
| V8 | Data Protection — PII minimization, retention |
| V9 | Communication — TLS, cert validation, HSTS |
| V10 | Malicious Code — dependency integrity |
| V11 | Business Logic — workflow abuse, idempotency |
| V13 | API / Web Service — auth, schema validation, versioning |
| V14 | Configuration — secrets management, env separation |

## Database security checklist

- [ ] Least-privilege DB users (app ≠ migration ≠ admin)
- [ ] No plaintext passwords, API keys, or PII in logs
- [ ] Parameterized queries / ORM — no string-concat SQL
- [ ] Row-level security or app-layer ownership checks documented
- [ ] Backups encrypted; restore tested; PITR where required
- [ ] Migration review — no destructive ops without rollback plan
- [ ] Sensitive columns encrypted at rest where warranted
- [ ] Connection strings in secrets manager, not repo or plain env in prod
- [ ] Network isolation — DB not public internet reachable
- [ ] Audit tables for admin/sensitive mutations

## Secrets & configuration

- [ ] `.env` not committed; `.env.example` without real values
- [ ] Secrets rotated on leak or employee offboarding
- [ ] Separate configs for dev/staging/prod
- [ ] No secrets in error responses, health checks, or `/debug`
- [ ] IAM roles over long-lived cloud keys where possible

## Testing methods

| Method | Tool / action |
| ------ | ------------- |
| Dependency scan | `npm audit`, OSV, Snyk, Dependabot (server lockfile) |
| SAST | Semgrep OWASP, Bandit (Python), gosec (Go) |
| DAST | OWASP ZAP API scan, Burp against staging |
| AuthZ fuzz | Swap IDs, roles, tokens across endpoints |
| SQL injection | `' OR 1=1--` on params; ORM raw query audit |
| Rate limit | Burst login, OTP, password reset, webhooks |
| SSRF | Internal IP, metadata URL (`169.254.169.254`) in URL params |

## Severity model (align with Agent 16)

| Level | Definition | Release |
| ----- | ---------- | ------- |
| **Critical** | RCE, SQLi with data exfil, auth bypass, secrets in repo | **BLOCK** |
| **High** | IDOR on PII, missing auth on admin API, SSRF to internal | **BLOCK** |
| **Medium** | Weak rate limits, verbose errors, outdated dep with CVE | Fix before release unless accepted |
| **Low** | Hardening, informational | Track |
