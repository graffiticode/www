import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { PRICING, type PricingPlan } from '@data/contract'

const usd = (n: number) => `$${n.toLocaleString('en-US')}`
const perItem = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}`

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-16 text-2xl font-semibold text-sand-50">{children}</h2>
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-5">
      <h3 className="font-medium text-sand-50">{title}</h3>
      <p className="mt-1.5 text-sm text-sand-400">{body}</p>
    </div>
  )
}

function PlanCard({ plan }: { plan: PricingPlan }) {
  return (
    <div
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
      <div className="mt-3 flex items-baseline gap-1.5">
        {plan.listPrice !== undefined && (
          <s className="text-xl font-medium text-sand-500 decoration-sand-500/70">
            {usd(plan.listPrice)}
          </s>
        )}
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
  )
}

/**
 * One audience, one view. This was a client component while the page carried an
 * agent/partner toggle; with the partner story gone there is no state, no
 * `?audience=` param to read, and nothing to keep in the URL — so it renders on
 * the server and the whole page stays static.
 */
export function PricingView() {
  return (
    <Container className="py-16">
      {/* Hero */}
      <p className="text-sm font-medium text-brand-clay">{PRICING.eyebrow}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-sand-50">{PRICING.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-sand-300">{PRICING.lead}</p>

      {/* Principles */}
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {PRICING.principles.map((p) => (
          <Card key={p.title} title={p.title} body={p.body} />
        ))}
      </div>

      {/* Plans — the full ladder, in the contract's canonical low-to-high order. */}
      <H2>{PRICING.plansHeading}</H2>
      <p className="mt-2 max-w-2xl text-sand-400">{PRICING.plansIntro}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRICING.plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </div>
      {PRICING.plansFootnote && (
        <p className="mt-6 max-w-2xl text-sm text-sand-500">{PRICING.plansFootnote}</p>
      )}

      {/* What every tier carries */}
      <H2>{PRICING.included.heading}</H2>
      <p className="mt-2 max-w-2xl text-sand-400">{PRICING.included.lead}</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {PRICING.included.items.map((f) => (
          <div key={f.title} className="rounded-xl border border-white/10 bg-zinc-900/40 p-5">
            <h3 className="font-medium text-sand-50">{f.title}</h3>
            <p className="mt-1.5 text-sm text-sand-400">{f.body}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 rounded-xl border border-white/10 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-sand-50">{PRICING.cta.title}</h2>
        <p className="mt-1 max-w-xl text-sm text-sand-400">{PRICING.cta.body}</p>
        {/* One CTA: the contract carries no `secondary` now that the partner
            "What partnering costs" link is gone. Re-add the branch here if one
            is ever added back to PRICING.cta. */}
        <div className="mt-4 flex flex-wrap gap-3">
          <Button href={PRICING.cta.primary.href} external={PRICING.cta.primary.external}>
            {PRICING.cta.primary.label}
          </Button>
        </div>
      </div>
    </Container>
  )
}
