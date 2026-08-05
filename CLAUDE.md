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

There is no test runner — `check:links` is the verification gate, and it needs a running server. To run it against a live build (this is exactly what CI does):
`PORT=4319 npm run start &` then `BASE_URL=http://localhost:4319 npm run check:links`.

CI (`.github/workflows/ci.yml`) runs `npm ci` → `npm run build` → start on 4319 → `check:links` on every push to `main` and every PR.

## The single-source-of-truth architecture (the thing to understand first)

`data/contract.ts` + `data/languages.json` are the **only** place facts about the MCP endpoint, tools, free-plan terms, pricing, and the language registry live. Everything else is a projection:

- **Site pages** (`src/app/page.tsx`, `agents/`, `languages/`, `languages/[id]/`, `pricing/`) import from `@data/contract` and render it.
- **Discovery files** (`public/llms.txt`, `public/.well-known/mcp.json`) are written by `scripts/generate-discovery.ts`. These two files are **never hand-edited** — they are build artifacts committed to the repo, regenerated on every `dev`/`build` via the `prebuild`/`dev` hook. If you need to change them, change `contract.ts` and run `npm run generate`.

Consequence: **if a fact is wrong, it is wrong once, in `contract.ts`.** Never edit `llms.txt`, `mcp.json`, or duplicate a constant (MCP endpoint, free-plan terms, tool list, prices) into a page or component — import it from `@data/contract`.

`languages.json` carries a mix of **server-owned fields** (`name`, `itemTypes`, membership) and **curated fields** (`blurb`, `examplePrompt`, `showcaseTaskId`, `embedScale`, `embedRatio`). `sync:languages` refreshes the server-owned fields from `list_languages` while preserving curated ones; it is fail-safe (any error leaves the file untouched and exits 0) and is **not** part of the build.

## Key invariants (enforced, not aspirational)

1. **No credential in any instruction.** The free plan is the no-`Authorization` path. Install configs and quickstarts carry no bearer token. A Bearer is only ever a real account key (`gc_…`) or OAuth. The canonical free-plan terms live in `FREE_PLAN` in `contract.ts`.
2. **Documented == real.** `check:links` fails on any 404 from the discovery surfaces. Don't advertise a URL the build can't resolve. (401/403/405 pass — the route exists but is auth-gated or rejects GET, e.g. the MCP JSON-RPC endpoint.)
3. **Artifact-first.** The homepage and each `/languages/[id]` page embed a *live* Graffiticode item via `src/components/Embed.tsx`, not a screenshot. When `showcaseTaskId` is `null`, `Embed` renders an honest "coming online" placeholder.
4. **`generate-discovery.ts` must stay offline** — it runs in `prebuild` and Docker builds must be hermetic. Anything networked belongs in an on-demand script like `sync:languages`.

## Pricing

`PRICING` in `contract.ts` drives `/pricing`. Structure: shared `plans` (Free / Silver / Gold / Platinum, each a flat per-item rate with a monthly minimum) plus `audiences.vendor` and `audiences.consumer` — two framings of the *same* rates, switched by a client-side toggle in `src/app/pricing/PricingView.tsx`. `showIncluded` / `showCustom` flags on an audience gate the vendor-only sections.

Two rules specific to this data:
- The public page may only show what the contract carries. Internal economics (margins, break-even, the pricing calculator) are deliberately **not** projected here.
- The plan facts mirror the external `marketing/artcompiler-price-sheet.md`; the consumer sponsored/unsponsored vocabulary is newer than that sheet. Keep the two in sync when either changes.

## Showcase items (live embeds)

`Embed` iframes `viewUrl(id)` → `https://api.graffiticode.org/form?id=<id>` (the lighter API service's `/form` route, which accepts either an item or a task id). The field in `languages.json` is `showcaseTaskId` — a **base64 task id** of the form `{"taskIds":[...]}`, not a raw item id — so the app can skip the item→task lookup.

To wire one up: create a real item via the MCP server's `create_item`, then drop the task id into `showcaseTaskId` (no code change). Tune presentation with `embedScale` (zoom, e.g. `0.75`) and `embedRatio` (frame aspect ratio, e.g. `'1 / 1'`, `'2 / 3'`; defaults to `'3 / 2'`).

## Conventions

- Path aliases: `@/*` → `src/*`, `@data/*` → `data/*` (see `tsconfig.json`).
- TS scripts run via `tsx` and import `contract.ts` directly with `.ts` extensions; `scripts/` is excluded from the Next.js tsconfig include.
- **Styling**: dark-only. The brand palette (`brand*`, warm-neutral `sand-*`) is defined once in the Tailwind v4 `@theme` block in `src/app/globals.css` — use those tokens, not raw hex or cold `zinc-*` for text.
- **Analytics**: `track()` in `src/lib/analytics.ts` wraps Plausible custom events and is a no-op unless `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set. Used only for top-of-funnel events (CTA clicks, config copies); deeper funnel instrumentation lives in the MCP server/console, not here.
- `src/middleware.ts` 308-redirects alternate hosts (`www.graffiticode.org`, `graffiticode.com`, `www.graffiticode.com`) to the apex, on every path except `_next/` — so discovery files redirect too.
- `SITE_URL` env var drives absolute URLs in discovery files, robots, and sitemap (defaults to `https://graffiticode.org`). It is a Docker build arg, baked in at build time.

## Deploy

Cloud Run service `www` (separate from the main site, no DNS auto-cutover), GCP project `graffiticode-app`:

```bash
npm run gcp:build   # Cloud Build (cloudbuild.yaml): docker build → push → deploy to Cloud Run. This is the deploy.
npm run gcp:deploy  # alternative: source-based `gcloud run deploy` (us-central1). Not needed after gcp:build.
npm run gcp:logs    # read service logs
```

`cloudbuild.yaml` includes the deploy step, so `gcp:build` alone ships the change.
