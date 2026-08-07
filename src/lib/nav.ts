import { CONSOLE_URL, FORUM_URL, GITHUB_URL } from '@data/contract'

export const primaryNav = [
  { title: 'Agents', href: '/agents' },
  { title: 'Tools', href: '/languages' },
  { title: 'Partners', href: '/partners' },
  { title: 'Pricing', href: '/pricing' },
]

export const externalNav = [
  { title: 'Console', href: CONSOLE_URL },
  { title: 'Community', href: FORUM_URL },
  { title: 'GitHub', href: GITHUB_URL },
]

/** Pages that read as the partner story, and so send Pricing to the partner tab. */
const partnerPages = ['/partners']

/**
 * Which pricing audience a reader on `pathname` should land on. Agent is the
 * default; partner context is the exception.
 */
export function pricingAudience(pathname: string): 'agent' | 'partner' {
  return partnerPages.includes(pathname) ? 'partner' : 'agent'
}

/** Every link into /pricing names its audience — there is no bare form. */
export const pricingHref = (pathname: string) =>
  `/pricing?audience=${pricingAudience(pathname)}`

/**
 * Where a nav item points *from the page the reader is on*.
 *
 * Only Pricing is path-dependent: following it from /partners keeps the reader
 * in the partner story rather than dropping them on the agent default. It has
 * to be decided here, in the link, because `document.referrer` does not update
 * across App Router client navigations — the pricing page cannot work out where
 * the reader came from.
 */
export function navHref(href: string, pathname: string): string {
  if (href === '/pricing') return pricingHref(pathname)
  return href
}
