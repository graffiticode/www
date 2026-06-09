import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CANONICAL_HOST = 'graffiticode.org'

// Alternate domains that should permanently redirect to the canonical apex,
// preserving the path and query string.
const ALTERNATE_HOSTS = new Set([
  'www.graffiticode.org',
  'graffiticode.com',
  'www.graffiticode.com',
])

export function middleware(request: NextRequest) {
  const hostname = (request.headers.get('host') ?? '').split(':')[0].toLowerCase()

  if (ALTERNATE_HOSTS.has(hostname)) {
    const { pathname, search } = request.nextUrl
    return NextResponse.redirect(`https://${CANONICAL_HOST}${pathname}${search}`, 308)
  }

  return NextResponse.next()
}

// Run on every request except Next.js internals (still covers llms.txt,
// .well-known/mcp.json, and all pages so alternate hosts redirect everywhere).
export const config = {
  matcher: ['/((?!_next/).*)'],
}
