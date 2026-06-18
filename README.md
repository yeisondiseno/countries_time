# Countries Time (micrositio)

Bootstrap alineado con `spects/reporte-arquitectura-bootstrap-micrositio-hora-mundial.md`.

## Herramienta recomendada

Se usa **Bun** (`bun.lock`) para instalación y scripts (`bun install`, `bun run …`).

## Million (desactivado)

En esta rama **`million` está quitado del `next.config`** porque rompía el build con **next-intl** en React Server Components. Las dependencias `million` pueden seguir instaladas hasta que revises compatibilidad; el binario ya no intercepta webpack.

## Scripts

```bash

bun install

bun run dev

bun run build


bun run lint

bun run validate:zones


bun test

```

## next-intl

- Mensajes en `messages/{locale}.json` (8 locales).

- Config por petición en `src/i18n/request.ts` (referenciado por `next-intl/plugin` en `next.config.ts`).

- Routing y prefijos en `src/i18n/routing.ts`; wrappers `Link`/`useRouter` en `src/i18n/navigation.ts`.

- Negociación de idioma previa render: `src/proxy.ts` (`next-intl/middleware`; convención Next 16 reemplaza a `middleware.ts`).

## Entorno público

Configura **`NEXT_PUBLIC_SITE_URL`** con el dominio canónico de producción. Lo usan metadatos, `sitemap.xml`, `robots.txt` y JSON-LD.

```bash
# .env.production.local (local) o Vercel → Environment Variables → Production
NEXT_PUBLIC_SITE_URL=https://www.countries-time.info
```

El script `bun run validate:site-url` se ejecuta antes de `build` y **falla en despliegues de Vercel Production** si la variable falta, no usa `https://` o apunta a `*.vercel.app`.

Tras cambiar la variable en Vercel, haz **redeploy** (las `NEXT_PUBLIC_*` se embeben en el build).

## Google AdSense

Los slots de anuncio están **desactivados por defecto**. No actives publicidad hasta obtener aprobación de AdSense.

```bash
# Mantener en false hasta aprobación
NEXT_PUBLIC_ADS_ENABLED=false
```

Reglas internas:

- Máximo 2–3 unidades por página tras la aprobación.
- Sin anuncios en `/privacy`, `/terms`, `/about`, `/contact` ni páginas 404.
- El primer anuncio debe ir **después** del contenido principal (reloj + texto editorial).
- Integrar CMP/consentimiento en UE/UK antes de servir cookies de terceros.

Ver plan detallado en `spects/plan-ejecucion-adsense-aprobacion.md`.
