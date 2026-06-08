import type { Metadata } from 'next'

import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { MCP_ENDPOINT } from '@data/contract'

export const metadata: Metadata = {
  title: 'Build a smart tool',
  description:
    'Turn your domain expertise into a smart MCP tool that serves both AI agents and the people who use them.',
}

export default function BuildPage() {
  return (
    <Container className="py-16">
      <p className="text-sm font-medium text-emerald-300">For tool builders</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Build a smart tool</h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-300">
        AI agents are routing around SaaS. Turn your domain expertise into a smart tool that serves both the
        agent calling it at 2am and the human who opens your dashboard — so your product stays in the loop.
      </p>

      <div className="mt-10 space-y-6 text-zinc-300">
        <div>
          <h2 className="font-semibold text-white">Your domain expertise is the moat</h2>
          <p className="mt-2 max-w-2xl text-zinc-400">
            General-purpose AI hallucinates; its intelligence is jagged. Graffiticode grounds every tool in a
            domain language that defines exactly what it can do. Users and agents express intent in natural
            language; Graffiticode compiles it into a structured artifact validated before it runs.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-white">One server, instantly reachable</h2>
          <p className="mt-2 max-w-2xl text-zinc-400">
            Every tool you build deploys to the canonical MCP server at{' '}
            <code className="font-mono text-emerald-300">{MCP_ENDPOINT}</code> — reachable by any agent on the
            platform — and ships with the embeddable UI your human users expect.
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-white/10 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-white">Have an idea for a tool?</h2>
        <p className="mt-1 max-w-xl text-sm text-zinc-400">
          Tell us about your domain and we&rsquo;ll help you scope a language. We review every submission.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button href="https://forum.graffiticode.org" external>
            Propose a tool on the forum →
          </Button>
          <Button href="mailto:jeff@artcompiler.com?subject=Smart%20tool%20idea" variant="secondary" external>
            Email the team
          </Button>
        </div>
      </div>
    </Container>
  )
}
