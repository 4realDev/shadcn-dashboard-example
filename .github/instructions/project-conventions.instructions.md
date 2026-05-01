---
description: "Use when creating or modifying components, hooks, API modules, or styles. Covers project file naming, folder structure, API layer patterns, and Tailwind CSS conventions."
applyTo: "src/**"
---

# Project Conventions

## Component Structure & Naming

- **PascalCase** for all feature component files: `MyComponent.tsx`
- **kebab-case** for shadcn UI primitives in `src/components/ui/`: `toggle-group.tsx`
- Shared/reusable components go in `src/components/shared/<ComponentName>/` with a barrel `index.ts`
- Feature-specific components live directly at `src/components/`
- shadcn primitives (generated or installed) go in `src/components/ui/` only — do not modify them

## API Layer

Three-layer structure — never skip layers:

1. **`src/api/config/`** — generic HTTP client utilities (e.g., `fetch.ts`)
2. **`src/api/modules/<module>/`** — typed fetcher functions (`<module>.api.ts`) + types (`<module>.types.ts`)
3. **`src/api/modules/<module>/`** — TanStack Query hooks (`<module>.hooks.ts`) that wrap the fetchers

File naming uses dot-notation: `deezer.api.ts`, `deezer.hooks.ts`, `deezer.types.ts`

## Styling

- Use **Tailwind CSS utility classes** inline; avoid creating new CSS files for component-level styles
- Global/base styles only in `src/index.css` or `src/App.css`
- Do **not** use CSS Modules or styled-components

## General

- General-purpose hooks go in `src/hooks/`, module-specific hooks stay inside `src/api/modules/<module>/`
- Static data and constants go in `src/data/` or `src/constants.ts`, not hardcoded in components
