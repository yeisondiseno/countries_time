# Countries Time (micrositio)

Bootstrap alineado con `spects/reporte-arquitectura-bootstrap-micrositio-hora-mundial.md`.

## Herramienta recomendada

Se usa **Bun** (`bun.lock`) para instalación y scripts (`bun install`, `bun run …`).

## Scripts

```bash

bun install

bun run dev

bun run build


bun run lint

bun run validate:zones


bun test

```

## Million + `src/app`

`next.config.ts` envuelve la configuración con `million.next`. Si aparece algún problema con directorios `src/app`, documentar pin o flags en ese archivo.

## next-intl

- Mensajes en `messages/{locale}.json` (8 locales).

- Config por petición en `src/i18n/request.ts` (referenciado por `next-intl/plugin` en `next.config.ts`).


- Routing y prefijos en `src/i18n/routing.ts`; wrappers `Link`/`useRouter` en `src/i18n/navigation.ts`.


- Negociación de idioma previa render: `src/proxy.ts` (`next-intl/middleware`; convención Next 16 reemplaza a `middleware.ts`).


## Entorno público

Exporta `NEXT_PUBLIC_SITE_URL` (p. ej. `https://tudominio.com`) para metadatos, `sitemap` y JSON-LD.
