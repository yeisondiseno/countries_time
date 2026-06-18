# Plan de ejecución — Aprobación AdSense y contenido de valor

**Proyecto:** Countries Time — [countries-time.info](https://www.countries-time.info)  
**Baseline funcional:** [`micrositio-hora-mundial-comparador.md`](./micrositio-hora-mundial-comparador.md)  
**Baseline SEO:** [`reporte-seo-mejoras-post-mvp.md`](./reporte-seo-mejoras-post-mvp.md)  
**Rol de referencia:** `.claude/agents/seo-organic-expert.md`  
**Versión del plan:** 1.0  
**Fecha:** 2026-06-17  
**Estado AdSense:** Rechazado — *Low value content* + *Google-served ads on screens without publisher-content*

---

## 1. Resumen ejecutivo

Google AdSense rechazó el sitio porque, desde la perspectiva del revisor, **Countries Time es una herramienta con contenido editorial fino y huecos de anuncio visibles**, no un recurso informativo con valor propio.

Los dos motivos declarados están relacionados:

| Violación reportada | Causa raíz en el producto actual |
| ------------------- | ------------------------------- |
| **Low value content** | Home, comparador y ~250 páginas de país comparten plantillas con 150–300 palabras genéricas; poco contenido único por URL. |
| **Ads on screens without publisher-content** | `AdSlot` muestra cajas visibles con texto *“Espacio para anuncios (CLS)”* en **todas** las páginas (`AppShell` + país), antes de tener aprobación ni inventario real. |

**Objetivo del plan:** transformar el sitio en un recurso editorial + utilidad (reloj/comparador), **sin placeholders de anuncios visibles**, y volver a solicitar revisión solo cuando un revisor externo perciba valor aunque se oculte el widget.

**Horizonte estimado:** 3–6 semanas (contenido + despliegue + periodo de maduración antes de re-solicitud).

**Regla de oro:** no integrar el script de AdSense ni mostrar slots hasta **después** de la aprobación.

---

## 2. Diagnóstico detallado (estado actual en producción)

### 2.1 Inventario de páginas y contenido

| Ruta | Contenido editorial aprox. | Slots de anuncio visibles | Riesgo AdSense |
| ---- | -------------------------- | ------------------------- | -------------- |
| `/[locale]` (home) | ~300 palabras + 3 FAQ | 2 (`leaderboard` + `inContent` en shell) | Alto |
| `/[locale]/countries` | Listado + búsqueda | 2 | Medio |
| `/[locale]/countries/[code]` | ~200 palabras plantilla + 3 FAQ genéricas | 3 (shell ×2 + sidebar) | **Crítico** (×250 países) |
| `/[locale]/compare` | Subtítulo + herramienta | 2 | Alto |
| `/[locale]/privacy`, `/terms` | Copy legal adecuado | 2 | Bajo (no deben llevar ads) |
| `/[locale]/contact` | **No existe** | — | Bloqueante E-E-A-T |
| `/[locale]/about` | **No existe** | — | Bloqueante E-E-A-T |

### 2.2 Archivos implicados (repo)

| Archivo | Problema |
| ------- | -------- |
| `src/components/molecules/AdSlot/AdSlot.tsx` | Renderiza placeholder visible con copy de anuncio. |
| `src/components/organisms/AppShell/AppShell.tsx` | Inserta `AdSlot` global en header y pre-footer. |
| `src/components/organisms/CountryPageView/CountryPageView.tsx` | Tercer slot en sidebar + contenido client-only escaso. |
| `src/app/[locale]/page.tsx` | Bloques SEO mínimos; sin guías ni casos de uso. |
| `src/app/[locale]/compare/page.tsx` | Sin contenido editorial bajo la herramienta. |
| `messages/{locale}.json` → `Country.*` | Textos genéricos; no hay datos por país. |
| Footer (`AppShell`) | Falta enlace a Contacto; email solo en traducciones legales. |

### 2.3 Referencias oficiales Google

- [Sitio no listo para AdSense](https://support.google.com/adsense/answer/12176698)
- [Anuncios en pantallas sin contenido del publisher](https://support.google.com/adsense/answer/1346295)
- [Requisitos mínimos de contenido](https://support.google.com/adsense/answer/10502938)
- [Políticas del programa AdSense](https://support.google.com/adsense/answer/9335564)
- [Consejos para sitios de alta calidad (parte 1)](https://support.google.com/adsense/answer/1705823)
- [Consejos para sitios de alta calidad (parte 2)](https://support.google.com/adsense/answer/1705824)
- [Directrices de calidad para webmasters — thin content](https://developers.google.com/search/docs/essentials/spam-policies#thin-affiliate-pages)

---

## 3. Principios de ejecución

1. **Contenido antes que monetización** — Primero valor editorial; ads al final.
2. **Una URL = una respuesta útil** — Evitar 2.000 páginas idénticas sin diferenciación.
3. **Progresivo por tiers** — Enriquecer Tier 1 (20–30 países) antes que el long tail completo.
4. **SSR para SEO y revisores** — Texto crítico en Server Components; reloj en cliente.
5. **i18n completa** — Todo copy nuevo en los 8 locales (`en`, `es`, `fr`, `pt`, `de`, `ja`, `it`, `ko`).
6. **Medible** — Checklist de aceptación + verificación manual antes de re-solicitud.

---

## 4. Fases de ejecución

### Fase 0 — Desbloqueo inmediato (P0)

**Objetivo:** eliminar la señal “sitio hecho para anuncios” que provocó el rechazo explícito de *screens without publisher-content*.

**Duración estimada:** 2–4 horas  
**Dependencias:** ninguna  
**Desplegar antes de cualquier otra mejora de contenido.**

#### Tarea 0.1 — Ocultar placeholders de anuncios

| Campo | Detalle |
| ----- | ------- |
| **ID** | ADS-001 |
| **Acción** | Hacer que `AdSlot` no renderice nada en producción hasta aprobación AdSense. |
| **Implementación recomendada** | Variable de entorno `NEXT_PUBLIC_ADS_ENABLED=false` (default). `AdSlot` retorna `null` si no está activo. Reservar espacio solo cuando ads estén aprobados e integrados. |
| **Archivos** | `AdSlot.tsx`, `.env.example`, `README.md` |
| **Alternativa temporal** | Eliminar `<AdSlot />` de `AppShell` y `CountryPageView` por completo. |

**Criterio de aceptación:**

- [ ] Ninguna URL pública muestra texto “Espacio para anuncios” ni cajas grises de placeholder.
- [ ] Verificado en home, país Tier 1, comparador, privacidad y términos.
- [ ] Build de producción desplegado en `countries-time.info`.

#### Tarea 0.2 — Documentar política interna de ads

| Campo | Detalle |
| ----- | ------- |
| **ID** | ADS-002 |
| **Acción** | Añadir nota en README/spec: no activar ads hasta segunda aprobación; máx. 2–3 unidades por página; nunca en legal/404. |

---

### Fase 1 — Confianza y E-E-A-T (P0)

**Objetivo:** demostrar quién opera el sitio, cómo se calculan las horas y cómo contactar.

**Duración estimada:** 1–2 días  
**Dependencias:** Fase 0 desplegada**

#### Tarea 1.1 — Página About (`/[locale]/about`)

| Campo | Detalle |
| ----- | ------- |
| **ID** | TRUST-001 |
| **Ruta** | `src/app/[locale]/about/page.tsx` |
| **Contenido mínimo (por locale, ~400–600 palabras)** | Qué es Countries Time · Para quién · Fuentes de datos (IANA zoneinfo) · Metodología de cálculo · Limitaciones y disclaimer · Enlace al comparador y directorio |
| **SEO** | `generateMetadata`, JSON-LD `WebPage`, breadcrumb |
| **Traducciones** | Nuevo namespace `About` en `messages/{locale}.json` |
| **Sitemap** | Añadir `/about` en `src/app/sitemap.ts` |

**Criterio de aceptación:**

- [ ] Accesible en los 8 idiomas con prefijo de locale.
- [ ] Enlazada desde footer en `AppShell`.
- [ ] Sin slots de anuncio.

#### Tarea 1.2 — Página Contact (`/[locale]/contact`)

| Campo | Detalle |
| ----- | ------- |
| **ID** | TRUST-002 |
| **Ruta** | `src/app/[locale]/contact/page.tsx` |
| **Contenido** | Intro + email `hello@countries-time.com` (ya en `Legal.contactEmail`) + tiempo de respuesta esperado + enlace a privacidad |
| **Traducciones** | Reutilizar/ampliar namespace `Legal` o crear `Contact` |
| **Footer** | Añadir enlace “Contacto” junto a Privacidad y Términos |

**Criterio de aceptación:**

- [ ] Email visible y clicable (`mailto:`).
- [ ] En los 8 locales.
- [ ] En sitemap.

#### Tarea 1.3 — Refuerzo footer

| Campo | Detalle |
| ----- | ------- |
| **ID** | TRUST-003 |
| **Acción** | Footer con: About · Contact · Privacy · Terms · disclaimer horario (ya existe). |
| **Archivo** | `AppShell.tsx`, `messages/*/Footer.json` keys |

---

### Fase 2 — Enriquecimiento home y comparador (P1)

**Objetivo:** que las URLs de mayor tráfico potencial no parezcan solo “pantallas de herramienta”.

**Duración estimada:** 2–3 días  
**Dependencias:** Fase 1**

#### Tarea 2.1 — Home ampliada

| Campo | Detalle |
| ----- | ------- |
| **ID** | CONTENT-001 |
| **Archivo** | `src/app/[locale]/page.tsx`, `messages/*/Home` |
| **Secciones nuevas** | Ver tabla abajo |

| Sección | Contenido | Palabras objetivo |
| ------- | --------- | ----------------- |
| **Casos de uso** | Viajes, reuniones remotas, llamadas internacionales, aprendizaje de idiomas | 150–200 |
| **Cómo funciona** | Paso a paso: elegir país → leer hora → comparar | 120–150 |
| **Relojes destacados** | Widgets en vivo de US, ES, MX, GB, DE, JP (ya listados; mostrar hora, no solo link) | — |
| **Guías rápidas** | 2–3 enlaces a artículos (Fase 4) o bloques inline temporales | 200–300 c/u |
| **FAQ ampliada** | 6–8 preguntas (DST, UTC, comparador, precisión, fuentes) | 400–500 total |

**Criterio de aceptación:**

- [ ] Home con ≥ 800 palabras de contenido indexable en SSR.
- [ ] H1 único; jerarquía H2→H3 correcta.
- [ ] FAQ con JSON-LD `FAQPage` (ya parcialmente implementado — ampliar items).

#### Tarea 2.2 — Comparador con contenido editorial

| Campo | Detalle |
| ----- | ------- |
| **ID** | CONTENT-002 |
| **Archivo** | `src/app/[locale]/compare/page.tsx` o nuevo `ComparePageContent.tsx` (Server Component) |
| **Ubicación** | Bloque **debajo** de `<WorldComparator />` |

| Bloque | Contenido |
| ------ | --------- |
| Intro extendida | Qué resuelve el comparador vs. buscar país por país |
| Tutorial | 4 pasos numerados con capturas o texto |
| Ejemplo práctico | “Reunión Madrid (ES) – Tokio (JP) a las 10:00” con explicación |
| FAQ comparador | 4–5 preguntas específicas |
| Enlaces internos | A países del ejemplo + directorio |

**Criterio de aceptación:**

- [ ] ≥ 500 palabras SSR bajo la herramienta.
- [ ] JSON-LD `FAQPage` opcional para FAQ del comparador.
- [ ] La herramienta sigue siendo above-the-fold en móvil.

---

### Fase 3 — Contenido único por país (P1)

**Objetivo:** reducir percepción de “thin / doorway pages” en el núcleo de URLs (~250 × 8 locales).

**Duración estimada:** 1–2 semanas (iterativo)  
**Dependencias:** Fase 2**

#### Tarea 3.1 — Modelo de datos editorial por país

| Campo | Detalle |
| ----- | ------- |
| **ID** | COUNTRY-001 |
| **Archivo nuevo** | `src/lib/data/country-editorial.ts` o `data/country-editorial/{code}.json` |
| **Campos por país (Tier 1 completo; Tier 2+ progresivo)** | |

```typescript
type CountryEditorial = {
  code: string;
  /** Párrafo único: contexto geográfico y uso horario (localizable o por locale) */
  overview: Record<Locale, string>;
  /** Fechas DST si aplica — texto humano */
  dstNotes?: Record<Locale, string>;
  /** Diferencia típica vs UTC en invierno/verano */
  utcOffsetSummary: Record<Locale, string>;
  /** 2–3 países relacionados para enlaces internos */
  relatedCodes: string[];
  /** Consejo práctico (llamadas, reuniones) */
  practicalTip: Record<Locale, string>;
};
```

**Tier 1 (prioridad absoluta):**  
`US`, `GB`, `ES`, `MX`, `AR`, `CO`, `FR`, `DE`, `IT`, `PT`, `BR`, `JP`, `IN`, `AU`, `CA`, `CN`, `KR`, `NL`, `CH`, `AE`

#### Tarea 3.2 — Integrar editorial en página de país

| Campo | Detalle |
| ----- | ------- |
| **ID** | COUNTRY-002 |
| **Archivos** | `CountryPageView.tsx` (mover prosa a Server Component wrapper), `countries/[countryCode]/page.tsx` |
| **Estructura de página objetivo** | |

1. H1 + reloj en vivo (client)
2. Selector de zona (si aplica)
3. **Respuesta directa** — primer párrafo ≤ 80 palabras con hora + offset + capital
4. **Contexto único** — `overview` del dataset editorial
5. **DST / calendario** — fechas concretas cuando existan
6. **Consejo práctico** — tip localizado
7. **Países relacionados** — grid de enlaces
8. FAQ (mantener; añadir 1 pregunta específica del país si aplica)
9. CTA comparador

**Criterio de aceptación por país Tier 1:**

- [ ] ≥ 400 palabras únicas indexables (sin contar FAQ genérica duplicada).
- [ ] Meta description incluye capital, zona y keyword de intención.
- [ ] Al menos 2 enlaces internos contextuales.
- [ ] Validado en HTML inicial (`curl` o “Ver código fuente”).

#### Tarea 3.3 — Países sin editorial completo

| Estrategia | Detalle |
| ---------- | ------- |
| **Tier 2** | Plantilla enriquecida con datos derivados automáticamente: offset, zona IANA, capital, región — mínimo 250 palabras **no duplicadas** entre países. |
| **Tier 3** | Mantener indexación; no priorizar ads hasta enriquecer. Opcional: `noindex` temporal solo si GSC muestra “Crawled – not indexed” masivo (último recurso). |

#### Tarea 3.4 — Enlaces “Comparar X con Y”

| Campo | Detalle |
| ----- | ------- |
| **ID** | COUNTRY-003 |
| **Rutas futuras (opcional Fase 5)** | `/[locale]/compare?a=ES&b=MX` o páginas estáticas `/guides/time-difference-es-mx` |
| **MVP** | En páginas Tier 1, bloque “Comparar {país} con…” → deep link al comparador con query params |

---

### Fase 4 — Hub de guías editoriales (P1)

**Objetivo:** demostrar expertise más allá del widget; captar long-tail informacional.

**Duración estimada:** 1 semana (5 artículos iniciales)  
**Dependencias:** Fase 1 (About enlaza al hub)**

#### Tarea 4.1 — Estructura de rutas

| Campo | Detalle |
| ----- | ------- |
| **ID** | GUIDE-001 |
| **Ruta** | `src/app/[locale]/guides/[slug]/page.tsx` |
| **Listado** | `src/app/[locale]/guides/page.tsx` |
| **Contenido** | MDX o JSON por guía en `content/guides/{slug}/{locale}.mdx` |

#### Tarea 4.2 — Artículos iniciales (publicar en ES + EN primero; resto de locales en iteración)

| # | Slug | Título (ES) | Palabras mín. |
| - | ---- | ----------- | ------------- |
| 1 | `como-programar-reuniones-internacionales` | Cómo programar reuniones internacionales sin errores de huso horario | 800 |
| 2 | `que-es-horario-verano` | Qué es el horario de verano y cómo afecta a las videollamadas | 700 |
| 3 | `diferencia-horaria-espana-mexico` | Diferencia horaria entre España y México (explicada con ejemplos) | 600 |
| 4 | `diferencia-horaria-espana-argentina` | Diferencia horaria entre España y Argentina | 600 |
| 5 | `como-usar-comparador-horario` | Cómo usar el comparador horario de Countries Time | 500 |

Cada guía debe incluir: H1 claro, tabla o lista de ejemplos, enlaces a países/comparador, FAQ corta, fecha de actualización visible.

**Criterio de aceptación:**

- [ ] Índice de guías en `/guides` en 8 locales (o mínimo ES/EN con hreflang preparado).
- [ ] Enlazado desde home y footer.
- [ ] Sitemap actualizado.

---

### Fase 5 — Preparación técnica pre re-solicitud (P1)

**Duración estimada:** 1 día  
**Dependencias:** Fases 0–4 desplegadas en producción**

#### Tarea 5.1 — Checklist técnico

| ID | Verificación |
| -- | ------------ |
| TECH-001 | `NEXT_PUBLIC_SITE_URL=https://www.countries-time.info` en producción |
| TECH-002 | Sitemap enviado en Google Search Console |
| TECH-003 | URLs canónicas en minúsculas (`/countries/es`, no `/ES`) — ver [`reporte-seo-mejoras-post-mvp.md` §3.1](./reporte-seo-mejoras-post-mvp.md) |
| TECH-004 | hreflang recíproco sin contradicciones HTTP/HTML |
| TECH-005 | Privacidad menciona cookies de terceros / AdSense (preparar texto antes de activar ads) |
| TECH-006 | CMP / banner de consentimiento (obligatorio UE/UK antes de activar ads reales) |
| TECH-007 | Lighthouse SEO ≥ 95 en home + 1 país Tier 1 + comparador |
| TECH-008 | Sin errores de rastreo críticos en GSC |

#### Tarea 5.2 — Auditoría manual “modo revisor AdSense”

Simular la revisión con esta checklist:

- [ ] ¿La home aporta valor sin usar el comparador?
- [ ] ¿Una página de país Tier 1 tiene información que no está en timeanddate.com de forma idéntica?
- [ ] ¿Hay páginas About y Contact accesibles?
- [ ] ¿Alguna pantalla muestra huecos de anuncio vacíos? → debe ser **no**
- [ ] ¿El comparador tiene texto explicativo suficiente debajo?
- [ ] ¿Hay contenido duplicado obvio entre países pequeños?

#### Tarea 5.3 — Periodo de maduración

| Acción | Motivo |
| ------ | ------ |
| Esperar **mínimo 14 días** tras desplegar Fases 0–4 | Evitar re-revisión instantánea sobre caché/percepción anterior |
| Monitorizar GSC: impresiones, páginas indexadas | Señal de contenido válido |
| Opcional: tráfico orgánico modesto | No obligatorio, pero ayuda |

---

### Fase 6 — Re-solicitud e integración AdSense (P2)

**Solo ejecutar tras completar Fase 5.**

#### Tarea 6.1 — Solicitar nueva revisión

1. Cuenta AdSense → **Sites** → `countries-time.info` → **Request review**.
2. Confirmar que el sitio en producción coincide con lo auditado.
3. No mencionar “monetización” en contenido visible; foco en utilidad.

#### Tarea 6.2 — Tras aprobación: integración responsable

| Regla | Implementación |
| ----- | -------------- |
| Activar `NEXT_PUBLIC_ADS_ENABLED=true` | Solo post-aprobación |
| Máximo 3 anuncios por página | Home, país, comparador |
| **Contenido above ads** | Primer anuncio **después** de H1 + reloj + primer párrafo |
| Sin ads en | `/privacy`, `/terms`, `/contact`, `/about`, 404 |
| CMP antes del primer ad en UE/UK | Consent Mode v2 |
| No sticky/overlap | Respetar [`design-spec-world-clock-microsite.md` §Ads](./design-spec-world-clock-microsite.md) |

#### Tarea 6.3 — Si vuelve a rechazar

| Escenario | Acción |
| --------- | ------ |
| Sigue “low value” | Ampliar Tier 1 a 40 países; publicar 5 guías más; añadir comparaciones estáticas ES–X |
| “Navigational” | Reducir CTAs repetitivos; más prosa en home |
| Sin detalle en email | Revisar Policy center en AdSense; consultar [foro AdSense](https://support.google.com/adsense/community) con URL específica |

---

## 5. Matriz de tareas (backlog ejecutable)

| ID | Fase | Prioridad | Esfuerzo | Entregable |
| -- | ---- | --------- | -------- | ---------- |
| ADS-001 | 0 | P0 | 2 h | AdSlot oculto en producción |
| ADS-002 | 0 | P0 | 30 min | Documentación política ads |
| TRUST-001 | 1 | P0 | 4 h | `/about` × 8 locales |
| TRUST-002 | 1 | P0 | 2 h | `/contact` × 8 locales |
| TRUST-003 | 1 | P0 | 1 h | Footer completo |
| CONTENT-001 | 2 | P1 | 1 día | Home enriquecida |
| CONTENT-002 | 2 | P1 | 4 h | Copy comparador |
| COUNTRY-001 | 3 | P1 | 2 días | Dataset editorial Tier 1 |
| COUNTRY-002 | 3 | P1 | 1 día | Integración en página país |
| COUNTRY-003 | 3 | P2 | 4 h | Deep links comparador |
| GUIDE-001 | 4 | P1 | 1 día | Rutas `/guides` |
| GUIDE-002 | 4 | P1 | 3 días | 5 artículos ES/EN |
| TECH-001…008 | 5 | P1 | 1 día | Checklist verificado |
| ADS-REVIEW | 6 | P2 | — | Re-solicitud AdSense |

**Esfuerzo total estimado:** 12–18 días de desarrollo + contenido; 2–4 semanas calendario con maduración.

---

## 6. Plantillas de contenido

### 6.1 Párrafo único país (Tier 1) — ejemplo España

> **España** tiene una hora oficial coordinada en la península con la zona **Europe/Madrid** (UTC+1 en invierno, UTC+2 en verano). Las Islas Canarias usan **Atlantic/Canary**, una hora menos. La capital **Madrid** concentra actividad empresarial y administrativa; para llamadas desde otros husos conviene comprobar si el interlocutor está en península o Canarias. El cambio de horario de verano en la UE suele ser el último domingo de marzo y octubre.

### 6.2 Bloque FAQ home — preguntas adicionales sugeridas

1. ¿De dónde provienen los datos horarios?
2. ¿Countries Time sustituye la hora oficial de mi país?
3. ¿Puedo comparar más de cuatro países?
4. ¿Funciona en móvil sin instalar nada?
5. ¿Por qué la hora difiere de otro sitio un día al año?

### 6.3 Estructura artículo guía

```markdown
# {Título H1}

> Respuesta directa en 2 frases (featured snippet).

## Contexto
## Ejemplos con horas concretas
## Tabla de diferencias (si aplica)
## Cómo hacerlo con Countries Time
## Preguntas frecuentes
## Última actualización: {fecha}
```

---

## 7. Criterios de aceptación globales (Definition of Done)

El plan se considera **completo para re-solicitar AdSense** cuando se cumplen **todos** estos puntos:

1. **Cero placeholders de anuncio visibles** en producción.
2. Páginas **About** y **Contact** publicadas en 8 locales, enlazadas desde footer.
3. Home con **≥ 800 palabras** SSR y FAQ ampliada.
4. Comparador con **≥ 500 palabras** SSR bajo la herramienta.
5. **20 países Tier 1** con contenido editorial único ≥ 400 palabras cada uno (por locale activo: mínimo ES + EN).
6. **5 guías** publicadas (mínimo ES + EN) enlazadas desde home.
7. Sitemap y GSC actualizados; sin errores críticos de indexación.
8. Auditoría manual §5.2 aprobada por segunda persona (o revisión externa).
9. **14+ días** desde el despliegue final antes de pulsar “Request review”.

---

## 8. Orden de despliegue recomendado

```text
Semana 1
├── Día 1–2: Fase 0 (quitar ads) + Fase 1 (About, Contact, footer)
├── Día 3–4: Fase 2 (home + comparador)
└── Día 5: Despliegue parcial → verificar producción

Semana 2–3
├── Dataset editorial Tier 1 (10 países / semana)
├── Integración en páginas de país
└── Fase 4: primeras 3 guías

Semana 4
├── Resto Tier 1 + 2 guías
├── Fase 5 checklist técnico
└── Auditoría manual

Semana 5–6
├── Periodo de maduración (sin re-solicitar aún)
├── Monitorizar GSC
└── Fase 6: Request review AdSense
```

---

## 9. Riesgos y mitigaciones

| Riesgo | Probabilidad | Mitigación |
| ------ | ------------ | ---------- |
| Rechazo repetido por thin content en long tail | Alta | Priorizar Tier 1; guías originales; no re-solicitar pronto |
| Contenido duplicado entre locales mal traducido | Media | Traducción nativa por mercado; no Google Translate sin revisión |
| Reloj en client reduce percepción de contenido | Media | Prosa editorial en Server Components above the fold |
| Activar ads demasiado pronto tras aprobación | Media | Seguir reglas Fase 6.2; CMP en UE |
| Scope creep (100 guías antes de lanzar) | Media | MVP: 5 guías + 20 países; iterar después |

---

## 10. Archivos a crear o modificar (referencia rápida)

| Acción | Ruta |
| ------ | ---- |
| Modificar | `src/components/molecules/AdSlot/AdSlot.tsx` |
| Modificar | `src/components/organisms/AppShell/AppShell.tsx` |
| Modificar | `src/components/organisms/CountryPageView/CountryPageView.tsx` |
| Modificar | `src/app/[locale]/page.tsx` |
| Modificar | `src/app/[locale]/compare/page.tsx` |
| Crear | `src/app/[locale]/about/page.tsx` |
| Crear | `src/app/[locale]/contact/page.tsx` |
| Crear | `src/app/[locale]/guides/page.tsx` |
| Crear | `src/app/[locale]/guides/[slug]/page.tsx` |
| Crear | `src/lib/data/country-editorial.ts` |
| Crear | `content/guides/**` |
| Modificar | `src/app/sitemap.ts` |
| Modificar | `messages/{locale}.json` (namespaces `About`, `Contact`, `Home`, `Compare`, `Guides`) |

---

## 11. Seguimiento

| Métrica | Herramienta | Frecuencia |
| ------- | ----------- | ---------- |
| Páginas indexadas | Google Search Console | Semanal |
| Impresiones / clics | GSC | Semanal |
| Core Web Vitals | GSC / Lighthouse | Quincenal |
| Estado AdSense | Panel Sites | Tras re-solicitud |
| Palabras por URL Tier 1 | Script audit o manual | Al cerrar Fase 3 |

**Registro de progreso:** marcar checkboxes de §4 y §7 en este documento o en issue tracker del repo.

---

## 12. Historial de revisiones

| Versión | Fecha | Cambios |
| ------- | ----- | ------- |
| 1.0 | 2026-06-17 | Plan inicial tras rechazo AdSense (low value + screens without publisher-content) |
