# CLAUDE.md - Developer Guide

Core technical reference and workflow guide for **AI JSONResume**.

## 🚀 Quick Commands

```bash
npm run dev          # Dev server (port 3000)
npm run dev:reload   # Clear cache + Restart (Solves port conflicts)
npm test             # Run all tests
npm run build        # Production build (Static Export)
npm run lint         # ESLint check
npm run format       # Prettier format
```

## 🏗️ Architecture & Data Flow

The project follows a **Data-First** architecture using the [JSON Resume](https://jsonresume.org) standard.

1. **Source**: `src/data/resume.json` (Single Source of Truth)
2. **Adapter**: `src/lib/resumeAdapter.ts` (JSON Resume → Internal Types)
3. **App**: `src/app/page.tsx` (Homepage) & `src/app/resume/builder/page.tsx` (Editor)

**Key Directories:**

- `src/app/`: Next.js App Router (Pages & Routes)
- `src/components/`: UI Components (sections, document-builder, auth)
- `src/lib/`: Logic, Adapters, Contexts, Hooks
- `src/types/`: TypeScript definitions (kebab-case)
- `docs/`: Technical and feature guides

## 🎨 Coding Standards

- **Naming**: `PascalCase.tsx` (Components), `camelCase.ts` (Utils), `kebab-case.ts` (Types)
- **Imports**: Always use `@/` alias (e.g., `import { ... } from '@/lib/utils'`)
- **Types**: Strict TypeScript. Avoid `any`. Update types → adapter → components in order.
- **Data**: **NEVER** edit components for content. Edit `src/data/resume.json` instead.
- **Styling**: Tailwind CSS 4. Use utility classes; avoid custom CSS.

## 🧪 Testing & Quality

- **Enforcement**: 85% coverage minimum (enforced by Jest).
- **Location**: Store tests in `__tests__/` subdirectories next to the source.
- **Execution**: `npm test -- <path>` runs specific tests. `npm test:watch` for dev.
- **Hooks**: Husky auto-runs Lint + Prettier. **Never bypass hooks.**

## 🔀 GitHub Workflow (MANDATORY)

1. **Never commit to `main`.** Always use feature branches (`feat/`, `fix/`, `docs/`).
2. **Issue-First**: Create a GitHub issue before starting significant work.
3. **PR Process**: Create PR → Wait for CI checks → Request review → Merge after approval.

## 🧹 Hygiene & Logging

- **Logs**: troubleshooting logs MUST go in `logs/` (never root).
- **Scripts**: temporary scripts MUST go in `tmp/` (never root or `scripts/`).
- **Cleanups**: Delete feature branches after merging.

---

_See [ARCHITECTURE.md](./ARCHITECTURE.md) for deep dives and [docs/](./docs/) for feature setup._
