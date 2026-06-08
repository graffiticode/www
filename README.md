# graffiticode.org (`www`)

The canonical agent-engagement site for Graffiticode. Rebuilt from scratch to be a **projection of the
live MCP server**, not hand-written prose that drifts from it.

## Why this exists

The previous site told agents to send `Authorization: Bearer YOUR_TRIAL_TOKEN` (a scheme that was never
built — the shipped model is free-plan / no credential), linked 8× to a `/languages/[id]` route that
didn't exist, advertised a 404ing OpenAPI URL, and contradicted itself on the language list. An agent
following the canonical "For Agents" page failed its first call. This rebuild fixes that by construction.

## Design principles (enforced, not aspirational)

1. **Single source of truth** — everything derives from [`data/contract.ts`](data/contract.ts) +
   [`data/languages.json`](data/languages.json). The homepage, `/agents`, `/languages`, `llms.txt`, and
   `.well-known/mcp.json` are all projections of it, so they cannot disagree.
2. **No credential in any instruction** — the free plan is the no-`Authorization` path; the install
   configs carry no bearer token.
3. **Documented == real** — `npm run check:links` (run in CI) fetches every URL the discovery files
   emit and fails on any 404. Broken promises can't ship.
4. **Artifact-first** — the homepage and each `/languages/[id]` page embed a *live* Graffiticode item
   (see "Showcase items" below), not a screenshot.

## Develop

```bash
npm install
npm run dev          # regenerates discovery files, then next dev
npm run build        # prebuild generates discovery files, then next build
```

## Key scripts

| Command | What it does |
|---|---|
| `npm run generate` | Write `public/llms.txt` + `public/.well-known/mcp.json` from the contract (runs automatically on `prebuild`; offline). |
| `npm run sync:languages` | Refresh `data/languages.json` from the live MCP server's `list_languages`, preserving curated fields. On-demand. |
| `npm run check:links` | "Documented == real" gate. `BASE_URL=http://localhost:PORT npm run check:links` to verify a running build. |
| `npm run verify` | `generate` + `check:links`. |

## Showcase items (live embeds)

Each language can carry a `showcaseItemId` in `data/languages.json` — a real item created via the MCP
server, embedded as living proof. When it's `null`, the embed shows an honest "coming online"
placeholder. To populate: create items with `create_item`, then drop the returned ids into
`data/languages.json` (no code change needed).

## Deploy

Cloud Run, mirroring the existing site's setup but as a separate `www` service (no auto-cutover of the
graffiticode.org DNS):

```bash
npm run gcp:build    # Cloud Build (Docker) → gcr.io/graffiticode-app/www
npm run gcp:deploy   # deploy to Cloud Run service `www` (us-central1)
```

`SITE_URL` (build arg / env) drives absolute URLs in the discovery files, robots, and sitemap.

## Stack

Next.js 15 (app router) · React 19 · TypeScript · Tailwind v4. No MDX/docs-template chrome.
