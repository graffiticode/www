/**
 * THE CONTRACT — the single source of truth for this site.
 *
 * Every public surface (the homepage, /agents, /languages, the generated
 * llms.txt and .well-known/mcp.json) is a projection of this file. Nothing
 * about the MCP endpoint, tools, free-plan terms, or language registry is
 * hand-written anywhere else. If a fact is wrong, it is wrong here, once.
 *
 * The language registry lives in ./languages.json and is refreshable from the
 * live API via `npm run sync:languages` — so the site cannot drift from what
 * the MCP server actually exposes.
 */
import languagesData from './languages.json'

export interface Language {
  id: string
  name: string
  blurb: string
  examplePrompt: string
  itemTypes: string[]
  /** A real task id (base64 {"taskIds":[...]}), embedded as living proof.
   * Rendered directly via /form?id=<taskId> so the app skips the item→task lookup. */
  showcaseTaskId: string | null
  /** Optional zoom for the embedded item (e.g. 0.75 to render at 75%). Defaults to 1. */
  embedScale?: number
  /** Optional per-tool aspect ratio for the live-example frame (CSS aspect-ratio,
   * e.g. '3 / 2', '1 / 1', '16 / 9'). The frame is always full width; this sets its
   * height. Defaults to '3 / 2' when unset. */
  embedRatio?: string
}

export interface McpTool {
  name: string
  summary: string
  params: { name: string; type: string; required: boolean; description: string }[]
}

export const SITE_URL = process.env.SITE_URL?.replace(/\/$/, '') || 'https://graffiticode.org'

/** The canonical MCP endpoint. Use this exact anchor everywhere. */
export const MCP_ENDPOINT = 'https://mcp.graffiticode.org/mcp'
export const MCP_ABOUT = 'https://mcp.graffiticode.org/about'

export const APP_URL = 'https://app.graffiticode.org'
export const API_URL = 'https://api.graffiticode.org'
export const CONSOLE_URL = 'https://console.graffiticode.org'
export const FORUM_URL = 'https://forum.graffiticode.org'
export const GITHUB_URL = 'https://github.com/graffiticode'

/**
 * The free-plan access contract (mirrors marketing/free-plan-contract.md and
 * the shipped code: console/src/lib/free-plan-context.ts + mcp-server claim-token.ts).
 */
export const FREE_PLAN = {
  credentialRequired: false as const,
  sessionHeader: 'X-Free-Plan-Session',
  itemTtlHours: 48,
  claimJwtTtlHours: 24,
  // A Bearer credential is ONLY ever a real account API key (gc_…) or an OAuth token.
  note:
    'No credential is required to try Graffiticode. Call the MCP server with no Authorization header and your work is scoped to your MCP session. Pass a Bearer token only to use your own account (gc_…) or OAuth.',
}

export interface PricingPlan {
  /** Display name, e.g. "Free", "Silver". */
  name: string
  /** Monthly base charge in USD. */
  monthlyBase: number
  /** Included successful items per month. */
  includedItems: number
  /** Per-item price beyond the included bucket in USD, or null when overage isn't offered. */
  additionalItem: number | null
  /** Whether this is the free on-ramp tier. */
  free?: boolean
  /** One-line positioning shown on the plan card. */
  note: string
}

/** A short titled block used for the principle cards. */
export interface PricingPrinciple {
  title: string
  body: string
}

/** Per-audience framing for the pricing page. The plans/rates are shared; only
 * the surrounding story changes between vendors and consumers. */
export interface PricingAudience {
  /** Toggle label + hero eyebrow, e.g. "For vendors". */
  eyebrow: string
  title: string
  lead: string
  /** Consumer-only: the one-card explanation of sponsored vs unsponsored. */
  sponsorship?: PricingPrinciple
  principles: PricingPrinciple[]
  plansHeading: string
  plansIntro: string
  /** Show the vendor-only "Included at every tier" section. */
  showIncluded: boolean
  /** Show the vendor-only "Custom language development" section. */
  showCustom: boolean
}

/**
 * Usage-based pricing. Facts here mirror the ArtCompiler price sheet
 * (marketing/artcompiler-price-sheet.md). Internal economics — margins,
 * break-even, the pricing calculator — are deliberately NOT projected here;
 * this file only carries what the public pricing page is allowed to show.
 *
 * NOTE: the consumer sponsored/unsponsored dimension (PRICING.audiences.consumer)
 * is new vocabulary not yet in the price sheet — mirror it back into
 * marketing/artcompiler-price-sheet.md when that sheet gains a consumer section.
 */
