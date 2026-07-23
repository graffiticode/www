import type { Metadata } from 'next'

import { PricingView } from './PricingView'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Usage-based pricing for agent-accessibility. Vendors pay per successful item; consumers pay only for unsponsored items — vendor-sponsored items are free. Iteration and reads are always free, with a Free tier for both.',
}

export default function PricingPage() {
  return <PricingView />
}
