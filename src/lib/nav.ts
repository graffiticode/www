import { CONSOLE_URL, FORUM_URL, GITHUB_URL } from '@data/contract'

export const primaryNav = [
  { title: 'Quickstart', href: '/agents' },
  { title: 'Tools', href: '/languages' },
  { title: 'Partners', href: '/partners' },
  { title: 'Pricing', href: '/pricing' },
]

export const externalNav = [
  { title: 'Console', href: CONSOLE_URL },
  { title: 'Community', href: FORUM_URL },
  { title: 'GitHub', href: GITHUB_URL },
]

/**
 * Where a nav item points *from the page the reader is on*.
 *
 * Only one item is path-dependent: following Pricing from /partners keeps the
 * reader in the partner story rather than dropping them on the agent default.
 * It has to be decided here, in the link, because `document.referrer` does not
 * update across App Router client navigations — the pricing page cannot work
 * out where the reader came from.
 */
export function navHref(href: string, pathname: string): string {
  if (href === '/pricing' && pathname === '/partners') return '/pricing?audience=partner'
  return href
}
