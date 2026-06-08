import type { Metadata } from 'next'
import Link from 'next/link'

import { Container } from '@/components/Container'
import { LANGUAGES } from '@data/contract'

export const metadata: Metadata = {
  title: 'Tools',
  description:
    'Every Graffiticode smart tool — each a domain language with its own specialized AI, callable through the MCP server with no credential.',
}

export default function LanguagesPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-white">Smart tools</h1>
      <p className="mt-3 max-w-2xl text-lg text-zinc-300">
        Each tool is a domain language wrapped by a specialized AI. Open one to see a live example and the
        exact call that makes it. Call <code className="font-mono text-emerald-300">list_languages</code> from the
        MCP server for the authoritative live list.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {LANGUAGES.map((l) => (
          <Link
            key={l.id}
            href={`/languages/${l.id}`}
            className="group rounded-xl border border-white/10 bg-zinc-900/40 p-5 transition hover:border-emerald-400/40 hover:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-white">{l.name}</span>
              <span className="font-mono text-xs text-zinc-500">{l.id}</span>
            </div>
            <p className="mt-2 text-sm text-zinc-400">{l.blurb}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {l.itemTypes.map((t) => (
                <span key={t} className="rounded bg-white/5 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </Container>
  )
}
