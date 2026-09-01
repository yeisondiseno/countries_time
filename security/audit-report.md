# Informe de Auditoría Frontend — Countries Time

**Fecha:** 2026-08-31  
**Auditor:** Agent 16 (Frontend Security)  
**Alcance:** Remediation AdSense "low value content" + superficie completa del frontend  
**Veredicto:** ⛔ **BLOQUEAR RELEASE** — 2 hallazgos High abiertos

---

## Resumen ejecutivo

La auditoría agresiva OWASP/ASVS L2 del frontend **no encontró XSS explotable** en parámetros URL (`?a=`, `?b=`, slugs de guías) ni path traversal en rutas dinámicas. La validación de `findCountry`, el parser de `localStorage` del comparador y la sanitización de inputs están bien implementados para el alcance actual.

Sin embargo, **faltan cabeceras de seguridad obligatorias (CSP, HSTS, etc.)** y el proyecto ejecuta **Next.js 16.2.6 con 6 CVEs High** sin mitigar. Estos dos bloqueadores impiden el sign-off de producción según la política del Agent 16.

---

## Hallazgos por severidad

### ⛔ HIGH — Bloquean release

---

### SEC-001 — Ausencia de Content-Security-Policy y cabeceras de endurecimiento

**OWASP:** A05:2021 Security Misconfiguration  
**ASVS:** V14.4.1, V14.4.3  
**Ubicación:** `next.config.ts` (sin `headers()`), sin `vercel.json`  
**Evidencia:** Búsqueda en repo sin coincidencias para `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`.

**Impacto:** Sin CSP, cualquier vector XSS futuro (p. ej. JSON-LD breakout, dependencia comprometida, script inline) ejecuta sin restricción. Sin `X-Frame-Options`/`frame-ancestors`, la app es vulnerable a clickjacking. Sin HSTS, downgrade SSL posible en primera visita.

**PoC:**
1. Desplegar en staging/producción.
2. `curl -sI https://<dominio>/en/compare | grep -i content-security-policy` → vacío.
3. Crear página HTML externa con `<iframe src="https://<dominio>/en/compare">` → carga sin restricción.

**Corrección:**
- Añadir `headers()` en `next.config.ts` o `vercel.json` con CSP (empezar report-only), HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP.
- Para el inline script de tema (`layout.tsx:43-45`), usar nonce/hash CSP o migrar a `next/script` con nonce.
- Plantilla en `security/optional/security-headers.md`.

**Retest:** Verificar todas las cabeceras en respuesta 200 de `/en`, `/en/compare`, `/en/guides/utc-basics`.

---

### SEC-002 — Next.js 16.2.6 y dependencias transitivas con CVEs High

**OWASP:** A06:2021 Vulnerable and Outdated Components  
**ASVS:** V14.2.1  
**Ubicación:** `package.json:20` (`next@16.2.6`), lockfile transitivo  
**Evidencia:** `npm audit --audit-level=high` → 6 High, incluyendo GHSA-6gpp-xcg3-4w24 (bypass middleware/proxy).

**Impacto:**
- **GHSA-6gpp-xcg3-4w24** afecta directamente `src/proxy.ts` (middleware de locale + redirects de país).
- DoS/SSRF/cache confusion en runtime Next afectan disponibilidad e integridad del despliegue.
- `postcss`/`sharp` CVEs afectan pipeline de build e Image Optimization.

**PoC:**
1. `npm audit --audit-level=high` en el repo → 8 vulnerabilidades reportadas.
2. Revisar advisory GHSA-6gpp-xcg3-4w24 contra configuración actual (App Router + proxy).

**Corrección:**
- Actualizar `next` a ≥16.3.4 (verificar changelog y breaking changes).
- `npm audit fix` para brace-expansion, js-yaml, nanoid, @babel/core.
- Actualizar `sanitize-html` a ≥2.17.7.
- Añadir `npm audit --audit-level=high` en CI.

**Retest:** `npm audit --audit-level=high` sin High/Critical; smoke test de `proxy.ts` (locale, country code case, icon redirect).

---

### ⚠️ MEDIUM

---

### SEC-003 — JSON-LD vía `dangerouslySetInnerHTML` sin escape anti-`</script>`

