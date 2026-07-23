import type { Metadata } from 'next'

import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { PRICING } from '@data/contract'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Usage-based pricing for agent-accessibility. You pay per successful item — iteration and reads are free, no seat licenses, no upfront commitment. Free tier included.',
}

const usd = (n: number) => `$${n.toLocaleString('en-US')}`
const perItem = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}`

const principles = [
  {
    title: 'Billed per successful item',
    body: 'A successful item is a create request that returns a compiled, valid artifact. If it doesn’t produce a working result, you don’t pay for it.',
  },
  {
    title: 'Iteration is included',
    body: 'Refining an item — as many revisions as it takes to get it right — is part of creating it, not a separate charge. Reads and retrievals are always free.',
  },
  {
    title: 'You own the customer',
    body: 'Your customers authenticate with your credentials and never see Artcompiler. Pass our fee through, bundle it, or resell agentic authoring as a premium feature.',
  },
]

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-16 text-2xl font-semibold text-sand-50">{children}</h2>
}

export default function PricingPage() {
  return (
    <Container className="py-16">
      <p className="text-sm font-medium text-brand-clay">Pricing</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-sand-50">
        Agent-accessibility for your product
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-sand-300">
        You bring the product; we make it something an AI agent can drive — reliably, safely, and inside your
        guardrails. <strong>You pay for usage, not a subscription.</strong> The bill scales with adoption — no
        upfront commitment, no seat licenses to forecast.
      </p>

      {/* Principles */}
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {principles.map((p) => (
          <div key={p.title} className="rounded-xl border border-white/10 bg-zinc-900/50 p-5">
            <h3 className="font-medium text-sand-50">{p.title}</h3>
            <p className="mt-1.5 text-sm text-sand-400">{p.body}</p>
          </div>
        ))}
      </div>

      {/* Plans */}
      <H2>Plans</H2>
      <p className="mt-2 max-w-2xl text-sand-400">
        Each paid plan is a flat per-item rate with a monthly minimum — the included bucket is priced at the same
        rate as additional items, so there’s no penalty for going over. Move up a plan exactly when it lowers your
        per-item cost.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRICING.plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-xl border p-6 ${
              plan.free
                ? 'border-white/10 bg-zinc-900/40'
                : 'border-brand/30 bg-zinc-900/60'
            }`}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-medium text-sand-50">
                {plan.free ? 'Free' : `Plan ${plan.name}`}
              </span>
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

      <p className="mt-6 max-w-2xl text-sm text-sand-500">
        Example: a vendor whose customers create 20,000 items in a month pays {usd(1000)} on Plan B (
        {perItem(0.05)}/item). At 100,000 items, still {usd(5000)} on Plan B. At 500,000 items, {usd(12500)} on
        Plan C.
      </p>

      {/* Included at every tier */}
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

      {/* Custom language development */}
      <H2>Custom language development</H2>
      <p className="mt-2 max-w-2xl text-sand-400">
        A bespoke agent surface tailored to your product — your data model, your item types, your workflows — is
        available at the <strong className="text-sand-100">Plan C</strong> tier. This is the done-for-you build: we
        design and operate the language and skills that let agents drive <em>your</em> product natively, and keep
        them current as agent platforms evolve.
      </p>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-sand-400">
        <li>
          <strong className="text-sand-100">Bring your own key (BYOK) at scale.</strong> High-volume customers can
          supply their own model key to reduce per-item cost further. Available on Plan C.
        </li>
        <li>
          <strong className="text-sand-100">Early design-partner program.</strong> A limited number of early
          partners can access custom language development on preferred terms. By invitation.
        </li>
      </ul>

      {/* CTA */}
      <div className="mt-14 rounded-xl border border-white/10 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-sand-50">Start free, or get a tailored quote</h2>
        <p className="mt-1 max-w-xl text-sm text-sand-400">
          The Free tier needs no credential — connect an agent and create your first 50 items at no cost. For
          higher volume or a custom language, reach out.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button href="/agents">Start free →</Button>
          <Button
            href="mailto:jeff@artcompiler.com?subject=Graffiticode%20pricing"
            variant="secondary"
            external
          >
            Get a quote
          </Button>
        </div>
      </div>

      <p className="mt-8 max-w-2xl text-xs text-sand-500">
        Billing is metered to your tenant and delivered as a single monthly invoice. Early accounts start pure
        pay-as-you-go; committed-use terms are available as usage matures.
      </p>
    </Container>
  )
}
