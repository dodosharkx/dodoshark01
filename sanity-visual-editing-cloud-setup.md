# Sanity Visual Editing Cloud Setup

This repo already contains the core Visual Editing wiring:

- `studio-dodoshark` uses `presentationTool(...)`
- `front/dodoshark` exposes `/api/draft/enable` and `/api/draft/disable`
- `front/dodoshark` renders both `SanityLive` and `VisualEditing`

To make Visual Editing work with a cloud-hosted Studio, finish the deployment configuration below.

## Required Deployments

1. Deploy the frontend to a public URL.
2. Deploy the Sanity Studio to a public URL.

Visual Editing needs both apps to be reachable from the browser. A cloud Studio cannot preview a local-only frontend.

## Frontend Environment

Set these in the deployed frontend:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=nljl95h9
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_STUDIO_URL=https://dodoshark.sanity.studio
SANITY_API_READ_TOKEN=your_sanity_read_token
```

Notes:

- `NEXT_PUBLIC_SANITY_STUDIO_URL` should point to the deployed Studio URL used by editors.
- `SANITY_API_READ_TOKEN` is required for Draft Mode and live preview behavior.

## Studio Environment

Set this in the deployed Studio:

```bash
SANITY_STUDIO_PREVIEW_ORIGIN=https://www.dodoshark.vip
```

Notes:

- This must be the public frontend origin loaded inside Presentation Tool.
- Do not leave it pointing at `http://localhost:3000` in cloud deployments.

## Cloudflare Worker Secret

The frontend in this repo is deployed through Cloudflare Workers (`front/dodoshark/wrangler.jsonc`).

`SANITY_API_READ_TOKEN` must be configured in the production Worker as a secret. If it is missing, `GET /api/draft/enable` returns:

```text
Visual editing is disabled: Missing SANITY_API_READ_TOKEN environment variable in production.
```

That `401` blocks the Presentation Tool handshake before Sanity can validate the preview secret.

## Sanity Project Settings

In the Sanity project settings, make sure the frontend origin is allowed where required for your setup.

At minimum, verify the public frontend domain is configured consistently with your preview flow.

## Validation Checklist

1. Open the deployed Studio.
2. Enter Presentation Tool.
3. Confirm the iframe loads the deployed frontend instead of `localhost`.
4. Click into Draft Mode.
5. Edit a title or page-builder field and verify the preview updates live.
6. Click highlighted content in the preview and verify it resolves back to the correct field in Studio.

## Local Development Defaults

- Frontend default Studio URL:
  - development: `http://localhost:3333`
  - production: `https://dodoshark.sanity.studio`
- Studio default preview origin:
  - development: `http://localhost:3000`
  - production: `https://www.dodoshark.vip`

Override either default with environment variables when previewing a different environment.