**OWASP:** A03:2021 Injection  
**ASVS:** V5.3.3  
**Ubicación:** `src/lib/seo/JsonLd.tsx:9`  
**Evidencia:**
```tsx
dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
```

**Impacto:** Si una cadena en JSON-LD contiene `</script>`, puede romper el contexto del `<script type="application/ld+json">` y ejecutar JS. Hoy el contenido proviene de i18n estático y editorial curado (no de URL params), por lo que **no es explotable remotamente sin comprometer el repo**. Riesgo de escalada si se añade CMS o contenido generado por usuarios.

**PoC (dev, contenido malicioso en editorial):**
1. Insertar en `country-editorial.ts`: `overview: 'Test</script><script>alert(1)</script>'`
2. Visitar `/en/countries/us` → potencial ejecución de script.

**Corrección:**
```tsx
const safeJson = JSON.stringify(data)
  .replace(/</g, "\\u003c")
  .replace(/>/g, "\\u003e")
  .replace(/&/g, "\\u0026");
```
O usar `<script type="application/ld+json">{JSON.stringify(data)}</script>` sin `dangerouslySetInnerHTML` si el framework lo permite.

**Retest:** Inyectar `</script>` en fixture de test; confirmar que no ejecuta.

---

### SEC-004 — Consentimiento de cookies no gobierna scripts de terceros

**OWASP:** A09:2021 Security Logging and Monitoring Failures / A04 Insecure Design  
**ASVS:** V8.2.2  
**Ubicación:** `src/components/molecules/CookieConsentBanner/CookieConsentBanner.tsx`, `src/app/layout.tsx:53`, `src/components/organisms/AppShell/AppShell.tsx:51`  
**Evidencia:** `CookieConsentBanner` guarda `all`/`essential` en localStorage pero **no condiciona** `<Analytics />` ni futuros `AdSlot`.

**Impacto:** Vercel Analytics se carga siempre, independientemente de "Rechazar". Cuando `NEXT_PUBLIC_ADS_ENABLED=true`, AdSense seguiría el mismo patrón — incumplimiento de consentimiento y superficie de tracking no autorizado.

**PoC:**
1. Abrir sitio en ventana privada.
2. Pulsar "Rechazar" en banner.
3. DevTools → Network → filtrar `vitals` / `/_vercel/` → requests siguen activos.

**Corrección:**
- Crear `ConsentProvider` que lea `countries-time:cookie-consent`.
- Renderizar `<Analytics />` y scripts AdSense solo si `consent === "all"`.
- Documentar en política de privacidad.

**Retest:** Rechazar cookies → cero requests a dominios analytics/ads.

---

### SEC-005 — `sanitize-html@2.17.0` con CVE Moderate (javascript: URIs)

**OWASP:** A06:2021 Vulnerable Components  
**ASVS:** V14.2.1  
**Ubicación:** `package.json:26`, `src/lib/sanitize.ts`  
**Evidencia:** GHSA-vccv-cmxp-4j9h — validación incompleta de esquemas URI.

**Impacto:** Bajo en la práctica actual: `INPUT_SANITIZE_OPTIONS` elimina todos los tags; `SANITIZE_OPTIONS` solo permite `http/https/mailto`. Pero la dependencia está desactualizada y el bypass podría afectar futuros usos de `sanitizeUserHtml` con HTML enriquecido.

**Corrección:** `npm install sanitize-html@^2.17.7`

---

### SEC-006 — Script inline de hidratación de tema bloquea CSP estricta

**OWASP:** A05:2021 Security Misconfiguration  
**ASVS:** V14.4.3  
**Ubicación:** `src/app/layout.tsx:42-46`  
**Evidencia:** Script inline sin nonce que lee `localStorage` para `data-theme` y `data-hourFormat`.

**Impacto:** Requiere `unsafe-inline` en CSP o refuerza dependencia de nonces. El script en sí valida valores (`light|dark`, `12h|24h`) — **no vulnerable a XSS vía localStorage** gracias al whitelist.

**Corrección:** Migrar a `next/script` con `strategy="beforeInteractive"` + nonce CSP, o CSS `@media (prefers-color-scheme)` sin JS.

