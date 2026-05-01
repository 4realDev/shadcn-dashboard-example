---
description: "Use when writing TypeScript, fixing lint errors, handling async functions, or working with imports and class utilities. Covers strict TypeScript requirements, ESLint rules, and Tailwind scale conventions."
applyTo: "src/**"
---

# Code Quality Rules

## TypeScript Imports

`verbatimModuleSyntax` is enabled — type-only imports must use `import type`:

```ts
import type { PropsWithChildren } from "react"; // ✓
import { PropsWithChildren } from "react"; // ✗ — will error at build time
```

Use `cn()` from `@/lib/utils` for className merging — never import `classnames` or `clsx` directly:

```ts
import { cn } from "@/lib/utils"; // ✓
import cn from "classnames"; // ✗ — not installed, use cn() instead
```

## Unused Variables

ESLint enforces `@typescript-eslint/no-unused-vars`. Prefix intentionally unused vars/params with `_` to suppress:

```ts
const [_ignored, setCount] = useState(0); // ✓
// do NOT use eslint-disable comments to suppress
```

## Async / Promises

- Every `async` function must contain at least one `await` (`require-await` rule)
- All returned promises must be handled — no fire-and-forget (`no-floating-promises` rule)

## Tailwind Classes

Prefer standard Tailwind scale values over arbitrary syntax:

| Arbitrary       | Preferred  |
| --------------- | ---------- |
| `h-[300px]`     | `h-75`     |
| `max-w-[200px]` | `max-w-50` |
| `min-w-[160px]` | `min-w-40` |
