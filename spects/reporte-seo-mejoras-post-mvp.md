# Reporte — Auditoría SEO y mejoras sugeridas (post-MVP)

**Proyecto:** Countries Time — reloj mundial y comparador horario  
**Baseline funcional:** `spects/micrositio-hora-mundial-comparador.md`  
**Rol de referencia:** `.claude/agents/seo-organic-expert.md`  
**Versión del reporte:** 1.0  
**Fecha:** 2026-05-24  
**Alcance:** Producto finalizado en repo local (Next.js 16, next-intl, 8 locales, ~250 países)

---

## 1. Resumen ejecutivo

Countries Time tiene una **base SEO técnica sólida** para un MVP: metadatos por página, hreflang, canonical, sitemap (~2.024 URLs), robots.txt, JSON-LD `WebSite`, SSG de páginas de país y contenido indexable (H1, texto editorial, hora inicial en HTML).

Los mayores riesgos para posicionamiento orgánico y monetización con Google Ads no son la ausencia de SEO, sino:

1. **Duplicación de URLs** por inconsistencia mayúsculas/minúsculas en códigos ISO.
2. **Metadatos poco alineados** con la intención de búsqueda (“hora en X”, “what time is it in…”).
3. **Señales de confianza insuficientes** (footer “MVP”, sin páginas legales, sin OG images).

Este documento prioriza acciones por impacto e incluye guía de implementación alineada con el stack actual (`src/lib/seo/metadata.ts`, `generateMetadata`, `messages/{locale}.json`).

### Estado actual (checklist rápido)

| Área                                | Estado | Notas                                                   |
| ----------------------------------- | ------ | ------------------------------------------------------- |
| Arquitectura i18n `/[locale]/…`     | ✅     | 8 locales con prefijo obligatorio                       |
| hreflang + x-default (HTML)         | ✅     | Recíproco en `<head>`                                   |
| Canonical por página                | ⚠️     | Bug de mayúsculas en países                             |
| Sitemap + robots.txt                | ✅     | ~2.024 URLs, sin hreflang XML                           |
| Metadatos únicos por ruta           | ⚠️     | Directorio reutiliza description del home               |
| JSON-LD                             | ⚠️     | Solo `WebSite`; falta `FAQPage`, `WebPage`, breadcrumbs |
| Open Graph / Twitter                | ⚠️     | Sin imágenes; card básica                               |
| Contenido SSR indexable             | ✅     | H1, FAQ y hora inicial verificados en HTML              |
| Enlaces internos                    | ✅     | Nav, directorio, CTAs al comparador                     |
| E-E-A-T / AdSense readiness         | ❌     | Sin legal, footer “MVP”, placeholders de ads            |
| Producción (`NEXT_PUBLIC_SITE_URL`) | ⚠️     | Requerido antes de indexar                              |

---

## 2. Contexto del producto y objetivo SEO

| Aspecto                    | Descripción                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Objetivo de negocio**    | Tráfico orgánico recurrente (long-tail: “hora en X”, diferencias horarias) → monetización con Google Ads |
| **URLs totales estimadas** | 8 locales × (3 rutas base + 250 países) = **~2.024 URLs**                                                |
| **Intención principal**    | Informacional / utilitaria inmediata (hora actual, comparación de husos)                                 |
| **Competencia típica**     | timeanddate.com, worldtimebuddy.com, páginas de reloj por país                                           |

---

## 3. Problemas críticos (acción inmediata)

### 3.1 URLs duplicadas: mayúsculas vs minúsculas

**Problema:** `/es/countries/es` y `/es/countries/ES` responden **200** con **canonicals distintos**.

| Fuente                                                  | Convención                                              |
| ------------------------------------------------------- | ------------------------------------------------------- |
| Sitemap (`src/app/sitemap.ts`)                          | Minúsculas: `/en/countries/es`                          |
| `generateMetadata` (`countries/[countryCode]/page.tsx`) | Mayúsculas: `pathWithoutLocale: /countries/${hit.code}` |
| Enlaces del directorio                                  | Minúsculas: `href={/countries/${code.toLowerCase()}}`   |

**Impacto:** Contenido duplicado, dilución de PageRank, confusión en Search Console.

**Fix recomendado:**

1. Estandarizar en **minúsculas** en canonical, sitemap, metadata y enlaces.
2. Añadir redirect 301 en `next.config.ts`:

```typescript
async redirects() {
  return [{
    source: "/:locale/countries/:code([A-Z]{2})",
    destination: "/:locale/countries/:code",
    permanent: true,
  }];
}
```

3. Cambiar en `generateMetadata`:

```typescript
pathWithoutLocale: `/countries/${hit.code.toLowerCase()}`,
```

**Esfuerzo estimado:** 1–2 h  
**Prioridad:** P0

---