---

### SEC-007 — AdSense futuro sin CSP allowlist ni SRI

**OWASP:** A08:2021 Software and Data Integrity Failures  
**ASVS:** V14.4.7  
**Ubicación:** `src/lib/ads/config.ts`, `src/components/molecules/AdSlot/AdSlot.tsx`  
**Evidencia:** Flag `NEXT_PUBLIC_ADS_ENABLED` existe; `AdSlot` es placeholder sin `<script>` real aún.

**Impacto:** Al integrar `adsbygoogle.js`, sin CSP `script-src` restrictivo + dominios Google, cualquier XSS puede cargar scripts arbitrarios adicionales.

**Corrección:** Preparar CSP con `https://pagead2.googlesyndication.com`, `https://www.googletagservices.com`; cargar solo tras consentimiento; considerar `fetchpriority` y lazy load.

---

### ℹ️ LOW / Informativo

---

### SEC-008 — Email de contacto público en bundle de mensajes i18n

**OWASP:** A01:2021 Broken Access Control (informational) / A04  
**Ubicación:** `messages/*.json` → `Legal.contactEmail`  
**Impacto:** `hello@countries-time.info` serializado en cliente vía `NextIntlClientProvider`. Esperado para página de contacto; riesgo de scraping/spam, no de breach.

**Corrección:** Ninguna requerida si es intencional; considerar formulario con backend si se quiere ocultar email.

---

### SEC-009 — `usePersistedForm` merge genérico sin `parseStored` es patrón latente

**OWASP:** A03:2021 Injection  
**Ubicación:** `src/hooks/usePersistedForm.ts:45-47`  
**Impacto:** Si un futuro consumidor omite `parseStored`, datos maliciosos en localStorage se fusionan en el formulario. `WorldComparator` **sí** usa `parseStoredWorldComparatorForm` — OK hoy.

**Corrección:** Hacer `parseStored` obligatorio o rechazar merge ciego en revisión de código.

---

### SEC-010 — Países Tier 3 accesibles pero no indexables

**OWASP:** N/A (SEO, no seguridad)  
**Ubicación:** `src/app/[locale]/countries/[countryCode]/page.tsx:62-66`, `src/lib/data/country-tiers.ts`  
**Impacto:** `noindex` correcto; páginas siguen sirviéndose. No es vulnerabilidad de acceso.

---

## Áreas auditadas — PASS (sin hallazgo)

| Área | Resultado | Notas |
| --- | --- | --- |
| XSS `?a=` / `?b=` | ✅ PASS | `findCountry` whitelist; no reflejo en DOM |
| XSS slugs `/guides/[slug]` | ✅ PASS | Lookup exacto; 404 si no existe |
| Path traversal rutas | ✅ PASS | Sin lectura de filesystem por slug |
| Open redirect | ✅ PASS | `proxy.ts` solo reescribe paths internos conocidos |
| localStorage comparator | ✅ PASS | Parser valida ISO codes, fechas, horas |
| `pickerSearch` | ✅ PASS | `Input` → `sanitizeInputChange` |
| `NEXT_PUBLIC_*` secrets | ✅ PASS | Solo URL pública y flag de ads |
| `postMessage` | ✅ PASS | No usado |
| `target="_blank"` | ✅ PASS | No usado en enlaces externos |
| Auth / tokens | ✅ PASS | Sin autenticación |
| Open Graph / metadata | ✅ PASS | Contenido estático/i18n |

---

## Matriz de bloqueo de release

| ID | Severidad | Estado | Bloquea |
| --- | --- | --- | --- |
| SEC-001 | High | Abierto | ⛔ Sí |
| SEC-002 | High | Abierto | ⛔ Sí |
| SEC-003 | Medium | Abierto | No |
| SEC-004 | Medium | Abierto | No |
| SEC-005 | Medium | Abierto | No |
| SEC-006 | Medium | Abierto | No |
| SEC-007 | Medium | Abierto | No |
| SEC-008–010 | Low | Informativo | No |

**Recomendación final:** No desplegar a producción hasta cerrar SEC-001 y SEC-002. Planificar SEC-003 y SEC-004 antes de activar AdSense.
