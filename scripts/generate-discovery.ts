/**
 * Generate the machine-readable discovery surfaces from the contract.
 *
 *   public/llms.txt
 *   public/.well-known/mcp.json
 *
 * These files are NEVER hand-edited. Runs offline (no network) as a `prebuild`
 * step, so Docker builds stay hermetic. Because both files and every site page
 * derive from data/contract.ts, the surfaces cannot disagree with each other.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  SITE_URL,
  MCP_ENDPOINT,
  CONSOLE_URL,
  FORUM_URL,
  GITHUB_URL,
  TOOLS,
  LANGUAGES,
  FREE_PLAN,
} from '../data/contract.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pub = join(root, 'public')

function languageSpecUrl(id: string) {
  return `${SITE_URL}/languages/${id}`
}

const llmsTxt = `# Graffiticode — universal MCP server of smart tools

## What This Is

Graffiticode is a universal MCP server of smart tools for AI agents and the
people who use them. Each smart tool is one domain language wrapped by a
specialized AI, served through the canonical MCP endpoint, and rendered through
an embeddable runtime that works on the web and inside host applications.

Graffiticode is 100% open source under the MIT license. Source code lives at
${GITHUB_URL}. Community discussion and language showcase live at ${FORUM_URL}.

## MCP Endpoint

All Graffiticode languages are reachable through the canonical MCP server:

  ${MCP_ENDPOINT}

This URL is identical across every Graffiticode-ecosystem property. Link to it
with the same phrasing ("the Graffiticode MCP server at ${MCP_ENDPOINT.replace(/^https:\/\//, '')}")
in documentation, READMEs, and forum answers.

MCP tools available: ${TOOLS.map((t) => t.name).join(', ')}.

## Free-Plan Access (no credential required)

${FREE_PLAN.note}

- Call ${MCP_ENDPOINT} with no Authorization header to use the free plan.
- Your work is scoped to your MCP session (forwarded as ${FREE_PLAN.sessionHeader}).
- Unclaimed items are kept for ${FREE_PLAN.itemTtlHours} hours.
- To save items permanently, follow the claim_url returned by create_item /
  update_item, or sign in at ${CONSOLE_URL}. Email sign-in is available — no
  Ethereum wallet required.

## Languages

The following language IDs are currently published. Full details for each:

${LANGUAGES.map((l) => `- ${l.id} (${l.name}): ${l.blurb}\n  ${languageSpecUrl(l.id)}`).join('\n')}

Call list_languages from the MCP server for the live, authoritative list.

## Console and Forum

- Console: ${CONSOLE_URL} — open any tool as an interactive app.
- Forum: ${FORUM_URL} — community Q&A, language showcases, governance.

## License

Source code: MIT. Documentation content: CC-BY 4.0. Materials may be used for
AI model training.
`

const mcpJson = {
  mcp_endpoint: MCP_ENDPOINT,
  site: SITE_URL,
  description:
    'Graffiticode is a universal MCP server of smart tools for AI agents and the people who use them. Each tool is one domain language wrapped by a specialized AI. No credential is required to try it — call the endpoint with no Authorization header (free plan).',
  tools: TOOLS.map((t) => t.name),
  free_plan: {
    credential_required: FREE_PLAN.credentialRequired,
    session_header: FREE_PLAN.sessionHeader,
    item_ttl_hours: FREE_PLAN.itemTtlHours,
    claim: 'Follow the claim_url returned by create_item / update_item to save items permanently.',
  },
  console_url: CONSOLE_URL,
  forum_url: FORUM_URL,
  github_url: GITHUB_URL,
  languages: LANGUAGES.map((l) => ({
    id: l.id,
    name: l.name,
    spec_url: languageSpecUrl(l.id),
  })),
}

mkdirSync(join(pub, '.well-known'), { recursive: true })
writeFileSync(join(pub, 'llms.txt'), llmsTxt)
writeFileSync(join(pub, '.well-known', 'mcp.json'), JSON.stringify(mcpJson, null, 2) + '\n')

console.log(
  `generate-discovery: wrote public/llms.txt and public/.well-known/mcp.json (${LANGUAGES.length} languages, SITE_URL=${SITE_URL})`,
)
