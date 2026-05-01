# Codebase Guide for AI Agents

React 19 + TypeScript + Vite dashboard that visualizes Deezer music data using TanStack Query, shadcn/ui, Recharts, and Tailwind CSS v4.

Start in [src/main.tsx](src/main.tsx) and [src/App.tsx](src/App.tsx). For project-specific coding rules in `src/**`, also load:

- [.github/instructions/project-conventions.instructions.md](.github/instructions/project-conventions.instructions.md)
- [.github/instructions/code-quality.instructions.md](.github/instructions/code-quality.instructions.md)

## Commands

| Command           | Purpose                          |
| ----------------- | -------------------------------- |
| `npm run dev`     | Vite dev server with HMR         |
| `npm run build`   | `tsc -b` + Vite production build |
| `npm run lint`    | ESLint                           |
| `npm run preview` | Preview production build         |

## Architecture

### Source layout

```
src/
├── api/config/          ← HTTP client + QueryClient singleton
├── api/modules/<mod>/   ← <mod>.api.ts, <mod>.types.ts, <mod>.hooks.ts
├── components/          ← feature components (PascalCase .tsx)
│   ├── shared/          ← reusable components (folder + barrel index.ts)
│   └── ui/              ← shadcn primitives only — do not modify
├── data/                ← static/mock data used by components
├── hooks/               ← general-purpose hooks
├── lib/                 ← utility functions (chart transforms, cn helper)
└── types/               ← shared TypeScript types
```

### Conventions

See [.github/instructions/project-conventions.instructions.md](.github/instructions/project-conventions.instructions.md) for naming, folder structure, API layer rules, and Tailwind conventions.

Representative files:

- HTTP client factory: [src/api/config/fetch.ts](src/api/config/fetch.ts)
- Query defaults: [src/api/config/query.ts](src/api/config/query.ts)
- API module example: [src/api/modules/deezer/deezer.api.ts](src/api/modules/deezer/deezer.api.ts), [src/api/modules/deezer/deezer.hooks.ts](src/api/modules/deezer/deezer.hooks.ts), [src/api/modules/deezer/deezer.types.ts](src/api/modules/deezer/deezer.types.ts)
- Shared component pattern: [src/components/shared/Typography/index.ts](src/components/shared/Typography/index.ts)
- Class merging helper: [src/lib/utils.ts](src/lib/utils.ts)

## Key Patterns

### TanStack Query setup

`QueryClient` defaults are defined in [src/api/config/query.ts](src/api/config/query.ts): `refetchOnWindowFocus: false`, `retry: false`, `gcTime: 5 min`.

Current runtime wiring in [src/main.tsx](src/main.tsx) instantiates `new QueryClient()` inline instead of importing the shared client. Do not assume [src/api/config/query.ts](src/api/config/query.ts) is active unless you wire it in.

### Lazy queries

Use `enabled: !!id` to defer fetching until a dependency resolves:

```ts
const { data } = useDeezerArtistTopTracks(artistId); // only fires when artistId is truthy
```

### Parallel queries

Use `useQueries()` (not multiple `useQuery`) when fetching a dynamic list of resources in parallel. See `useDeezerAllTracks()` in `src/api/modules/deezer/deezer.hooks.ts`.

### Derived state

Derive values directly from query data — avoid `useEffect` + `useState` for derived state:

```ts
const artistId = searchData?.data[0]?.id ?? null; // stays in sync automatically
```

### CORS proxy

All Deezer API calls are routed through `https://proxy.corsfix.com/?https://api.deezer.com`.  
The base URL is defined in `src/constants.ts`.

### App composition

- [src/App.tsx](src/App.tsx) mixes static dashboard demo data from `src/data/` with the live Deezer feature in [src/components/DeezerDashboard.tsx](src/components/DeezerDashboard.tsx)
- Chart shaping logic for the Deezer view lives in [src/lib/chart.ts](src/lib/chart.ts)

## TypeScript

- Path alias: `@/*` → `./src/*` (configured in `tsconfig.json` and `vite.config.ts`)
- Strict mode enabled — no unused locals/parameters allowed
- `verbatimModuleSyntax` is enabled — use `import type` for type-only imports
- Use `cn()` from [src/lib/utils.ts](src/lib/utils.ts) rather than importing `clsx` or `classnames` directly

## Styling

- **Tailwind CSS v4** — imported via `@import "tailwindcss"` in `src/index.css`
- Dark mode via `@custom-variant dark (&:is(.dark *))` — toggle `.dark` on `<html>`
- **shadcn/ui** style: `radix-nova`, CSS variables enabled, icons via Lucide React
- `cn()` helper is in `src/lib/utils.ts` (re-exports `clsx` + `tailwind-merge`)

## Gotchas

- The repo worktree may contain exploratory comments or partially wired examples; verify imports before treating a file as active runtime behavior
- Several dashboard charts still use static demo data from `src/data/`; not every chart is backed by live API state
- Treat files in `src/components/ui/` as shadcn primitives unless the task explicitly asks to modify them
