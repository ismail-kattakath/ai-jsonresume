# Development & Roadmap

This document outlines the internal development plans, refactoring strategies, and quality standards for AI JSONResume.

## 📋 Table of Contents

- [1. UX Enhancements Roadmap](#1-ux-enhancements-roadmap)
- [2. Drag-and-Drop Refactoring (DRY)](#2-drag-and-drop-refactoring-dry)
- [3. ESLint Gradual Improvement Plan](#3-eslint-gradual-improvement-plan)

---

## 1. UX Enhancements Roadmap

Our mission is to make the Resume Builder maximum user-friendly through contextual assistance and guidance.

### Completed Work

- **Tooltip System**: Contextual help on all relevant UI elements.
- **Mobile Preview**: Proportional CSS scaling to show resume layouts on mobile devices.

### Future Work (Onboarding)

We plan to implement an interactive onboarding tour using **Onborda** (Next.js specific guide library).

- **Tour Steps**: Introduction to dual-mode editing, preview pane, AI settings, and export features.
- **User Control**: Option to skip or replay the tour, with progress saved in `localStorage`.

---

## 2. Drag-and-Drop Refactoring (DRY)

We have refactored the drag-and-drop functionality to eliminate duplication across form components.

### Core Utilities

- **`useDragAndDrop` Hook**: Encapsulates reordering logic.
- **`DraggableCard` Component**: Provides consistent styling and drag handles.
- **SSR-Safe Wrappers**: `DnDContext` and `DnDDroppable` with disabled SSR for Next.js compatibility.

### Benefits

- **64% Code Reduction**: Migration from manual implementations to utilities reduces boilerplate significantly.
- **Consistency**: Unified styling across all draggable items (Skills, Work, Education, etc.).

---

## 3. ESLint Gradual Improvement Plan

We are progressively tightening our linting rules to improve codebase quality.

### Strategy

1. **Critical Rules Enforcement**: All blocking errors or potential bugs are fixed immediately.
2. **Scheduled Cleanup Phases**:
   - **Phase 2-3**: Clean up unused variables in tests and source code.
   - **Phase 4-5**: Systematic replacement of `any` types with proper TypeScript interfaces.
3. **Strict Enforcement**: Once violations are cleared, warnings are converted to errors in `.eslintrc`.

### Current Status

- Zero critical violations.
- Priority: Reducing `@typescript-eslint/no-explicit-any` across the codebase.

---

## Technical Maintenance

- **Testing**: Run `npm test` to verify logic changes.
- **Linting**: Run `npm run lint` before committing.
- **Building**: Run `npm run build` to ensure production readiness.
