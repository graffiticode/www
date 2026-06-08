import Link from 'next/link'

import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { CodeBlock } from '@/components/CodeBlock'
import { Embed } from '@/components/Embed'
import { LANGUAGES, SHOWCASE, MCP_ENDPOINT, FREE_PLAN } from '@data/contract'

// Feature the charts tool in the hero when it has a live item; otherwise the first showcase.
const preferred = LANGUAGES.find((l) => l.id === 'L0173' && l.showcaseItemId)
const featured = preferred ?? SHOWCASE[0] ?? LANGUAGES[0]

const heroCall = `create_item({
  language: "${featured.id}",
  description: "${featured.examplePrompt}"
})`

const steps = [
  {
    n: '1',
    title: 'Connect — no key required',
    body: (
      <>
        Point any MCP client at <code className="font-mono text-brand-clay">{MCP_ENDPOINT}</code> with{' '}
        <strong>no Authorization header</strong>. That routes you through the free plan.
      </>
    ),
  },
  {
    n: '2',
    title: 'Ask in plain language',
    body: (
      <>
        Call <code className="font-mono text-brand-clay">create_item</code> with a language and a description.
        A specialized AI compiles your intent into a validated, interactive artifact.
      </>
    ),
  },
  {
    n: '3',
    title: 'Open it — keep it if you want',
    body: (
      <>
        You get back a <code className="font-mono text-brand-clay">view_url</code> to open the result and a{' '}
        <code className="font-mono text-brand-clay">claim_url</code> to save it. Unclaimed items last{' '}
        {FREE_PLAN.itemTtlHours} hours.
      </>
    ),
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-grid border-b border-white/10">
        <Container className="grid gap-10 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-medium text-brand-clay">
              Universal MCP server of smart tools
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-sand-50 sm:text-5xl">
              Point your agent at one endpoint — no key required — and ask for a spreadsheet.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-sand-300">
              Each Graffiticode tool is a domain language wrapped by a specialized AI that knows the
              solution space — so your agent delegates to a specialist instead of guessing, and gets back
              a validated, interactive result.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/agents">Get started in 30 seconds →</Button>
              <Button href="/languages" variant="secondary">
                Browse the tools
              </Button>
            </div>
            <p className="mt-4 font-mono text-xs text-sand-500">{MCP_ENDPOINT}</p>
          </div>

          <div>
            <Embed itemId={featured.showcaseItemId} title={`${featured.name} — made with one MCP call`} scale={featured.embedScale ?? 1} />
            <p className="mt-3 text-center text-sm text-sand-400">
              An agent made this with one call.{' '}
              <Link href="/agents" className="font-medium text-brand-clay hover:underline">
                Make your own →
              </Link>
            </p>
          </div>
        </Container>
      </section>

      {/* Quickstart */}
      <section className="py-20">
        <Container>
          <h2 className="text-2xl font-semibold text-sand-50">From zero to a rendered artifact</h2>
          <p className="mt-2 max-w-2xl text-sand-400">
            No sign-up, no token to fetch. The free plan is the no-credential path.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-xl border border-white/10 bg-zinc-900/50 p-5">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand/15 font-mono text-sm text-brand-clay">
                  {s.n}
                </div>
                <h3 className="font-medium text-sand-50">{s.title}</h3>
                <p className="mt-1.5 text-sm text-sand-400">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <CodeBlock
              label="Add the server (no headers)"
              language="json"
              code={`{
  "mcpServers": {
    "graffiticode": {
      "url": "${MCP_ENDPOINT}"
    }
  }
}`}
            />
            <CodeBlock label="Your first call" language="javascript" code={heroCall} />
          </div>
          <div className="mt-6">
            <Button href="/agents" variant="secondary">
              Full install guide for Claude, Cursor & ChatGPT →
            </Button>
          </div>
        </Container>
      </section>

      {/* Proof gallery */}
      <section className="border-t border-white/10 py-20">
        <Container>
          <h2 className="text-2xl font-semibold text-sand-50">One server, many smart tools</h2>
          <p className="mt-2 max-w-2xl text-sand-400">
            Each is a domain language with its own specialized AI. Call <code className="font-mono">list_languages</code>{' '}
            for the live list.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LANGUAGES.map((l) => (
              <Link
                key={l.id}
                href={`/languages/${l.id}`}
                className="group rounded-xl border border-white/10 bg-zinc-900/40 p-5 transition hover:border-brand/40 hover:bg-zinc-900"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sand-50">{l.name}</span>
                  <span className="font-mono text-xs text-sand-500">{l.id}</span>
                </div>
                <p className="mt-2 text-sm text-sand-400">{l.blurb}</p>
                <span className="mt-3 inline-block text-sm text-brand-clay opacity-0 transition group-hover:opacity-100">
                  See it live →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Build a tool (secondary) */}
      <section className="border-t border-white/10 py-16">
        <Container className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-sand-50">Have domain expertise worth a tool?</h2>
            <p className="mt-1 max-w-xl text-sm text-sand-400">
              Turn your domain into a smart tool that serves both agents and the people who use them.
            </p>
          </div>
          <Button href="/build" variant="secondary">
            Build a tool →
          </Button>
        </Container>
      </section>
    </>
  )
}
