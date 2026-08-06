import type { Metadata } from 'next'

import { PricingView } from './PricingView'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Usage-based pricing for agent-accessibility. Agents pay per successful item, starting free — the Bronze tier is $0 with 50 items a month and no credit card. Partners pay one flat monthly fee that includes custom language development: unlimited requests, worked one at a time. Iteration and reads are always free.',
}

export default function PricingPage() {
  return <PricingView />
}