### 3.2 Señales hreflang contradictorias (HTTP vs HTML)

**Problema:** Las cabeceras `Link` del middleware pueden emitir `x-default` apuntando a `/countries/es` **sin prefijo de locale**, mientras el HTML declara `/en/countries/ES`.

**Impacto:** Google puede ignorar el conjunto hreflang completo si las señales no son recíprocas y consistentes.

**Fix recomendado:**

1. Auditar `src/proxy.ts` (middleware next-intl) y la salida HTTP con `curl -sI`.
2. Asegurar que `localeAlternateLanguages()` en `src/lib/seo/metadata.ts` sea la **única fuente de verdad**.
3. Validar con [hreflang testing tool](https://technicalseo.com/tools/hreflang/) tras el fix de URLs.

**Esfuerzo estimado:** 2–3 h  
**Prioridad:** P0

---

### 3.3 Dominio de producción no configurado

**Problema:** Sin `NEXT_PUBLIC_SITE_URL`, canonical/sitemap/JSON-LD usan `http://localhost:3000`.

**Fix:** Exportar la variable antes del despliegue (documentado en `README.md`):

```bash
NEXT_PUBLIC_SITE_URL=https://tudominio.com
```

Verificar en build de producción que sitemap, canonical y JSON-LD apunten al dominio final.

**Prioridad:** P0 (bloqueante para indexación)

---

## 4. Mejoras de alta prioridad

### 4.1 Títulos y meta descriptions orientados a búsqueda

**Estado actual (España):**

- Title: `España (ES) · Countries Time` (~29 caracteres, poco keyword-rich)
- Description: `España · El contexto editorial usa Madrid como referencia.` (~58 caracteres, sin “hora actual”)

**Objetivo:** Alinear con queries reales por locale.

| Locale | Title (plantilla)                                      | Description (plantilla)                                                                                             |
| ------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| es     | `¿Qué hora es en {country} ahora? Reloj en vivo`       | `Hora actual en {country} ({capital}). Reloj en directo con horario de verano. Compara husos horarios al instante.` |
| en     | `What time is it in {country} now? Live clock`         | `Current local time in {country} ({capital}). Live clock with DST. Compare time zones instantly.`                   |
| fr     | `Quelle heure est-il en {country} ? Horloge en direct` | _(adaptar por mercado, no traducción literal)_                                                                      |
| de     | `Wie spät ist es in {country}? Live-Uhr`               | _(idem)_                                                                                                            |
| pt     | `Que horas são em {country} agora? Relógio ao vivo`    | _(idem)_                                                                                                            |
| ja     | `{country}の現在時刻は？ ライブ時計`                   | _(idem)_                                                                                                            |
| it     | `Che ore sono in {country}? Orologio live`             | _(idem)_                                                                                                            |
| ko     | `{country} 현재 시간은? 실시간 시계`                   | _(idem)_                                                                                                            |

**Implementación:**

1. Añadir claves `Country.metaTitle` y `Country.metaDescription` en `messages/{locale}.json`.
2. Usarlas en `generateMetadata` de `src/app/[locale]/countries/[countryCode]/page.tsx`.
3. Mantener longitud objetivo: title 50–60 chars, description 150–160 chars.
4. Investigar keywords por locale (GSC + sugerencias) antes de congelar plantillas en Tier 1.

**Esfuerzo estimado:** 2–4 h (+ research continuo)  
**Prioridad:** P1

---

### 4.2 Imágenes Open Graph y Twitter Card

**Problema:** No existen `opengraph-image.tsx` ni assets en `/public`. Previews genéricos en redes y SERP enriquecidos.

**Fix recomendado:**

1. `src/app/[locale]/opengraph-image.tsx` — imagen base del sitio.
2. Variante dinámica por país (nombre + bandera + hora estática o branding).
3. Extender `buildPageMetadata()` en `src/lib/seo/metadata.ts`:

```typescript
openGraph: {
  // …existente
  images: [{ url: "/og-default.png", width: 1200, height: 630, alt: title }],
},
twitter: {
  card: "summary_large_image",
  title,
  description,
  images: ["/og-default.png"],
},
```

**Esfuerzo estimado:** 3–5 h  
**Prioridad:** P1

---

### 4.3 Meta description duplicada en directorio de países

**Problema:** `src/app/[locale]/countries/page.tsx` usa `Common.homeIntro` como description en lugar de copy específico del directorio.

**Fix:** Usar `Countries.subtitle` (ya existe en traducciones) o nueva clave `Countries.metaDescription`.

**Esfuerzo estimado:** 30 min  
**Prioridad:** P1

---

### 4.4 Schema.org: FAQPage, WebPage, BreadcrumbList

**Estado:** Solo JSON-LD `WebSite` en `src/app/[locale]/layout.tsx`. Las páginas de país ya tienen 3 FAQs en `<details>`.

**Fix recomendado:**

| Schema                    | Dónde                        | Beneficio            |
| ------------------------- | ---------------------------- | -------------------- |
| `FAQPage`                 | Server Component de país     | Rich results en SERP |
| `WebPage`                 | Cada página con URL canónica | Contexto semántico   |
| `BreadcrumbList`          | País y directorio            | Navegación en SERP   |
| `SearchAction` (opcional) | `WebSite` global             | Sitelinks search box |

Implementar JSON-LD en Server Components (no en Client Components) para garantizar SSR.

**Esfuerzo estimado:** 3–4 h  
**Prioridad:** P1

---

### 4.5 Preparación AdSense y señales E-E-A-T

**Problemas detectados:**

- Footer: `"Countries Time · MVP"` — percepción poco profesional.
- Sin **Política de privacidad**, **Términos de uso** ni **Contacto**.
- Slots de anuncios visibles como placeholder sin CMP/consent (obligatorio UE/UK).

**Fix recomendado:**

1. Crear rutas legales localizadas: `/[locale]/privacy`, `/[locale]/terms`, `/[locale]/contact`.
2. Enlazar desde footer en `AppShell`.
3. Quitar “MVP” del footer; usar copy de confianza con disclaimer de precisión horaria (ya parcialmente presente).
4. Integrar CMP certificado antes de solicitar revisión AdSense.
5. Política de privacidad con cláusulas exigidas por Google (cookies, terceros, opt-out).

**Referencias:** [AdSense — sitio no listo](https://support.google.com/adsense/answer/12176698), [Políticas del publisher](https://support.google.com/adsense/answer/9335564).

**Esfuerzo estimado:** 4–8 h  
**Prioridad:** P1 (bloqueante para monetización)

---

### 4.6 Riesgo de contenido “thin” / programático

**Problema:** 250 países × 8 idiomas con plantilla similar. Google puede indexar selectivamente o marcar páginas de baja calidad.

**Mitigación:**

- Meta descriptions únicas con `{country}`, `{capital}`, `{zone}`, `{offset}`.
- Bloques contextuales por región (UE, LATAM, Asia) donde aporte valor.
- Enlaces internos contextuales: “Países en el mismo huso”, “Comparar {A} con {B}”.
- Priorizar indexación manual de Tier 1 en Search Console.
- Monitorizar ratio indexación/cobertura semanalmente.

**Esfuerzo estimado:** Iterativo (continuo post-lanzamiento)  
**Prioridad:** P1

---

## 5. Mejoras de prioridad media / baja

### 5.1 Sitemap

| Mejora                    | Detalle                                                                       |
| ------------------------- | ----------------------------------------------------------------------------- |
| hreflang en XML           | Añadir `alternates.languages` en entradas del sitemap (Next.js MetadataRoute) |
| `lastModified`            | Evitar `new Date()` en cada build; usar fecha del dataset o omitir            |
| `priority` / `changefreq` | Home/compare `weekly`; países `daily`                                         |
| Sitemap index             | Solo necesario si se superan 50.000 URLs (no aplica ahora)                    |

### 5.2 Home y comparador

| Página  | Mejora                                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------------------ |
| Home    | Title actual solo `"Countries Time"` → `"World Clock & Time Zone Comparator \| Countries Time"` (localizado) |
| Compare | Title/description ya decentes; reforzar keywords “time zone converter”, “comparador horario”                 |

### 5.3 i18n y UX

- Traducciones incompletas en algunos locales (p. ej. `fr.json` mezcla EN en Theme/skipToContent).
- `manifest.ts`: `start_url: "/"` sin locale → considerar `/en` o detección.
- Añadir `icon.tsx` / `apple-icon.tsx` (App Router) — no hay favicon en `/public`.

### 5.4 Rendimiento y medición

- Fonts con `display: swap` ✅ — auditar LCP del reloj en móvil tras ads reales.
- Configurar Google Search Console y Analytics antes del lanzamiento.
- Baseline Lighthouse en home, país Tier 1 y comparador.

---

## 6. Estrategia de keywords

### 6.1 Intención y mapeo URL

| Intención        | Ejemplos ES                              | Ejemplos EN                               | Página              |
| ---------------- | ---------------------------------------- | ----------------------------------------- | ------------------- |
| Hora actual      | “hora en japón”, “qué hora es en méxico” | “time in Japan”, “current time in Mexico” | `/countries/{code}` |
| Comparación      | “diferencia horaria españa argentina”    | “time difference Spain Argentina”         | `/compare`          |
| Directorio       | “husos horarios países”                  | “world time zones by country”             | `/countries`        |
| Marca + utilidad | “reloj mundial online”                   | “world clock online”                      | Home                |

### 6.2 Tier de países (indexación prioritaria)

**Tier 1 (alto volumen):** US, UK, ES, MX, AR, CO, FR, DE, JP, BR, IN, AU, CA  
**Tier 2:** Resto G20 + destinos turísticos frecuentes  
**Tier 3:** Países pequeños — indexación progresiva

### 6.3 Reglas de contenido

1. H1 debe responder la query: `"Hora actual en {country}"` (parcialmente cumplido).
2. Primer párrafo visible < 100 palabras con respuesta directa.
3. No traducir keywords literalmente entre locales — investigar término nativo.
4. Evitar keyword stuffing; mantener tono editorial natural (ya cumplido).

---

## 7. Lo que ya funciona bien (no romper)

- Prefijo de locale obligatorio (`localePrefix: "always"`).
- hreflang recíproco en HTML para 8 idiomas + `x-default` → EN.
- `generateStaticParams` para países (SSG).
- H1 único por página en home, directorio, comparador y país.
- Contenido SSR: H1, FAQ, hora inicial en HTML (verificado con curl).
- Enlaces internos: nav, directorio → país, CTAs → comparador, back link.
- Accesibilidad: skip link, `aria-live` en reloj, landmarks semánticos.
- Anti-thin editorial baseline: FAQs reales sobre DST y multi-zona.

---

## 8. Roadmap de implementación sugerido

| Fase                          | Acciones                                                         | Esfuerzo  | Impacto SEO         |
| ----------------------------- | ---------------------------------------------------------------- | --------- | ------------------- |
| **Fase 0 — Pre-lanzamiento**  | Fix URLs duplicadas, `NEXT_PUBLIC_SITE_URL`, audit hreflang HTTP | 1 día     | Crítico             |
| **Fase 1 — On-page**          | Plantillas meta por país, fix description directorio, OG images  | 1–2 días  | Alto                |
| **Fase 2 — Structured data**  | FAQPage, WebPage, BreadcrumbList                                 | 0.5–1 día | Medio-alto          |
| **Fase 3 — Confianza / Ads**  | Legal pages, footer profesional, CMP                             | 1–2 días  | Alto (monetización) |
| **Fase 4 — Post-lanzamiento** | GSC, tier países, enlaces contextuales, CWV                      | Continuo  | Medio               |

---

## 9. Criterios de aceptación

Una iteración SEO se considera completa cuando:

1. Solo existe **una URL canónica** por país+locale (minúsculas, 301 desde mayúsculas).
2. hreflang es **recíproco y consistente** entre HTML, sitemap y cabeceras HTTP.
3. Cada tipo de página tiene **title y description únicos** alineados con intención de búsqueda.
4. Existe al menos **una imagen OG** por tipo de página (home, país, comparador).
5. Páginas de país incluyen **FAQPage** JSON-LD válido.
6. Footer enlaza **privacidad, términos y contacto** en los 8 idiomas.
7. Sitemap en producción usa el **dominio final** y está enviado a Search Console.
8. Lighthouse SEO score ≥ 95 en home y una página Tier 1.

---

## 10. Archivos clave del repo

| Archivo                                             | Rol SEO                         |
| --------------------------------------------------- | ------------------------------- |
| `src/lib/seo/metadata.ts`                           | Canonical, hreflang, Open Graph |
| `src/lib/seo/site-origin.ts`                        | Origen absoluto para URLs       |
| `src/app/sitemap.ts`                                | Mapa de ~2.024 URLs             |
| `src/app/robots.ts`                                 | Reglas de rastreo               |
| `src/app/[locale]/layout.tsx`                       | JSON-LD WebSite                 |
| `src/app/[locale]/countries/[countryCode]/page.tsx` | Metadata + SSG países           |
| `src/app/[locale]/countries/page.tsx`               | Metadata directorio             |
| `src/app/[locale]/compare/page.tsx`                 | Metadata comparador             |
| `src/app/[locale]/page.tsx`                         | Metadata home                   |
| `messages/{locale}.json`                            | Copy SEO traducible             |
| `src/proxy.ts`                                      | Middleware i18n (hreflang HTTP) |

---

## 11. Fuentes consultadas

- [Google Search Central — Versiones localizadas (hreflang)](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [sitemaps.org — Protocolo](https://www.sitemaps.org/protocol.html)
- [Google AdSense — Sitio no listo para anuncios](https://support.google.com/adsense/answer/12176698)
- [Google Publisher Policies — Privacidad](https://support.google.com/adsense/answer/9335564)
- [Google AdSense — Contenido requerido en política de privacidad](https://support.google.com/adsense/answer/1348695)

---

## 12. Historial de revisiones

| Versión | Fecha      | Cambios                                                    |
| ------- | ---------- | ---------------------------------------------------------- |
| 1.0     | 2026-05-24 | Auditoría inicial post-MVP; hallazgos y roadmap priorizado |
