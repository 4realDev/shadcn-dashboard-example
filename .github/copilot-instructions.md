---
description: "Always-on project instructions for the React 19 + TypeScript dashboard. Use when working in this repository, especially in src/**. Based on AGENTS.md and the code-quality instructions."
---

# GitHub Copilot Instructions

Use [AGENTS.md](AGENTS.md) as the primary codebase map. Start there for runtime entrypoints, architectural context, and repo-specific gotchas.

Apply these defaults across the repository:

- Anchor runtime behavior in [src/main.tsx](src/main.tsx) and [src/App.tsx](src/App.tsx) before assuming a documented pattern is already wired.
- Treat `src/components/ui/**` as shadcn primitives and avoid editing those files unless the task explicitly requires it.
- Keep TanStack Query work consistent with the repo guidance in [AGENTS.md](AGENTS.md): use `enabled: !!id` for dependent queries, prefer `useQueries()` for dynamic parallel fan-out, and derive state from query results instead of mirroring data through `useEffect` and `useState`.
- Be careful with QueryClient assumptions: defaults are defined in `src/api/config/query.ts`, but current runtime wiring in `src/main.tsx` instantiates `new QueryClient()` inline.
- Distinguish static demo data in `src/data/**` from live Deezer-backed views and hooks.

For TypeScript and lint-sensitive work in `src/**`, follow [.github/instructions/code-quality.instructions.md](.github/instructions/code-quality.instructions.md):

- Use `import type` for type-only imports because `verbatimModuleSyntax` is enabled.
- Use `cn()` from `@/lib/utils` for class merging. Do not import `clsx` or `classnames` directly.
- Prefix intentionally unused variables or parameters with `_` instead of suppressing lint rules.
- Do not leave floating promises, and do not mark functions `async` unless they actually `await`.
- Prefer standard Tailwind scale classes over arbitrary values when the scale already covers the need.

Useful commands:

- `npm run dev`
- `npm run build`
- `npm run lint`
