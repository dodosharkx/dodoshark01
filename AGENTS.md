# AGENTS.md

## Project Overview
- This repository contains two separate apps:
  - `front/dodoshark`: Next.js 16 + React 19 frontend
  - `studio-dodoshark`: Sanity Studio 5 content management app
- The frontend and Studio are tightly coupled. Any schema change in Studio may require matching updates in frontend types, rendering logic, and merge behavior.

## Repository Structure
- `front/dodoshark/app`: Next.js app routes and page entrypoints
- `front/dodoshark/components/page-builder`: page builder rendering components and shared block logic
- `front/dodoshark/components/ui`: shared UI building blocks
- `front/dodoshark/app/lib`: Sanity client helpers and data access
- `studio-dodoshark/schemaTypes`: Sanity document/object schemas
- `studio-dodoshark/schemaTypes/objects/pageBuilder`: schema definitions for page builder blocks

## Working Rules
- Prefer minimal, local changes that preserve the current design language and component structure.
- Do not introduce new page-level abstractions unless reuse clearly justifies them.
- Reuse existing helpers before creating new files.
- Keep frontend block data types aligned with Sanity schema values.
- Do not silently change schema enum values without updating frontend renderers.
- After an AI agent finishes code changes, do not run `pnpm run lint` or `pnpm run build`; those verification steps are handled manually.
- If changing page builder merge behavior, also review:
  - `front/dodoshark/components/page-builder/richFeatureMerge.ts`
  - `front/dodoshark/components/page-builder/MergedRichFeatureSection.tsx`
  - affected block renderers

## Page Builder Guidance
- Shared background styling lives in `front/dodoshark/components/page-builder/backgroundTheme.ts`.
- When adding or changing background variants:
  - update Studio schema option lists
  - update frontend union types
  - update merge logic where background equality matters
- Rich section and feature list have explicit merged behavior. Treat them as a coupled system.
- When `mergeWithPreviousRichSection` is enabled in feature list:
  - frontend behavior should ignore the block title
  - Studio behavior should not force editors to manually clear hidden fields

## Frontend Conventions
- Keep page builder components theme-driven rather than branching on hardcoded dark/light checks where possible.
- Prefer extending existing block components over adding parallel variants.
- For Swiper-based blocks, preserve current accessibility labels, dots, and arrow behavior unless the request explicitly changes them.
- Preserve responsive behavior on mobile and desktop when modifying layouts.

## Sanity Studio Conventions
- Keep editor-facing option labels clear and consistent.
- If a field is hidden in Studio because of another toggle, prefer ignoring stale values over raising editor-facing validation errors unless the field is truly invalid.
- Update schema preview text when behavior changes so editors see the actual effective state.

## Commands
- Frontend dev: `cd front/dodoshark && pnpm run dev`
- Frontend build: `cd front/dodoshark && pnpm run build`
- Frontend lint: `cd front/dodoshark && pnpm run lint`
- Studio dev: `cd studio-dodoshark && pnpm run dev`
- Studio build: `cd studio-dodoshark && pnpm run build`
- Note: AI agents should not run `pnpm run lint` or `pnpm run build` after edits; a human will perform those checks manually.

## Change Checklist
- If you change a page builder schema:
  - update the matching frontend block type
  - update the renderer
  - update merge/grouping logic if relevant
  - update Studio preview text if editor behavior changed
- If you change a shared block renderer:
  - check both standalone and merged rendering paths
  - check mobile and desktop behavior
  - verify hidden fields are ignored safely when stale content exists

## Notes
- There is no root workspace runner configured here; treat frontend and Studio as separate apps.
- Default READMEs are not authoritative for project-specific behavior. Prefer the page builder and schema source files as the source of truth.