export const PRICING = {
  /** A "successful item" is billable; failures, reads, and iteration are free. */
  billableUnit: 'successful item',
  plans: [
    {
      name: 'Free',
      monthlyBase: 0,
      includedItems: 50,
      additionalItem: null,
      free: true,
      note: 'The on-ramp — stand up the surface and see it work. Hard cap at 50 items/mo; move to Silver to go further.',
    },
    {
      name: 'Silver',
      monthlyBase: 100,
      includedItems: 1_000,
      additionalItem: 0.1,
      note: 'Flat $0.10/item with a $100 monthly minimum.',
    },
    {
      name: 'Gold',
      monthlyBase: 1_000,
      includedItems: 20_000,
      additionalItem: 0.05,
      note: 'Cheaper than Silver above ~10,000 items/mo — $0.05/item.',
    },
    {
      name: 'Platinum',
      monthlyBase: 10_000,
      includedItems: 400_000,
      additionalItem: 0.025,
      note: 'Cheaper than Gold above ~200,000 items/mo — $0.025/item. Includes custom language development.',
    },
  ] as PricingPlan[],
  /** Value delivered at every tier — the agent-accessibility surface. */
  included: [
    {
      title: 'Immediate visibility',
      body: 'Graffiticode is a registered MCP server across the major agent registries. Your product surfaces in agent tool discovery on day one — no registry submissions or discovery engineering on your side.',
    },
    {
      title: 'Reliability',
      body: '~99% first-try success on item creation. The compiler enforces valid structure, so an agent gets a working artifact instead of plausible-but-broken output — which keeps it reaching for your product.',
    },
    {
      title: 'Safety',
      body: 'A capability-based security model gives you fine-grained control over what an agent can do and when. Agents operate strictly inside the guardrails you set — permissioned, scoped, and observable.',
    },
    {
      title: 'Versioning',
      body: 'Every change is recorded and reversible. Agent-driven edits are fully auditable and safe to undo — what makes granting an agent write-access to a production product sane.',
    },
  ],
  /** Per-audience framing. The plans above are shared across both. */
  audiences: {
    vendor: {
      eyebrow: 'For vendors',
      title: 'Agent-accessibility for your product',
      lead: 'You bring the product; we make it something an AI agent can drive — reliably, safely, and inside your guardrails. You pay for usage, not a subscription. The bill scales with adoption — no upfront commitment, no seat licenses to forecast.',
      principles: [
        {
          title: 'Billed per successful item',
          body: 'A successful item is a create request that returns a compiled, valid artifact. If it doesn’t produce a working result, you don’t pay for it.',
        },
        {
          title: 'Iteration is included',
          body: 'Refining an item — as many revisions as it takes to get it right — is part of creating it, not a separate charge. Reads and retrievals are always free.',
        },
        {
          title: 'You own the customer',
          body: 'Your customers authenticate with your credentials and never see Artcompiler. Pass our fee through, bundle it, or resell agentic authoring as a premium feature.',
        },
      ],
      plansHeading: 'Plans',
      plansIntro: 'Each paid plan is a flat per-item rate with a monthly minimum — the included bucket is priced at the same rate as additional items, so there’s no penalty for going over. Move up a plan exactly when it lowers your per-item cost.',
      showIncluded: true,
      showCustom: true,
    },
    consumer: {
      eyebrow: 'For consumers',
      title: 'Create with agent-driven tools',
      lead: 'Sponsored tools cost you nothing. You pay only for what a vendor hasn’t already covered — at the same rates, with your first 50 items free every month.',
      sponsorship: {
        title: 'Sponsored items are free',
        body: 'Many Graffiticode tools are sponsored by the vendor who built them — everything you create with a sponsored tool is free to you. You pay only for unsponsored items, and only at the per-item rates below.',
      },
      principles: [
        {
          title: 'No setup, no cap',
          body: 'If a vendor sponsors the tool you’re using, every item you create with it is free — no cap, and nothing to set up on your side.',
        },
        {
          title: 'Unsponsored items, same rates',
          body: 'For tools no vendor covers, you pay the same per-item rates as everyone else. Your first 50 items each month are free.',
        },
        {
          title: 'Iteration & reads are free',
          body: 'Refining an item is part of creating it, not a separate charge. Reading and retrieving items is always free.',
        },
      ],
      plansHeading: 'Pricing for unsponsored items',
      plansIntro: 'Unsponsored items use the same flat per-item tiers below — the included bucket is priced at the same rate as additional items, so there’s no penalty for going over.',
      showIncluded: false,
      showCustom: false,
    },
  } satisfies Record<string, PricingAudience>,
}

export const TOOLS: McpTool[] = [
  {
    name: 'list_languages',
    summary: 'Discover available languages. Use this first to find the language that fits the task.',
    params: [
      { name: 'category', type: 'string', required: false, description: 'Optional category filter.' },
      { name: 'search', type: 'string', required: false, description: 'Optional keyword search.' },
    ],
  },
  {
    name: 'get_language_info',
    summary: 'Get authoring details, item types, and example prompts for one language. Call after list_languages.',
    params: [
      { name: 'language', type: 'string', required: true, description: 'The language code, e.g. "L0166".' },
    ],
  },
  {
    name: 'create_item',
    summary: 'Create an interactive item from a natural-language description.',
    params: [
      { name: 'language', type: 'string', required: true, description: 'The language code, e.g. "L0169".' },
      { name: 'description', type: 'string', required: true, description: 'Natural-language description of what to create.' },
    ],
  },
  {
    name: 'update_item',
    summary: 'Modify an existing item with a natural-language instruction.',
    params: [
      { name: 'item_id', type: 'string', required: true, description: 'The id of the item to update.' },
      { name: 'modification', type: 'string', required: true, description: 'Natural-language description of the change.' },
    ],
  },
  {
    name: 'get_item',
    summary: 'Retrieve an existing item by id.',
    params: [{ name: 'item_id', type: 'string', required: true, description: 'The id of the item to retrieve.' }],
  },
]

export const LANGUAGES: Language[] = languagesData as Language[]

export function getLanguage(id: string): Language | undefined {
  return LANGUAGES.find((l) => l.id.toLowerCase() === id.toLowerCase())
}

/** The view URL for a hosted item or task. Served by the lighter-weight API
 * service's /form route (accepts either an item or task id via ?id=). */
export function viewUrl(id: string): string {
  return `${API_URL}/form?id=${id}`
}

/** Items with a real showcase task id, for the proof gallery / live embeds. */
export const SHOWCASE = LANGUAGES.filter((l) => l.showcaseTaskId)
