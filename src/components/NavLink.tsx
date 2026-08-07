'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { navHref } from '@/lib/nav'

/**
 * A primary-nav link whose destination can depend on the page it is rendered
 * on — see `navHref`. This is the only piece of the header and footer that
 * needs the current path, so it is the only piece that runs on the client;
 * the shells around it stay server components.
 */
export function NavLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <Link href={navHref(href, pathname)} className={className}>
      {children}
    </Link>
  )
}
