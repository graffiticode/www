import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Container } from '@/components/Container'
import { CodeBlock } from '@/components/CodeBlock'
import { Embed } from '@/components/Embed'
import { Button } from '@/components/Button'
import { LANGUAGES, getLanguage, MCP_ENDPOINT } from '@data/contract'

export function generateStaticParams() {
  return LANGUAGES.map((l) => ({ id: l.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const lang = getLanguage(id)
  if (!lang) return { title: 'Tool not found' }
  return {
    title: `${lang.name} (${lang.id})`,
    description: `${lang.blurb} Create one with a natural-language description via the Graffiticode MCP server — no credential required.`,
  }
}

export default async function LanguagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lang = getLanguage(id)
  if (!lang) notFound()

  const call = `create_item({
  language: "${lang.id}",
  description: "${lang.examplePrompt}"
})`

  return (
    <Container className="py-16">
      <Link href="/languages" className="text-sm text-sand-400 transition hover:text-sand-50">
        ← All tools
      </Link>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-sand-50">{lang.name}</h1>
        <span className="font-mono text-sm text-sand-500">{lang.id}</span>
      </div>
      <p className="mt-3 max-w-2xl text-lg text-sand-300">{lang.blurb}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
        <div>
          <h2 className="text-sm font-medium text-sand-400">Live example</h2>
          <Embed className="mt-2" itemId={lang.showcaseItemId} title={`${lang.name} (${lang.id})`} height={400} />
        </div>

        <div>
          <h2 className="text-sm font-medium text-sand-400">Make one like it</h2>
          <p className="mt-2 text-sm text-sand-400">
            Describe what you want in plain language — the specialized AI compiles it.
          </p>
          <CodeBlock className="mt-3" label="create_item" language="javascript" code={call} />

          <div className="mt-4 rounded-lg border border-white/10 bg-zinc-900/50 p-4 text-sm text-sand-400">
            <div className="font-mono text-xs text-sand-500">item types</div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {lang.itemTypes.map((t) => (
                <span key={t} className="rounded bg-white/5 px-2 py-0.5 font-mono text-[11px] text-sand-300">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm text-sand-500">
            Reachable at <code className="font-mono">{MCP_ENDPOINT}</code> with no credential.
          </p>
          <Button href="/agents" variant="secondary" className="mt-4">
            How to connect →
          </Button>
        </div>
      </div>
    </Container>
  )
}
