---
name: front-dev-patterns
description: >
  Examples and rationale for frontend code patterns (Next.js / React / TypeScript).
  Use when implementing or reviewing code and you need a full snippet or the "why"
  behind a rule. Enforcement rules (always apply) live in code-patterns.md — read
  that first; open this skill only for expanded examples.
---

# Front-dev patterns — examples & rationale

**Do not treat this file as a second rule set.** Canonical enforcement lives in
[code-patterns.md](../../rules/code-patterns.md) (`alwaysApply: true`).

| File | Role | When to read |
|------|------|----------------|
| [code-patterns.md](../../rules/code-patterns.md) | **What** — mandatory rules | Every frontend edit (applied automatically) |
| This skill | **How / why** — full snippets | Writing or reviewing a component; unclear how to apply a rule |

---

## Atomic design

**Rule:** [code-patterns.md § Atomic design](../../rules/code-patterns.md#atomic-design--mandatory-structure)

### Folder layout

```
src/
├── app/                          # Routes (pages compose templates/organisms)
├── components/
│   ├── index.ts                  # ← only public component API
│   ├── atoms/
│   │   └── Button/
│   │       ├── Button.tsx
│   │       └── Button.scss
│   ├── molecules/
│   │   └── FormField/
│   ├── organisms/
│   │   └── SiteHeader/
│   ├── templates/
│   │   └── MarketingPageTemplate/
│   └── Icons/
│       ├── index.ts
│       └── ChevronIcon/
├── hooks/index.ts
├── utils/index.ts
├── constants/index.ts
├── types/index.ts                # optional global types
├── services/
│   ├── actions/index.ts
│   ├── fetchers/index.ts
│   └── dto/index.ts
└── styles/
    ├── index.scss                # global entry (tokens, reset, mixins)
    └── _tokens.scss
```

### Layer choice

| You are building… | Layer | Example |
|-------------------|-------|---------|
| One primitive control | Atom | `Button`, `Input`, `Label` |
| 2+ atoms with one job | Molecule | `FormField` = `Label` + `Input` + error text |
| Distinct page section | Organism | `SiteHeader`, `ProductGrid` |
| Reusable page frame | Template | `DashboardTemplate`, `AuthTemplate` |
| Route + data + SEO | Page (`app/`) | `app/(marketing)/page.tsx` |

### Dependency rules

```typescript
// ✅ Organism imports lower layers via barrel
import { Button, Text } from "@components/index";

// ❌ Organism imports another organism’s internals
import { NavItem } from "@components/organisms/SiteHeader/NavItem/NavItem";

// ❌ Atom imports organism
import { SiteHeader } from "@components/index"; // in atoms/Button/Button.tsx
```

**Why:** Predictable complexity gradient; avoids circular UI dependencies and duplicate primitives.

---

## Centralized barrel exports

**Rule:** [code-patterns.md § Barrel exports](../../rules/code-patterns.md#centralized-barrel-exports--mandatory)

### Adding a component

```typescript
// src/components/atoms/Button/Button.tsx
export const Button = ({ … }: ButtonProps) => { … };

// src/components/index.ts
export { Button } from "./atoms/Button/Button";
export type { ButtonProps } from "./atoms/Button/Button.types";
```

### Consuming (any file outside the component folder)

```typescript
// ✅
import { Button, FormField, SiteHeader } from "@components/index";
import { formatDate } from "@utils/index";
import { FEED_LIMIT } from "@constants/index";
import { getFeedAction } from "@services/actions/index";
import type { UserDTO } from "@services/dto/index";

// ❌ Deep paths bypass the public API
import { Button } from "@components/atoms/Button/Button";
import { getFeedFetcher } from "@services/fetchers/feed/getFeedFetcher";
```

### Services sub-barrels

```typescript
// src/services/fetchers/feed/getFeedFetcher.ts
export const getFeedFetcher = async (…) => { … };
// src/services/fetchers/index.ts
export { getFeedFetcher } from "./feed/getFeedFetcher";
// Consumer
import { getFeedFetcher } from "@services/fetchers/index";
```

### Global styles

- **Per-component** SCSS stays next to the component (`Button.scss` imported in `Button.tsx`).
- **Tokens, reset, mixins** live under `src/styles/` and are pulled in once via `src/styles/index.scss` (e.g. in root `layout.tsx`), not duplicated per file.

**Why:** One import path per concern; refactors stay inside folders; tree-shaking and catalog tools (e.g. `INDEX_COMPONENTS.md`) stay accurate.

---

## Arrow functions

**Rule:** [code-patterns.md § Functions](../../rules/code-patterns.md#functions--arrow-functions)

```typescript
// ✅ Component, hook, handler
export const MyComponent = ({ id }: Props) => { … };
export const useFeed = () => { … };
const handleSubmit = () => { … };

// ❌
export default function MyComponent() { … }
function handleSubmit() { … }

// ✅ Exception — Next file convention only
export async function generateMetadata() { … }
```

**Why:** Consistent style; arrow components avoid `this` confusion and match the project’s export pattern.

---

## React imports

**Rule:** [code-patterns.md § React imports](../../rules/code-patterns.md#react-imports--named-only)

```typescript
import { ReactNode, useState } from "react";

type Props = { children: ReactNode };

// ❌
import React from "react";
type Props = { children: React.ReactNode };
```

---

## Import order

**Rule:** [code-patterns.md § Import order](../../rules/code-patterns.md#import-order--mandatory-for-every-file)

Standard for **any** frontend file. Copy the group comments verbatim; omit unused groups.

### Canonical block (copy as template)

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

### Comment schema (fixed labels)

| Order | Line | What goes below |
|-------|------|-----------------|
| 1 | `// React` | `react`, `react-dom` |
| 2 | `// Next` | `next/link`, `next/navigation`, … |
| 3 | `// Libraries` | npm packages (not `@components`, `@utils`, …) |
| 4 | `// Hooks` | `@hooks/index` |
| 5 | `// Components` | `@components/index` |
| 6 | `// Icons` | `@icons/index` |
| 7 | `// Utils` | `@utils/index` |
| 8 | `// Constants` | `@constants/index` |
| 9 | `// Services` | `@services/actions/index`, `@services/fetchers/index` (same block) |
| 10 | `// Types` | `import type` from `@services/dto/index`, then `@types/index` |
| 11 | `// Styles` | co-located `./FileName.scss` only — **always last** |

After imports (not part of the import block):

| Line | Purpose |
|------|---------|
| `// Constants` | file-level literals / mapping objects |
| `// Types (module-local)` | types used only in this file |

### Minimal file (only React + Styles)

```typescript
// React
import { useState } from "react";
// Styles
import "./Toggle.scss";
```

### Page without Styles group

```typescript
// React
import { Suspense } from "react";
// Next
import { notFound } from "next/navigation";
// Libraries
import { getTranslations } from "next-intl/server";
// Components
import { SiteHeader } from "@components/index";
// Services
import { getPageAction } from "@services/actions/index";
// Types
import type { PageDTO } from "@services/dto/index";
```

### Do / don’t

```typescript
// ❌ Wrong group order (Utils before Components)
// Utils
import { cn } from "@utils/index";
// Components
import { Card } from "@components/index";

// ❌ Deep path
import { Button } from "@components/atoms/Button/Button";

// ❌ Empty group
// Hooks

// ❌ Renamed comment
// 3rd party
import { z } from "zod";

// ✅ Correct
// Libraries
import { z } from "zod";
```

**Why:** One scan pattern across the codebase; reviews and autofixes stay predictable; barrels stay the only public import surface.

---

## File length — what to extract

**Rule:** [code-patterns.md § File length](../../rules/code-patterns.md#file-length)

When a file crosses ~250 lines, split before merge:

- Presentational chunk → sibling `*.tsx` subcomponent
- Reused logic → `use*.ts` hook or `*.utils.ts`
- Mapping objects / literals → `*.constants.ts`
- Props-only types → `*.types.ts`

---

## Component body order

**Rule:** [code-patterns.md § Component body order](../../rules/code-patterns.md#component-body-order)

```typescript
export const MyComponent = (props: Props) => {
  // Props
  const { id, onClose } = props;

  // Params
  const searchParams = useSearchParams();
  const ref = useRef<HTMLDivElement>(null);

  // Queries
  const tab = searchParams.get("tab") ?? "default";

  // State
  const [isOpen, setIsOpen] = useState(false);

  // Hooks
  const t = useTranslations("myComponent");
  const { data, isLoading } = useQuery({ queryKey: ["feed", id], … });

  const threadSection = useMemo(() => {
    if (!isOpen || !data?.items.length) return null;
    return <ThreadPanel items={data.items} />;
  }, [isOpen, data?.items]);

  // Values
  const items = data?.pages.flatMap((p) => p.items) ?? [];

  // Actions
  const handleClick = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    // External only — e.g. subscribe to socket
    return () => { … };
  }, []);

  return (
    <section ref={ref}>
      {threadSection}
      <button type="button" onClick={handleClick}>{t("toggle")}</button>
    </section>
  );
};
```

**Why:** Predictable scan order; reviewers find hooks, effects, and JSX in the same place in every file.

---

## Mapping objects instead of `switch`

**Rule:** [code-patterns.md § No switch](../../rules/code-patterns.md#no-switch--mapping-objects)

```typescript
const DOCUMENT_PATTERNS = {
  DNI: "[0-9]{8}[A-Za-z]",
  NIE: "[XYZxyz][0-9]{7}[A-Za-z]",
  Pasaporte: "[A-Za-z0-9]{6,20}",
} as const;

return DOCUMENT_PATTERNS[documentType as keyof typeof DOCUMENT_PATTERNS] ?? "";
```

**Why:** Exhaustiveness via `keyof typeof`, easier to test, no fall-through bugs.

---

## `includes` for multiple equalities

**Rule:** [code-patterns.md § includes](../../rules/code-patterns.md#multiple-equalities--includes)

```typescript
const SETTINGS_PANELS = ["settings", "myData", "portfolio"] as const satisfies readonly MyProfileSlidePanel[];
const isSettingsPanel = SETTINGS_PANELS.includes(panel);
```

---

## JSX in `useMemo`

**Rule:** [code-patterns.md § JSX useMemo](../../rules/code-patterns.md#jsx-in-a-variable--usememo)

```typescript
const threadSection = useMemo(() => {
  if (!shouldShow) return null;
  if (items.length === 0) return null;
  if (!onLoadMore) return null;
  return <ThreadPanel items={items} onLoadMore={onLoadMore} />;
}, [shouldShow, items, onLoadMore]);
```

**Why:** Avoid recreating element trees when deps unchanged; keeps heavy JSX out of the main `return` when gated by several conditions.

---

## State management — when *not* to use `useEffect`

**Rule:** [code-patterns.md § State management](../../rules/code-patterns.md#state-management)

| Situation | Prefer |
|-----------|--------|
| Value computable from props/state | Derive during render |
| User clicked / submitted | Event handler |
| Server data | React Query / SWR (or `await` in Server Component) |
| Expensive derivation | `useMemo` |
| WebSocket, map SDK, `document`, interval | `useEffect` + cleanup |

**Anti-pattern:**

```typescript
// ❌ Syncing props → state
useEffect(() => {
  setLabel(props.label);
}, [props.label]);

// ✅ Derive
const label = props.label;
```

If you add `useEffect`, state in the PR why render or handlers cannot cover the case.
