# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`).

```bash
pnpm dev        # Vite dev server
pnpm build      # tsc -b && vite build (typecheck is part of build)
pnpm lint       # eslint .
pnpm preview    # preview production build
```

No test runner is configured yet.

## Architecture

- **React 19 + Vite + TypeScript**, SPA only (no SSR).
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` plugin (no `tailwind.config` file — config lives in `src/index.css`). shadcn/ui components are copied into `src/components/ui/` and owned by this repo (style: `radix-nova`, base color `neutral`, icons `lucide`). Add new shadcn components via the `shadcn` CLI — do not hand-write them from scratch.
- **Path alias**: `@/*` → `src/*` (configured in `tsconfig.app.json` and Vite). Always import via `@/...` not relative paths across the `src` boundary.

## Conventions

- TypeScript strict-ish flags on: `verbatimModuleSyntax`, `noUnusedLocals/Parameters`, `erasableSyntaxOnly`. Use `import type { … }` for type-only imports.
- Commit messages follow Conventional Commits in Korean (e.g. `chore: tailwind + shadcn ui 세팅`).
