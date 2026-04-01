# AGENTS.md

## Project Overview
- This repository contains two separate apps that are maintained together:
- `front/dodoshark`: Next.js 16 + React 19 frontend
- `studio-dodoshark`: Sanity Studio 5 content management app
- The frontend and Studio are tightly coupled. Schema changes in Studio often require matching updates in frontend types, renderers, preview behavior, and page-builder merge logic.

## Repository Structure
- `front/dodoshark/app`: Next.js app routes and page entrypoints
- `front/dodoshark/components/page-builder`: page builder blocks, merged-section behavior, and shared block rendering logic
- `front/dodoshark/components/ui`: shared UI primitives, including `CMSImage`
- `front/dodoshark/lib`: Sanity client helpers, data access, and frontend mapping utilities
- `studio-dodoshark/schemaTypes`: Sanity document and object schemas
- `studio-dodoshark/schemaTypes/objects/pageBuilder`: page builder block schemas and editor-facing configuration

## Working Rules
- Prefer minimal, local changes that preserve the current design language and component structure.
- Reuse existing helpers and components before creating new files.
- Do not introduce new page-level abstractions unless reuse clearly justifies them.
- Keep frontend block data types aligned with Sanity schema values.
- Do not silently change schema enum values without updating frontend renderers and relevant unions.
- Treat the frontend and Studio as separate apps. There is no root workspace runner.
- After AI code edits, do not run `pnpm run lint` or `pnpm run build`; a human handles those checks manually.

## Page Builder Guidance
- Shared background styling lives in `front/dodoshark/components/page-builder/backgroundTheme.ts`.
- When adding or changing background variants, update the Studio option lists, frontend union types, and any merge logic that compares backgrounds.
- Rich section and feature list have explicit merged behavior. Treat them as one coupled system.
- If changing page-builder merge behavior, also review:
- `front/dodoshark/components/page-builder/richFeatureMerge.ts`
- `front/dodoshark/components/page-builder/MergedRichFeatureSection.tsx`
- affected block renderers
- When `mergeWithPreviousRichSection` is enabled on feature list:
- frontend behavior should ignore the block title
- Studio behavior should not force editors to manually clear hidden fields

## Frontend Conventions
- Keep page-builder components theme-driven rather than branching on hardcoded dark/light checks where possible.
- Prefer extending existing block components over adding parallel variants.
- Preserve responsive behavior on mobile and desktop when modifying layouts.
- For Swiper-based blocks, preserve the current accessibility labels, dots, and arrow behavior unless the request explicitly changes them.
- Use `renderText()` for Sanity text fields so both Portable Text and plain strings are handled consistently.

## Sanity Studio Conventions
- Keep editor-facing option labels clear and consistent.
- If a field is hidden because of another toggle, prefer ignoring stale values over raising editor-facing validation errors unless the field is truly invalid.
- Update schema preview text when behavior changes so editors see the actual effective state.

## Data Handling And Fallbacks
- Array fallbacks: never rely on `parsedData ?? fallbackData` when the left side may be an empty array. Empty arrays are truthy and will suppress the fallback.
- Correct pattern: `const items = parsedItems && parsedItems.length > 0 ? parsedItems : fallbackItems`
- Image fallbacks: when migrating hardcoded assets to Sanity, keep the hardcoded `<Image />` fallback in the JSX until CMS data is fully verified.
- Preferred Sanity image component: `front/dodoshark/components/ui/CMSImage.tsx`
- Standalone image pattern: `{sanityImage?.asset ? <CMSImage image={sanityImage} width={800} height={600} /> : <Image src="/path.png" width={800} height={600} alt="Fallback" />}`
- Mapping pattern:

```tsx
const homeFeatures = data?.features?.map((item, index) => ({
  title: renderText(item.title),
  image: getSanityImageUrl(item.image) || fallbackData[index].image,
  sanityImage: item.image,
})) ?? []
```

## Change Checklist
- If you change a page-builder schema:
- update the matching frontend block type
- update the renderer
- update merge or grouping logic if relevant
- update Studio preview text if editor behavior changed
- If you change a shared block renderer:
- check both standalone and merged rendering paths
- check mobile and desktop behavior
- verify hidden fields are ignored safely when stale content exists

## Commands
- Frontend dev: `cd front/dodoshark && pnpm run dev`
- Frontend start: `cd front/dodoshark && pnpm run start`
- Frontend build: `cd front/dodoshark && pnpm run build`
- Frontend lint: `cd front/dodoshark && pnpm run lint`
- Studio dev: `cd studio-dodoshark && pnpm run dev`
- Studio start: `cd studio-dodoshark && pnpm run start`
- Studio build: `cd studio-dodoshark && pnpm run build`

## Notes
- Default framework READMEs in sub-apps are not authoritative for repository-specific behavior.
- For page-builder behavior, use the schema files and block renderers as the source of truth.
