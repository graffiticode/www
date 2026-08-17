import type { Metadata } from 'next'

import { PricingView } from './PricingView'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Usage-based pricing: pay per successful item, starting free. The Bronze tier is $0 with 25 items a month and no credit card, and the per-item rate falls as volume grows. Iteration and reads are always free.',
}

export default function PricingPage() {
  return <PricingView />
}
