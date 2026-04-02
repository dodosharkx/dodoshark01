# DoDoShark Sanity Studio

This app is the Sanity Studio for the DoDoShark site. It owns the content schema, editor tooling, and preview / presentation integration used by the frontend.

## Stack

- Sanity Studio 5
- React 19
- TypeScript
- Presentation / preview integration with the frontend

## Development

Use `pnpm` for all commands.

```bash
pnpm install
pnpm run dev
```

Local Studio URL: `http://localhost:3333`

Other common commands:

- `pnpm run start`
- `pnpm run build`
- `pnpm run deploy`
- `pnpm run deploy-graphql`

## Environment

Configure the Studio environment as needed:

- `SANITY_STUDIO_PREVIEW_ORIGIN`

Default local preview origin is `http://localhost:3000`.

## Important Paths

- `schemaTypes/`: document, singleton, and object schemas
- `schemaTypes/objects/pageBuilder/`: page-builder block definitions
- `presentation/`: preview / presentation wiring
- `functions/`: Sanity function handlers
- `scripts/`: one-off or maintenance-oriented migration utilities

## Working Rules

- Keep editor-facing labels and previews clear and consistent.
- If a hidden field can contain stale data, prefer safely ignoring that data instead of forcing editor cleanup.
- When changing schema values or enums, verify the matching frontend types and renderers in `front/dodoshark`.
- Treat schema and frontend rendering as a coupled system.

## Repository Hygiene

- Do not commit generated Studio build output such as `dist/`.
- Do not commit generated function build output under `functions/**/.build`.
- Keep local backup archives and export bundles out of the app source tree; use the ignored root `archive/` folder for local retention.
- Leave `scripts/` for real maintenance utilities only; one-off investigation files should not accumulate here.
