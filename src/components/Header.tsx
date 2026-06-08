import Link from 'next/link'

import { Container } from '@/components/Container'
import { primaryNav, externalNav } from '@/lib/nav'
import { CONSOLE_URL } from '@data/contract'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-sand-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/gc-logo.png" alt="Graffiticode" width={26} height={26} className="h-6 w-6" />
          Graffiticode
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-sand-300 md:flex">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.title}
            </Link>
          ))}
          <span className="h-4 w-px bg-white/15" aria-hidden />
          {externalNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              {item.title}
            </a>
          ))}
        </nav>

        <a
          href={CONSOLE_URL}
          className="rounded-md bg-brand-deep px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand"
        >
          Open Console
        </a>
      </Container>
    </header>
  )
}
