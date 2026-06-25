import Link from 'next/link'

import { Container } from '@/components/Container'
import { primaryNav, externalNav } from '@/lib/nav'
import { MCP_ENDPOINT } from '@data/contract'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 py-10 text-sm text-sand-400">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/gc-logo.png" alt="Graffiticode" width={28} height={28} className="h-7 w-7" />
          <div>
            <div className="font-mono text-xs text-sand-500">{MCP_ENDPOINT}</div>
            <div className="mt-1">Open source under MIT. © Artcompiler Inc.</div>
          </div>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-sand-50">
              {item.title}
            </Link>
          ))}
          {externalNav.map((item) => (
            <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="transition hover:text-sand-50">
              {item.title}
            </a>
          ))}
        </nav>
      </Container>
    </footer>
  )
}
