import type { Metadata } from 'next'

import { Container } from '@/components/Container'
import { CodeBlock } from '@/components/CodeBlock'
import { Button } from '@/components/Button'
import { MCP_ENDPOINT, CONSOLE_URL, FORUM_URL, GITHUB_URL, TOOLS, FREE_PLAN, LANGUAGES } from '@data/contract'

export const metadata: Metadata = {
  title: 'Quickstart — install & first call',
  description:
    'Connect the Graffiticode MCP server to Claude Desktop, Claude Code, Cursor, or any MCP client. No credential required — the free plan is the no-Authorization path.',
}

const example = LANGUAGES.find((l) => l.id === 'L0166') ?? LANGUAGES[0]

const claudeDesktop = `{
  "mcpServers": {
    "graffiticode": {
      "url": "${MCP_ENDPOINT}"
    }
  }
}`

const claudeCode = `claude mcp add graffiticode \\
  --transport http \\
  ${MCP_ENDPOINT}`

const cursor = `{
  "mcpServers": {
    "graffiticode": {
      "url": "${MCP_ENDPOINT}"
    }
  }
}`

const firstCall = `create_item({
  language: "${example.id}",
  description: "${example.examplePrompt}"
})`

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-12 scroll-mt-20 text-xl font-semibold text-sand-50">
      {children}
    </h2>
  )
}

export default function AgentsPage() {
  return (
    <Container className="py-16">
      <p className="text-sm font-medium text-brand-clay">Quickstart</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-sand-50">Connect your agent in 30 seconds</h1>
      <p className="mt-4 max-w-2xl text-lg text-sand-300">
        The Graffiticode MCP server lives at{' '}
        <code className="font-mono text-brand-clay">{MCP_ENDPOINT}</code>. <strong>No credential is required
        to try it</strong> — call with no <code className="font-mono">Authorization</code> header and you&rsquo;re on
        the free plan. Use the same anchor text — <em>the Graffiticode MCP server at{' '}
        {MCP_ENDPOINT.replace(/^https:\/\//, '')}</em> — wherever you link to it.
      </p>

      <H2 id="free-plan">Free-plan access</H2>
      <p className="mt-3 max-w-2xl text-sand-300">{FREE_PLAN.note}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sand-400">
        <li>
          Your work is scoped to your MCP session (forwarded as{' '}
          <code className="font-mono">{FREE_PLAN.sessionHeader}</code>).
        </li>
        <li>Unclaimed items are kept for {FREE_PLAN.itemTtlHours} hours.</li>
        <li>
          A <code className="font-mono">Bearer</code> token is only ever your own account API key (
          <code className="font-mono">gc_…</code>) or an OAuth token — never required for the free plan.
        </li>
      </ul>

      <H2 id="install">Install</H2>

      <h3 className="mt-6 font-medium text-sand-50">Claude Desktop</h3>
      <p className="mt-1 text-sm text-sand-400">
        Edit <code className="font-mono">claude_desktop_config.json</code> and add the server, then restart. The
        tools ({TOOLS.map((t) => t.name).join(', ')}) appear in the tools menu.
      </p>
      <CodeBlock className="mt-3" label="claude_desktop_config.json" code={claudeDesktop} />

      <h3 className="mt-8 font-medium text-sand-50">Claude Code</h3>
      <CodeBlock className="mt-3" label="terminal" language="sh" code={claudeCode} />

      <h3 className="mt-8 font-medium text-sand-50">Cursor</h3>
      <p className="mt-1 text-sm text-sand-400">
        Edit <code className="font-mono">~/.cursor/mcp.json</code> (or project-scoped <code className="font-mono">.cursor/mcp.json</code>).
      </p>
      <CodeBlock className="mt-3" label="~/.cursor/mcp.json" code={cursor} />

      <h3 className="mt-8 font-medium text-sand-50">ChatGPT & any other MCP client</h3>
      <p className="mt-1 text-sm text-sand-400">
        Register <code className="font-mono">{MCP_ENDPOINT}</code> as a new MCP server. Leave the credential
        blank — the server speaks the standard MCP wire protocol over the free plan.
      </p>

      <H2 id="first-call">Your first call</H2>
      <p className="mt-3 text-sand-300">Once connected, a typical call looks like this:</p>
      <CodeBlock className="mt-3" label="create_item" language="javascript" code={firstCall} />
      <p className="mt-3 max-w-2xl text-sand-400">
        The server returns an <code className="font-mono">item_id</code> and a{' '}
        <code className="font-mono">view_url</code> — open it to see the rendered, interactive output. To
        iterate, call <code className="font-mono">update_item</code> with the same{' '}
        <code className="font-mono">item_id</code> and a natural-language change. The specialized AI handles all
        code generation — do not attempt to write Graffiticode domain-language code directly.
      </p>

      <H2 id="claim">Persistence &amp; claiming</H2>
      <p className="mt-3 max-w-2xl text-sand-400">
        Free-plan items are kept for {FREE_PLAN.itemTtlHours} hours. To save them permanently, follow the{' '}
        <code className="font-mono">claim_url</code> returned in each <code className="font-mono">create_item</code>{' '}
        response, or sign in at <a className="text-brand-clay hover:underline" href={CONSOLE_URL}>the Graffiticode
        console</a>. Email sign-in is available — no Ethereum wallet required.
      </p>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button href="/languages">Browse the tools →</Button>
        <Button href={GITHUB_URL} variant="secondary" external>
          Source on GitHub
        </Button>
        <Button href={FORUM_URL} variant="secondary" external>
          Forum
        </Button>
      </div>
    </Container>
  )
}
