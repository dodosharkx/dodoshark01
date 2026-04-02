# DoDoShark Monorepo

This repository contains the DoDoShark website frontend and its Sanity Studio. The two apps are developed side by side and share a single content model.

## Apps

### `front/dodoshark`
- Next.js 16
- React 19
- Tailwind CSS 4
- Sanity-powered content rendering
- Cloudflare-oriented production build via OpenNext

### `studio-dodoshark`
- Sanity Studio 5
- Schema definitions for pages, page-builder blocks, and editor tooling
- Presentation / preview integration with the frontend

## Repository Layout

```text
.
|-- AGENTS.md
|-- front/
|   `-- dodoshark/
|       |-- app/
|       |-- components/
|       |   |-- page-builder/
|       |   `-- ui/
|       `-- lib/
`-- studio-dodoshark/
    |-- schemaTypes/
    |   `-- objects/pageBuilder/
    `-- presentation/
```

## Requirements

- Node.js 20+
- pnpm 10+

Both apps enforce `pnpm` through `preinstall`.

## Install

Install dependencies separately for each app:

```bash
cd front/dodoshark
pnpm install

cd ../../studio-dodoshark
pnpm install
```

## Environment Variables

### Frontend

Copy `front/dodoshark/.env.example` to `front/dodoshark/.env.local` and fill in:

- `RESEND_API_KEY`
- `LEAD_TO_EMAIL`
- `LEAD_FROM_EMAIL`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_STUDIO_URL`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_READ_TOKEN`

Notes:
- `NEXT_PUBLIC_SANITY_STUDIO_URL` defaults to `http://localhost:3333` in development.
- `SANITY_API_READ_TOKEN` is required for Draft Mode and Visual Editing.

### Studio

Copy `studio-dodoshark/.env.example` as needed and configure:

- `SANITY_STUDIO_PREVIEW_ORIGIN`

Default local preview origin is `http://localhost:3000`.

## Development

Run the apps independently in separate terminals.

### Frontend

```bash
cd front/dodoshark
pnpm run dev
```

Frontend dev server: `http://localhost:3000`

### Studio

```bash
cd studio-dodoshark
pnpm run dev
```

Studio dev server: `http://localhost:3333`

## Common Scripts

### Frontend
- `pnpm run dev`
- `pnpm run start`
- `pnpm run build`
- `pnpm run build:next`
- `pnpm run deploy`
- `pnpm run lint`

### Studio
- `pnpm run dev`
- `pnpm run start`
- `pnpm run build`
- `pnpm run deploy`
- `pnpm run deploy-graphql`

## Coupling Rules

When updating Sanity schemas, also verify the frontend layer that consumes them.

- Update matching frontend block types and unions.
- Update the relevant renderer in `front/dodoshark/components/page-builder`.
- If background variants change, also update `backgroundTheme.ts`.
- If rich-section / feature-list merge behavior changes, review:
- `front/dodoshark/components/page-builder/richFeatureMerge.ts`
- `front/dodoshark/components/page-builder/MergedRichFeatureSection.tsx`

## Content Rendering Rules

- Use `renderText()` for Sanity text fields so plain strings and Portable Text are handled consistently.
- Do not rely on `??` alone for array fallbacks when empty arrays are possible.
- Keep hardcoded `<Image />` fallbacks until Sanity image data is fully verified.
- Prefer `front/dodoshark/components/ui/CMSImage.tsx` for Sanity image rendering.

## Notes For AI Agents

- Read `AGENTS.md` before making changes.
- Prefer minimal, local edits.
- Do not run `pnpm run lint` or `pnpm run build` after code edits unless a human explicitly asks for it.

## Repository Hygiene

- `archive/` is a local holding area for historical scripts, reports, one-off exports, and removed assets. It is intentionally ignored and should not be used for active source files.
- Keep large local backup/export archives out of source paths. Store them under `archive/` or leave them untracked.
- Do not commit generated reports such as lint dumps or runtime error text files.
- Do not commit temporary image folders under `front/dodoshark/public/assets/images/**/temp`.
- Do not commit generated function build output under `studio-dodoshark/functions/**/.build`.
- If a file is only needed for local investigation or one-time migration, move it under `archive/` instead of leaving it at the repository root.
