import type { Metadata } from 'next'
import Script from 'next/script'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SITE_URL, MCP_ENDPOINT, POSITIONING } from '@data/contract'
import './globals.css'

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Graffiticode — ${POSITIONING.eyebrow.toLowerCase()}`,
    template: '%s · Graffiticode',
  },
  // POSITIONING.definition is the canonical sentence but runs long for a SERP
  // snippet, so the short form leads and the concrete nouns follow.
  description: `${POSITIONING.short} Ask for a chart, a spreadsheet, a concept web, or an assessment.`,
  alternates: {
    canonical: '/',
    types: {
      'text/plain': [{ url: '/llms.txt', title: 'llms.txt' }],
      'application/json': [{ url: '/.well-known/mcp.json', title: 'MCP config' }],
    },
  },
  other: {
    // Endpoint-only agent-discovery meta. No credential is ever published here.
    'mcp-server': MCP_ENDPOINT,
    'mcp-version': '2025-06-18',
    'ai-tool-endpoint': MCP_ENDPOINT,
  },
  openGraph: {
    title: `Graffiticode — ${POSITIONING.eyebrow.toLowerCase()}`,
    description: POSITIONING.short,
    url: SITE_URL,
    siteName: 'Graffiticode',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  )
}
