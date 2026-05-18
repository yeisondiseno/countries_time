# Catálogo (`src/components`)

| Ruta                                                           | Pieza                                              |
| -------------------------------------------------------------- | -------------------------------------------------- |
| `atoms/LiveClock`                                              | Reloj cliente (`next-intl` + formato `Intl`)     |
| `molecules/LocaleSwitcher`                                     | Selector idioma (`useRouter` de `next-intl`)      |
| `organisms/AppShell`                                           | Carril/nav · textos desde `messages/*.json` (RSC)|
| `organisms/WorldComparator`                                     | Comparador (`react-hook-form` + mensajes cliente) |

Cadenas globales en `messages/{locale}.json`; routing en `src/i18n/routing.ts`; navegación en `src/i18n/navigation.ts`.
