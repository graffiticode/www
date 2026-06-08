# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`graffiticode-www` is the canonical agent-engagement site for Graffiticode (graffiticode.org), built as a **projection of the live MCP server**. The audience is AI agents (and the developers behind them) discovering Graffiticode and making a first successful MCP call. Every public surface is generated from one contract so the site cannot contradict itself or the server. Next.js 15 (app router) · React 19 · TypeScript · Tailwind v4.

## Commands

```bash
npm run dev            # regenerate discovery files, then next dev
npm run build          # prebuild regenerates discovery files, then next build
npm run lint           # next lint (eslint 9 + eslint-config-next)
npm run generate       # write public/llms.txt + public/.well-known/mcp.json from the contract (offline)
npm run sync:languages # refresh data/languages.json from the LIVE MCP server (on-demand, networked)
npm run check:links    # "Documented == real" gate: fetch every URL the discovery files emit, fail on 404
npm run verify         # generate + check:links
```

There is no test runner — `check:links` is the verification gate. To run it against a live build:
`PORT=4319 npm run start &` then `BASE_URL=http://localhost:4319 npm run check:links`.

## The single-source-of-truth architecture (the thing to understand first)

`data/contract.ts` + `data/languages.json` are the **only** place facts about the MCP endpoint, tools, free-plan terms, and language registry live. Everything else is a projection:

- **Site pages** (`src/app/page.tsx`, `agents/`, `languages/`, `languages/[id]/`) import from `@data/contract` and render it.
- **Discovery files** (`public/llms.txt`, `public/.well-known/mcp.json`) are written by `scripts/generate-discovery.ts`. These two files are **never hand-edited** — they are build artifacts committed to the repo, regenerated on every `dev`/`build` via the `prebuild`/`dev` hook. If you need to change them, change `contract.ts` and run `npm run generate`.

Consequence: **if a fact is wrong, it is wrong once, in `contract.ts`.** Never edit `llms.txt`, `mcp.json`, or duplicate a constant (MCP endpoint, free-plan terms, tool list) into a page or component — import it from `@data/contract`.

`languages.json` carries a mix of **server-owned fields** (`name`, `itemTypes`, membership) and **curated fields** (`blurb`, `examplePrompt`, `showcaseItemId`, `embedScale`). `sync:languages` refreshes the server-owned fields from `list_languages` while preserving curated ones; it is fail-safe (any error leaves the file untouched and exits 0) and is **not** part of the build.

## Key invariants (enforced, not aspirational)

1. **No credential in any instruction.** The free plan is the no-`Authorization` path. Install configs and quickstarts carry no bearer token. A Bearer is only ever a real account key (`gc_…`) or OAuth. The canonical free-plan terms live in `FREE_PLAN` in `contract.ts`.
2. **Documented == real.** `check:links` runs in CI (`.github/workflows/ci.yml`) and fails on any 404 from the discovery surfaces. Don't advertise a URL the build can't resolve.
3. **Artifact-first.** The homepage and each `/languages/[id]` page embed a *live* Graffiticode item via `src/components/Embed.tsx` (an iframe to `app.graffiticode.org/form/<id>`), not a screenshot. When `showcaseItemId` is `null`, `Embed` renders an honest "coming online" placeholder.
4. **`generate-discovery.ts` must stay offline** — it runs in `prebuild` and Docker builds must be hermetic. Anything networked belongs in an on-demand script like `sync:languages`.

## Showcase items

To wire a live embed for a language: create a real item via the MCP server's `create_item`, then drop the returned id into `showcaseItemId` in `data/languages.json` (no code change). Optionally set `embedScale` (e.g. `0.75`) to zoom the embedded form.

## Conventions

- Path aliases: `@/*` → `src/*`, `@data/*` → `data/*` (see `tsconfig.json`).
- TS scripts run via `tsx` and import `contract.ts` directly with `.ts` extensions; `scripts/` is excluded from the Next.js tsconfig include.
- `SITE_URL` env var drives absolute URLs in discovery files, robots, and sitemap (defaults to `https://graffiticode.org`).

## Deploy

Cloud Run service `www` (separate from the main site, no DNS auto-cutover), GCP project `graffiticode-app`:

```bash
npm run gcp:build   # Cloud Build (Docker, cloudbuild.yaml) → gcr.io/graffiticode-app/www
npm run gcp:deploy  # deploy to Cloud Run service `www` (us-central1)
npm run gcp:logs    # read service logs
```
