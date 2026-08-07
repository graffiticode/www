'use client'

import { useEffect, useState } from 'react'

import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { PRICING, type PricingAudience, type PricingPlan } from '@data/contract'

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

type AudienceKey = keyof typeof PRICING.audiences

const AUDIENCE_ORDER: AudienceKey[] = ['agent', 'partner']

/** Rendered when no `?audience=` is present, and represented by its absence. */
const DEFAULT_AUDIENCE: AudienceKey = 'agent'

const isAudienceKey = (v: string | null): v is AudienceKey =>
  v !== null && Object.prototype.hasOwnProperty.call(PRICING.audiences, v)

export function PricingView() {
  const [audience, setAudience] = useState<AudienceKey>(DEFAULT_AUDIENCE)

  // `/pricing?audience=partner` opens on the partner tab — the link the
  // /partners page uses. Read from window rather than useSearchParams: the
  // latter would need a Suspense boundary, whose fallback becomes the
  // prerendered HTML, and this page's static content is worth keeping.
  // Keep the URL in step with the visible tab, so copying the address shares
  // what the reader is actually looking at. The default audience is expressed
  // as the *absence* of the param, which keeps /pricing clean for the common
  // case. replaceState, not the router: a tab switch is not a navigation and
  // shouldn't cost a Back press.
  function choose(key: AudienceKey) {
    setAudience(key)
    const url = new URL(window.location.href)
    const next = key === DEFAULT_AUDIENCE ? null : key
    if (url.searchParams.get('audience') === next) return
    if (next === null) url.searchParams.delete('audience')
    else url.searchParams.set('audience', next)
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
  }

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('audience')
    if (isAudienceKey(requested)) setAudience(requested)
  }, [])
  const view: PricingAudience = PRICING.audiences[audience]
  // Ordering only — every piece of *content* is driven by contract fields.
  const isPartner = audience === 'partner'

  // Filter the shared ladder rather than mapping over planNames, so the
  // contract's low-to-high order stays authoritative.
  const plans = PRICING.plans.filter((p) => view.planNames.includes(p.name))
  const single = plans.length === 1

  const plansSection = (
    <>
      <H2>{view.plansHeading}</H2>
      <p className="mt-2 max-w-2xl text-sand-400">{view.plansIntro}</p>

      {single ? (
        // One card would stretch across a 4-up grid; pair it with what it buys
        // so the row reads as a single full-width band.
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr] lg:items-start">
          <PlanCard plan={plans[0]} />
          <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-6">
            <h3 className="font-medium text-sand-50">Included with {plans[0].name}</h3>
            <ul className="mt-3 space-y-2 text-sm text-sand-400">
              {PRICING.languageService.terms.map((t) => (
                <li key={t} className="flex gap-2">
                  <span aria-hidden className="text-brand-clay">
                    —
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      )}

      {view.plansFootnote && (
        <p className="mt-6 max-w-2xl text-sm text-sand-500">{view.plansFootnote}</p>
      )}
    </>
  )

  const languageSection = view.showLanguageService && (
    <>
      <H2>{PRICING.languageService.heading}</H2>
      <p className="mt-2 max-w-3xl text-sand-400">{PRICING.languageService.lead}</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {PRICING.languageService.items.map((f) => (
          <Card key={f.title} title={f.title} body={f.body} />
        ))}
      </div>
    </>
  )

  const includedSection = view.showIncluded && (
    <>
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
    </>
  )

  return (
    <Container className="py-16">
      {/* Audience toggle */}
      <div className="inline-flex rounded-lg border border-white/15 p-1 text-sm">
        {AUDIENCE_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => choose(key)}
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

      {/* Principles */}
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {view.principles.map((p) => (
          <Card key={p.title} title={p.title} body={p.body} />
        ))}
      </div>

      {/* Partners lead with the service; agents lead with the price ladder. */}
      {isPartner ? (
        <>
          {languageSection}
          {plansSection}
          {includedSection}
        </>
      ) : (
        <>
          {plansSection}
          {includedSection}
          {languageSection}
        </>
      )}

      {/* CTA */}
      <div className="mt-14 rounded-xl border border-white/10 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-sand-50">{view.cta.title}</h2>
        <p className="mt-1 max-w-xl text-sm text-sand-400">{view.cta.body}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button href={view.cta.primary.href} external={view.cta.primary.external}>
            {view.cta.primary.label}
          </Button>
          {view.cta.secondary && (
            <Button
              href={view.cta.secondary.href}
              variant="secondary"
              external={view.cta.secondary.external}
            >
              {view.cta.secondary.label}
            </Button>
          )}
        </div>
      </div>

      {view.billingNote && (
        <p className="mt-8 max-w-2xl text-xs text-sand-500">{view.billingNote}</p>
      )}
    </Container>
  )
}
