/**
 * Refresh data/languages.json from the LIVE MCP server (list_languages), so the
 * site's language registry can't drift from what the server actually exposes.
 *
 * Curated fields (blurb, examplePrompt, showcaseItemId) are preserved; only
 * server-owned fields (name, itemTypes) and membership are updated. New
 * languages are added with empty curated fields and flagged so we fill them in.
 *
 * On-demand maintenance tool — NOT part of the build. Safe by design: any
 * failure leaves languages.json untouched and exits 0.
 *
 *   npm run sync:languages
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { MCP_ENDPOINT } from '../data/contract.ts'

const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'languages.json')

type Lang = {
  id: string
  name: string
  blurb: string
  examplePrompt: string
  itemTypes: string[]
  showcaseItemId: string | null
}

let sessionId = ''

async function rpc(method: string, params?: unknown, isNotification = false) {
  const body: Record<string, unknown> = { jsonrpc: '2.0', method }
  if (params !== undefined) body.params = params
  if (!isNotification) body.id = Math.floor(Math.random() * 1e6)

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    accept: 'application/json, text/event-stream',
  }
  if (sessionId) headers['mcp-session-id'] = sessionId

  const res = await fetch(MCP_ENDPOINT, { method: 'POST', headers, body: JSON.stringify(body) })
  const sid = res.headers.get('mcp-session-id')
  if (sid) sessionId = sid
  if (isNotification) return undefined

  const text = await res.text()
  // Streamable HTTP may answer as SSE (data: <json>) or plain JSON.
  const payloads = text
    .split('\n')
    .filter((l) => l.startsWith('data:'))
    .map((l) => l.slice(5).trim())
  const raw = payloads.length ? payloads[payloads.length - 1] : text
  return JSON.parse(raw)
}

function normalizeId(id: string): string {
  const n = id.replace(/^L/i, '')
  return 'L' + n.padStart(4, '0')
}

async function main() {
  await rpc('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'graffiticode-www-sync', version: '0.1.0' },
  })
  await rpc('notifications/initialized', {}, true)
  const result = await rpc('tools/call', { name: 'list_languages', arguments: {} })

  // Pull a JSON blob out of the tool result content, wherever it sits.
  const content = result?.result?.content ?? result?.result ?? result
  let parsed: unknown = content
  if (Array.isArray(content)) {
    const textPart = content.find((c: { type?: string; text?: string }) => c?.type === 'text')?.text
    if (textPart) parsed = JSON.parse(textPart)
  } else if (typeof content === 'string') {
    parsed = JSON.parse(content)
  }

  const list: { id: string; name?: string; itemTypes?: string[] }[] = Array.isArray(parsed)
    ? parsed
    : ((parsed as { languages?: unknown })?.languages as never[]) ?? []
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error('list_languages returned no parseable language array')
  }

  const current: Lang[] = JSON.parse(readFileSync(file, 'utf8'))
  const byId = new Map(current.map((l) => [l.id, l]))
  const added: string[] = []

  const merged: Lang[] = list.map((srv) => {
    const id = normalizeId(srv.id)
    const existing = byId.get(id)
    if (existing) {
      return { ...existing, name: srv.name ?? existing.name, itemTypes: srv.itemTypes ?? existing.itemTypes }
    }
    added.push(id)
    return {
      id,
      name: srv.name ?? id,
      blurb: '',
      examplePrompt: '',
      itemTypes: srv.itemTypes ?? [],
      showcaseItemId: null,
    }
  })

  writeFileSync(file, JSON.stringify(merged, null, 2) + '\n')
  console.log(`sync-languages: ${merged.length} languages written.${added.length ? ` NEW (need curation): ${added.join(', ')}` : ''}`)
}

main().catch((err) => {
  console.warn(`sync-languages: skipped (${err.message}). data/languages.json left unchanged.`)
  process.exit(0)
})
