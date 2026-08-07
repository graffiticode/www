import type { Metadata } from 'next'

import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { PARTNERS, PRICING } from '@data/contract'

export const metadata: Metadata = {
  title: 'Partners',
  description:
    'We design and operate the Graffiticode language that makes your product drivable by an AI agent — a continuous service, not a one-off build. It starts with a working session against your sandbox, not a proposal.',
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-16 scroll-mt-20 text-2xl font-semibold text-sand-50">
      {children}
    </h2>
  )
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-5">
      <h3 className="font-medium text-sand-50">{title}</h3>
      <p className="mt-1.5 text-sm text-sand-400">{body}</p>
    </div>
  )
}

export default function PartnersPage() {
  return (
    <Container className="py-16">
      {/* Hero */}
      <p className="text-sm font-medium text-brand-clay">{PARTNERS.eyebrow}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-sand-50">{PARTNERS.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-sand-300">{PARTNERS.lead}</p>

      {/* Who this is for */}
      <H2 id="who">{PARTNERS.qualifies.heading}</H2>
      <p className="mt-2 max-w-2xl text-sand-400">{PARTNERS.qualifies.lead}</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {PARTNERS.qualifies.items.map((f) => (
          <Card key={f.title} title={f.title} body={f.body} />
        ))}
      </div>

      {/* What each side brings */}
      <H2 id="exchange">{PARTNERS.exchange.heading}</H2>
      <p className="mt-2 max-w-2xl text-sand-400">{PARTNERS.exchange.lead}</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {PARTNERS.exchange.items.map((f) => (
          <Card key={f.title} title={f.title} body={f.body} />
        ))}
      </div>

      {/* The working session — the canonical first step */}
      <H2 id="session">{PARTNERS.session.heading}</H2>
      <p className="mt-2 max-w-3xl text-sand-400">{PARTNERS.session.lead}</p>

      {/* The path, as numbered steps */}
      <H2 id="path">{PARTNERS.path.heading}</H2>
      <p className="mt-2 max-w-2xl text-sand-400">{PARTNERS.path.lead}</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PARTNERS.path.items.map((s, i) => (
          <div key={s.title} className="rounded-xl border border-white/10 bg-zinc-900/50 p-5">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand/15 font-mono text-sm text-brand-clay">
              {i + 1}
            </div>
            <h3 className="font-medium text-sand-50">{s.title}</h3>
            <p className="mt-1.5 text-sm text-sand-400">{s.body}</p>
          </div>
        ))}
      </div>

      {/* The service itself — one description, shared with /pricing */}
      <H2 id="service">{PRICING.languageService.heading}</H2>
      <p className="mt-2 max-w-3xl text-sand-400">{PRICING.languageService.lead}</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {PRICING.languageService.items.map((f) => (
          <Card key={f.title} title={f.title} body={f.body} />
        ))}
      </div>
      <ul className="mt-6 space-y-2 text-sm text-sand-400">
        {PRICING.languageService.terms.map((t) => (
          <li key={t} className="flex gap-2">
            <span aria-hidden className="text-brand-clay">
              —
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-14 rounded-xl border border-white/10 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-sand-50">{PARTNERS.cta.title}</h2>
        <p className="mt-1 max-w-xl text-sm text-sand-400">{PARTNERS.cta.body}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button href={PARTNERS.cta.primary.href} external={PARTNERS.cta.primary.external}>
            {PARTNERS.cta.primary.label}
          </Button>
          {PARTNERS.cta.secondary && (
            <Button
              href={PARTNERS.cta.secondary.href}
              variant="secondary"
              external={PARTNERS.cta.secondary.external}
            >
              {PARTNERS.cta.secondary.label}
            </Button>
          )}
        </div>
      </div>
    </Container>
  )
}
