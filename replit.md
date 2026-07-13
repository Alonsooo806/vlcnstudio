# VLCN Studio

VLCN Studio is a premium apparel-customization storefront (wizard-style product configurator, price tracker, WhatsApp support flow, order-status timeline) for a Temuco, Chile-based print shop.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/mockup-sandbox run dev` — run the site locally in Replit (Component Preview Server workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Deploying the site to Vercel

The live storefront (landing page + configurator) is `artifacts/mockup-sandbox` — originally a Replit design-mockup sandbox, wired up so its `/` and `/configurador` routes serve the real VLCN Studio pages outside of Replit.

To connect the GitHub repo to Vercel for auto-deploy on push:
- **Root Directory**: `artifacts/mockup-sandbox` (this is the app that should serve `vlcnstudio.cl`)
- **Framework Preset**: Vite (auto-detected via `artifacts/mockup-sandbox/vercel.json`)
- **Build Command** / **Output Directory**: already set in `artifacts/mockup-sandbox/vercel.json` — Vercel will install the full pnpm workspace (it auto-detects `pnpm-workspace.yaml` at the repo root) then build just this package.
- No environment variables are required for the Vercel build — `PORT` and `BASE_PATH` (used only by the Replit dev/preview server) fall back to sane defaults (`5173` and `/`) when unset.
- `artifacts/api-server` is a separate Express service (currently just a health-check stub with no business logic) — it is NOT part of this Vercel deployment; a plain Express server needs a Node host, not Vercel's static/edge model. Leave it out of the Vercel project unless/until it's rebuilt as serverless functions or hosted elsewhere.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
