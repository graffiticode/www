/**
 * "Documented == real" gate.
 *
 * Parses the GENERATED discovery files (public/llms.txt and
 * public/.well-known/mcp.json), extracts every URL they advertise, and fetches
 * each one. Fails (exit 1) on any non-2xx/3xx. This structurally prevents the
 * failure class that sank the old site: discovery files promising routes
 * (e.g. /languages/L0152, an openapi.json) that 404.
 *
 * Run in CI and locally via `npm run check:links`. Not part of the Docker build
 * (it needs network); CI runs it against a preview/prod deploy.
 *
 * Override the base for local runs:  BASE_URL=http://localhost:3000 npm run check:links
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { SITE_URL } from '../data/contract.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = (process.env.BASE_URL || SITE_URL).replace(/\/$/, '')

function collectUrls(): Set<string> {
  const urls = new Set<string>()
  const llms = readFileSync(join(root, 'public', 'llms.txt'), 'utf8')
  for (const m of llms.matchAll(/https?:\/\/[^\s)"'<>]+/g)) urls.add(m[0].replace(/[.,]$/, ''))

  const mcp = JSON.parse(readFileSync(join(root, 'public', '.well-known', 'mcp.json'), 'utf8'))
  JSON.stringify(mcp).replace(/https?:\/\/[^\s"']+/g, (u) => {
    urls.add(u.replace(/[.,]$/, ''))
    return u
  })
  return urls
}

/** Rewrite SITE_URL-hosted links to BASE so we can check a local/preview deploy. */
function toCheckable(url: string): string {
  if (url.startsWith(SITE_URL)) return BASE + url.slice(SITE_URL.length)
  return url
}

// "Real" means the route exists. A 404/410 (gone) or 5xx/network error is a
// broken promise. 401/403/405 mean the endpoint is there but auth-gated or
// doesn't accept GET (e.g. the MCP JSON-RPC endpoint) — that still counts as real.
const REAL_BUT_NOT_GETTABLE = new Set([401, 403, 405, 406])

async function check(url: string): Promise<{ url: string; ok: boolean; status: number | string }> {
  const target = toCheckable(url)
  try {
    let res = await fetch(target, { method: 'HEAD', redirect: 'follow' })
    if (res.status === 405 || res.status === 501) {
      // Some hosts don't implement HEAD; confirm with GET before judging.
      res = await fetch(target, { method: 'GET', redirect: 'follow' })
    }
    const ok = res.status < 400 || REAL_BUT_NOT_GETTABLE.has(res.status)
    return { url: target, ok, status: res.status }
  } catch (err) {
    return { url: target, ok: false, status: (err as Error).message }
  }
}

async function main() {
  const urls = [...collectUrls()]
  console.log(`check-links: verifying ${urls.length} URLs (base ${BASE})…`)
  const results = await Promise.all(urls.map(check))
  const failures = results.filter((r) => !r.ok)

  for (const r of results.sort((a, b) => a.url.localeCompare(b.url))) {
    console.log(`  ${r.ok ? 'ok  ' : 'FAIL'} ${String(r.status).padEnd(6)} ${r.url}`)
  }

  if (failures.length) {
    console.error(`\ncheck-links: ${failures.length} broken URL(s). Documentation must match reality.`)
    process.exit(1)
  }
  console.log(`\ncheck-links: all ${urls.length} URLs resolve.`)
}

main()
