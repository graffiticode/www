'use client'

import { useState } from 'react'

import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { PRICING, type PricingAudience } from '@data/contract'

const usd = (n: number) => `$${n.toLocaleString('en-US')}`
const perItem = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}`

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-16 text-2xl font-semibold text-sand-50">{children}</h2>
}

type AudienceKey = keyof typeof PRICING.audiences

const AUDIENCE_ORDER: AudienceKey[] = ['vendor', 'consumer']

export function PricingView() {
  const [audience, setAudience] = useState<AudienceKey>('vendor')
  const view: PricingAudience = PRICING.audiences[audience]
  const isConsumer = audience === 'consumer'

  return (
    <Container className="py-16">
      {/* Audience toggle */}
      <div className="inline-flex rounded-lg border border-white/15 p-1 text-sm">
        {AUDIENCE_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setAudience(key)}
            aria-pressed={audience === key}
            className={`rounded-md px-3 py-1.5 font-medium transition ${
              audience === key
                ? 'bg-brand-deep text-white'
                : 'text-sand-300 hover:bg-white/5'
            }`}
          >
            {PRICING.audiences[key].eyebrow}
          </button>
        ))}
      </div>

      {/* Hero */}
      <p className="mt-8 text-sm font-medium text-brand-clay">{view.eyebrow}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-sand-50">{view.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-sand-300">{view.lead}</p>

      {/* Sponsorship callout (consumer only) */}
      {view.sponsorship && (
        <div className="mt-8 rounded-xl border border-brand/30 bg-brand/5 p-5">
          <h2 className="font-semibold text-brand-clay">{view.sponsorship.title}</h2>
          <p className="mt-1.5 max-w-2xl text-sm text-sand-300">{view.sponsorship.body}</p>
        </div>
      )}

      {/* Principles */}
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {view.principles.map((p) => (
          <div key={p.title} className="rounded-xl border border-white/10 bg-zinc-900/50 p-5">
            <h3 className="font-medium text-sand-50">{p.title}</h3>
            <p className="mt-1.5 text-sm text-sand-400">{p.body}</p>
          </div>
        ))}
      </div>

      {/* Plans */}
      <H2>{view.plansHeading}</H2>
      <p className="mt-2 max-w-2xl text-sand-400">{view.plansIntro}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRICING.plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-xl border p-6 ${
              plan.free ? 'border-white/10 bg-zinc-900/40' : 'border-brand/30 bg-zinc-900/60'
            }`}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-medium text-sand-50">{plan.name}</span>
              {plan.free && (
                <span className="rounded-full border border-brand/40 bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand-clay">
                  on-ramp
                </span>
              )}
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-sand-50">{usd(plan.monthlyBase)}</span>
              <span className="text-sm text-sand-500">/mo</span>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-sand-400">Included / mo</dt>
                <dd className="font-mono text-sand-100">{plan.includedItems.toLocaleString('en-US')}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sand-400">Additional</dt>
                <dd className="font-mono text-sand-100">
                  {plan.additionalItem === null ? '—' : `${perItem(plan.additionalItem)} ea`}
                </dd>
              </div>
            </dl>
            <p className="mt-4 border-t border-white/10 pt-4 text-sm text-sand-400">{plan.note}</p>
          </div>
        ))}
      </div>

      {/* Worked example (vendor only) */}
      {!isConsumer && (
        <p className="mt-6 max-w-2xl text-sm text-sand-500">
          Example: a vendor whose customers create 20,000 items in a month pays {usd(1000)} on Gold (
          {perItem(0.05)}/item). At 100,000 items, still {usd(5000)} on Gold. At 500,000 items, {usd(12500)} on
          Platinum.
        </p>
      )}

      {/* Included at every tier (vendor only) */}
      {view.showIncluded && (
        <>
          <H2>Included at every tier</H2>
          <p className="mt-2 max-w-2xl text-sand-400">
            Every plan includes the full agent-accessibility surface for your product.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {PRICING.included.map((f) => (
              <div key={f.title} className="rounded-xl border border-white/10 bg-zinc-900/40 p-5">
                <h3 className="font-medium text-sand-50">{f.title}</h3>
                <p className="mt-1.5 text-sm text-sand-400">{f.body}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Custom language development (vendor only) */}
      {view.showCustom && (
        <>
          <H2>Custom language development</H2>
          <p className="mt-2 max-w-2xl text-sand-400">
            A bespoke agent surface tailored to your product — your data model, your item types, your workflows —
            is available at the <strong className="text-sand-100">Platinum</strong> tier. This is the done-for-you
            build: we design and operate the language and skills that let agents drive <em>your</em> product
            natively, and keep them current as agent platforms evolve.
          </p>
          <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-sand-400">
            <li>
              <strong className="text-sand-100">Bring your own key (BYOK) at scale.</strong> High-volume customers
              can supply their own model key to reduce per-item cost further. Available on Platinum.
            </li>
            <li>
              <strong className="text-sand-100">Early design-partner program.</strong> A limited number of early
              partners can access custom language development on preferred terms. By invitation.
            </li>
          </ul>
        </>
      )}

      {/* CTA */}
      <div className="mt-14 rounded-xl border border-white/10 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-sand-50">
          {isConsumer ? 'Start free — sponsored tools cost nothing' : 'Start free, or get a tailored quote'}
        </h2>
        <p className="mt-1 max-w-xl text-sm text-sand-400">
          {isConsumer
            ? 'No credential needed — connect an agent and start creating. Sponsored tools are free, and your first 50 unsponsored items each month are too.'
            : 'The Free tier needs no credential — connect an agent and create your first 50 items at no cost. For higher volume or a custom language, reach out.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button href="/agents">Start free →</Button>
          {!isConsumer && (
            <Button
              href="mailto:jeff@artcompiler.com?subject=Graffiticode%20pricing"
              variant="secondary"
              external
            >
              Get a quote
            </Button>
          )}
        </div>
      </div>

      {!isConsumer && (
        <p className="mt-8 max-w-2xl text-xs text-sand-500">
          Billing is metered to your tenant and delivered as a single monthly invoice. Early accounts start pure
          pay-as-you-go; committed-use terms are available as usage matures.
        </p>
      )}
    </Container>
  )
}
