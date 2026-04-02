# DoDoShark Frontend

This app is the public-facing DoDoShark website built with Next.js 16, React 19, and Sanity-backed content.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Sanity content fetching and Visual Editing integration
- Resend-based form delivery

## Development

Use `pnpm` for all commands.

```bash
pnpm install
pnpm run dev
```

Local dev server: `http://localhost:3000`

Other common commands:

- `pnpm run start`
- `pnpm run cf-typegen`
- `pnpm run build`
- `pnpm run build:cloudflare`
- `pnpm run build:next`
- `pnpm run deploy`
- `pnpm run lint`

## Environment

Copy `.env.example` to `.env.local` and provide the required values:

- `RESEND_API_KEY`
- `LEAD_TO_EMAIL`
- `LEAD_FROM_EMAIL`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_STUDIO_URL`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_READ_TOKEN`

Notes:

- `NEXT_PUBLIC_SANITY_STUDIO_URL` defaults to `http://localhost:3333` in local development.
- `SANITY_API_READ_TOKEN` is used by the frontend's draft / preview workflow.
- The contact form on `/contact` only requires `RESEND_API_KEY` and `LEAD_TO_EMAIL` in production. `LEAD_FROM_EMAIL` is optional.
- If you still maintain the Cloudflare deployment path, rerun `pnpm run cf-typegen` after changing `wrangler.jsonc`.

## Important Paths

- `app/`: routes and page entrypoints
- `components/page-builder/`: Sanity page-builder rendering
- `components/ui/`: shared UI primitives
- `lib/`: Sanity helpers, SEO helpers, and app data mapping
- `public/assets/images/`: tracked fallback and static site assets

## Working Rules

- Reuse existing helpers and components before adding new files.
- Keep page-builder frontend types aligned with Studio schema values.
- Preserve mobile and desktop behavior when changing layouts.
- Use `renderText()` for Sanity text fields.
- Keep hardcoded image fallbacks until CMS data is verified.

## Repository Hygiene

- Do not commit generated reports such as lint dumps or runtime error text files.
- Do not commit temporary assets under `public/assets/images/**/temp`.
- Do not commit build output such as `.next/`, `.open-next/`, or `.wrangler/`.
- Large local backup archives should stay outside source paths or be moved under the ignored root `archive/` folder.
