---
alwaysApply: true
---

# Frontend code patterns (enforcement)

Concise rules for Next.js / React / TypeScript. **Apply on every frontend change.**

| Need | Where |
|------|--------|
| What to enforce (this file) | Rules below — tables and bullets only |
| Full examples + rationale | [front-dev-patterns](../skills/front-dev-patterns/SKILL.md) |

---

## Atomic design — mandatory structure

Organize **all** UI under `src/components/` using atomic design layers:

| Layer | Folder | Contains |
|-------|--------|----------|
| Atoms | `atoms/` | Single-purpose UI (Button, Input, Badge, Text, …) |
| Molecules | `molecules/` | Combinations of atoms (FormField, SearchBar, …) |
| Organisms | `organisms/` | Sections (Header, Hero, CardList, …) |
| Templates | `templates/` | Page shells / layout scaffolds (no route-specific data) |

**Rules:**

- Place every new UI piece in the **lowest** layer that fits; do not skip layers (e.g. do not put a bare `button` wrapper in `organisms/`).
- **Dependency direction:** templates → organisms → molecules → atoms. Lower layers **must not** import from higher layers.
- **Pages** live in `src/app/` (App Router); they compose templates/organisms, not duplicate UI primitives.
- Co-locate per component: `ComponentName/ComponentName.tsx`, `ComponentName.scss`, optional `ComponentName.types.ts` inside the layer folder.

---

## Centralized barrel exports — mandatory

Every global module group exposes a **single public API** via `index.ts` (or `index.scss` for global styles). Consumers import **only** from that barrel — never from deep implementation paths.

| Group | Barrel | Import from (alias examples) |
|-------|--------|------------------------------|
| Components | `src/components/index.ts` | `@components/index` or `@/components` |
| Icons | `src/components/Icons/index.ts` | `@icons/index` |
| Hooks | `src/hooks/index.ts` | `@hooks/index` |
| Utils | `src/utils/index.ts` | `@utils/index` |
| Constants | `src/constants/index.ts` | `@constants/index` |
| Services — actions | `src/services/actions/index.ts` | `@services/actions/index` |
| Services — fetchers | `src/services/fetchers/index.ts` | `@services/fetchers/index` |
| Services — DTO / types | `src/services/dto/index.ts` | `@services/dto/index` |
| Global types (if separate) | `src/types/index.ts` | `@types/index` |
| Global styles entry | `src/styles/index.scss` | App/layout imports this entry only |

**Rules:**

- **Export:** each new public symbol is re-exported from the group’s `index` (same change / PR).
- **Import:** use the barrel path only — e.g. `import { Button } from "@components/index"`, not `from "@components/atoms/Button/Button"`.
- **Exception:** imports **within** the same component folder (sibling `./Button.scss`, `./Button.types.ts`) or **within** the same atomic layer subfolder when extracting a private sub-piece not meant for the public API.
- **No default exports** in barrels unless the target project already standardizes on one; prefer named re-exports.
- Sub-barrels (e.g. `services/actions/index.ts`) are allowed; the app still does not import past the documented public `index`.

---

## Functions — arrow functions

Use arrow functions for components, hooks, helpers, callbacks, and event handlers. No `function` declarations or expressions.

**Exception:** Next.js file-convention exports that require `function` (`generateMetadata`, `generateStaticParams`, etc.) — `export async function` only there.

---

## React imports — named only

Import types and hooks by name from `react`. No `React.ReactNode`, `React.useState`, etc. Default import from `react` only when genuinely required.

---

## Import order — mandatory for every file

**Scope:** every `.ts` / `.tsx` frontend file (components, hooks, pages, utils, services, etc.).

**Rules:**

- Use the **fixed group order** below — never reorder groups.
- Each **used** group starts with **exactly one** comment line (`// React`, `// Next`, …). Labels are case-sensitive and must match.
- **Skip** groups with no imports (do not leave empty comment blocks).
- Imports within a group: one statement per line; barrel paths only (see § Centralized barrel exports).
- **Styles** is always the **last** import group (co-located `*.scss` for that file).
- After the import block, file-level sections use `// Constants` then `// Types (module-local)` when needed.

### Fixed group order (canonical)

| # | Comment | Sources |
|---|---------|---------|
| 1 | `// React` | `react`, `react-dom` |
| 2 | `// Next` | `next/*` |
| 3 | `// Libraries` | third-party (`next-intl`, `@tanstack/*`, …) |
| 4 | `// Hooks` | `@hooks/index` |
| 5 | `// Components` | `@components/index` |
| 6 | `// Icons` | `@icons/index` |
| 7 | `// Utils` | `@utils/index` |
| 8 | `// Constants` | `@constants/index` |
| 9 | `// Services` | `@services/actions/index`, `@services/fetchers/index` |
| 10 | `// Types` | `@services/dto/index`, then `@types/index` if used |
| 11 | `// Styles` | co-located `./Component.scss` only |

### Canonical import block (reference)

```typescript
// React
import { useCallback, useMemo, useState } from "react";
// Next
import Link from "next/link";
// Libraries
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
// Hooks
import { useMyCustomHook } from "@hooks/index";
// Components
import { Avatar } from "@components/index";
// Icons
import { MoreHorizonIcon } from "@icons/index";
// Utils
import { encryptPostUrl } from "@utils/index";
// Constants
import { FEED_LIMIT } from "@constants/index";
// Services
import { getFeedAction } from "@services/actions/index";
import { getFeedFetcher } from "@services/fetchers/index";
// Types
import type { UserDTO } from "@services/dto/index";
// Styles
import "./Card.scss";

// Constants
const DEFAULT_TAB = "home";

// Types (module-local)
type CardProps = { id: string };
```

Full walkthrough: [front-dev-patterns § Import order](../skills/front-dev-patterns/SKILL.md#import-order).

---

## File length

| Lines | Action |
|-------|--------|
| ≤ ~200 | No action |
| > ~200 and ≤ ~250 | Optional split (subcomponent, hook, `*.utils.ts`, `*.constants.ts`, `*.types.ts`) |
| > ~250 | **Required split** before merge |

---

## Component body order

Comment each section inside the component:

1. `// Props`
2. `// Params` — URL/search params, refs
3. `// Queries` — derived from params or external data
4. `// State`
5. `// Hooks` — `useMemo`, `useTranslations`, custom hooks; JSX-in-`const` `useMemo` lives here
6. `// Values` — computed / `watch()`
7. `// Actions` — handlers, `useCallback`
8. `useEffect` — before `return`; external sync only
9. `return`

---

## No `switch` — mapping objects

Use lookup object + `??` fallback. Exceptions: complex multi-line cases, fall-through, non-mappable logic.

---

## Multiple equalities — `includes`

Replace `a === x \|\| a === y` with a typed constant array and `.includes(value)`.

---

## JSX in a variable — `useMemo`

Wrap assigned JSX in `useMemo` with full deps. Guards first (early `return null`), happy path last. Place in **Hooks**.

---

## State management

- No `useEffect` for data sync or prop derivation.
- Prefer: derived values in render · event handlers · React Query / SWR · `useMemo` when expensive.
- `useEffect` only for external systems (WebSocket, third-party DOM, timers). Justify each one.
