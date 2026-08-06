import type { Metadata } from 'next'

import { PricingView } from './PricingView'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Usage-based pricing for agent-accessibility. Service providers pay per successful item; agents pay only for unsponsored items — provider-sponsored items are free. Iteration and reads are always free, and the Bronze tier starts at $0 with 50 items a month, no credit card.',
}

export default function PricingPage() {
  return <PricingView />
}
