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

export interface Positioning {
  /** Short pill above the headline. */
  eyebrow: string
  /** The homepage H1's first clause. */
  headline: string
  /** ONE sentence: what Graffiticode is. The canonical definition. */
  definition: string
  /** How it works, stated structurally — never numerically. */
  mechanism: string
  /** Compressed form for OG tags and mcp.json, where length is tight. */
  short: string
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
 * THE POSITION — mirrors marketing/graffiticode-reason-to-be.md §What.
 *
 * Every surface that states what Graffiticode *is* reads from here: the
 * homepage hero, the layout metadata (title + OG), /languages, and the
 * generated discovery files. Before this existed the same sentence was
 * hand-copied into four files and drifted; don't reintroduce a second copy.
 *
 * Claim discipline (marketing/marketing-corpus-consistency-plan.md): no
 * first-try-success percentage and no registry-coverage claim may appear in
 * this block. State the mechanism, not the outcome.
 *
 * Vocabulary: a *language* (dialect) is the formal capability boundary; a
 * *micro-agent* is the generator+compiler pairing and is what an agent calls;
 * a *smart tool* is the user-facing packaging and belongs
 * in presentation copy only. Don't let "smart tool" stand in for "micro-agent"
 * in architectural prose.
 */
export const POSITIONING = {
  eyebrow: 'The bridge between agents and services',
  headline: "Your agent shouldn't guess at a specialist's job.",
  definition:
    'Graffiticode is a platform of specialized micro-agents whose capabilities are formally defined by domain-specific languages — the missing bridge between general-purpose agents and the services they need to drive.',
  mechanism:
    'Each micro-agent pairs a domain language that formally bounds what it can do with a compiler that validates the work before it comes back. Your agent delegates to a specialist instead of improvising against an API it has to guess at.',
  short:
    'Specialized micro-agents your agent can call. One MCP endpoint, no credential required.',
} satisfies Positioning

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

/** The plan ladder, low to high. A union so an audience can't name a plan that
 * doesn't exist — a typo is a compile error, not a silently empty grid. */
export type PricingPlanName = 'Bronze' | 'Silver' | 'Gold' | 'Platinum'

export interface PricingPlan {
  /** Display name, e.g. "Bronze", "Silver". */
  name: PricingPlanName
  /** Monthly base charge in USD. */
  monthlyBase: number
  /** Struck-through list price shown before `monthlyBase`, in USD. PRESENTATION
   * ONLY — an anchor, with no counterpart in plans-config.ts or Stripe. Nothing
   * ever bills at this figure, so it is not part of the plans-config mirror. */
  listPrice?: number
  /** Included successful items per month. */
  includedItems: number
  /** Per-item price beyond the included bucket in USD, or null when overage isn't offered. */
  additionalItem: number | null
  /** Whether this is the zero-base on-ramp tier (drives the "on-ramp" badge and card styling). */
  free?: boolean
  /** One-line positioning shown on the plan card. */
  note: string
}

/** A short titled block used for the principle cards. */
export interface PricingPrinciple {
  title: string
  body: string
}

/** A standing page section: heading + lead + titled blocks. The prose lives
 * here rather than in JSX so the page stays a projection of this file. */
export interface PricingSection {
  heading: string
  lead: string
  items: PricingPrinciple[]
}

export interface PricingLink {
  label: string
  href: string
  external?: boolean
}

export interface PricingCta {
  title: string
  body: string
  /** Never hard-code the action in the view. */
  primary: PricingLink
  secondary?: PricingLink
}

/**
 * Usage-based pricing.
 *
 * SOURCE OF TRUTH: console/src/lib/plans-config.ts (`PLANS`). Every number
 * below — base price, includedItems, overageRatePerItem, display name — is a
 * HAND-MAINTAINED COPY of that file. This repo cannot import it, so the copy
 * will silently drift the next time pricing moves: when a plan changes there,
 * change it here in the same pass. Customer-facing card copy that has already
 * been through review lives in console/src/utils/plans.ts; the reasoning
 * (billable item, Bronze's two states, arrears overage) is in
 * console/docs/item-based-pricing.md.
 *
 * Facts here also mirror the ArtCompiler price sheet
 * (marketing/artcompiler-price-sheet.md). Internal economics — margins,
 * break-even, the pricing calculator — are deliberately NOT projected here;
 * this file only carries what the public pricing page is allowed to show.
 *
 * The page is single-audience: every reader is an agent (or the developer
 * behind one), so the whole ladder is shown to everyone and the fields below
 * read in page order. `included` is the one standing section — its prose lives
 * here, not in the JSX.
 */
export const PRICING = {
  /** A "successful item" is billable; failures, reads, and iteration are free. */
  billableUnit: 'successful item',
  plans: [
    {
      // Named "Free" until pay-as-you-go landed; still the same $0 tier (internal
      // id `demo`). `free: true` keeps the zero-cost signal prominent — the word
      // "free" doing that job is why the console kept it in the Bronze copy too.
      name: 'Bronze',
      listPrice: 10,
      monthlyBase: 0,
      includedItems: 50,
      // DELIBERATELY dearer per item than Silver's $0.10. Pay-as-you-go is the
      // bridge past the 50-item wall, not a cheaper substitute for a
      // subscription. If the page ever shows a per-item ladder, this inversion
      // is intentional — do not "correct" it.
      additionalItem: 0.2,
      free: true,
      note: 'The on-ramp — the first 50 items each month are free, with no credit card. A card is required only to create additional items, along with a monthly spend cap; move to Silver when volume makes the flat rate cheaper.',
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
      note: 'Our lowest per-item rate at $0.025, for sustained high volume — cheaper than Gold above ~200,000 items/mo.',
    },
  ] as PricingPlan[],
  /** What every plan carries, whatever the volume. Prose lives here, not in JSX. */
  included: {
    heading: 'Included at every tier',
    lead: 'The rate changes with volume. Everything below does not.',
    items: [
      {
        // CLAIM DISCIPLINE: registry listings are not submitted or evidenced yet,
        // so this may NOT say we are registered across the major registries. What
        // is true and shippable: the server is public, agent-reachable, and carries
        // the machine-readable discovery files agents look for.
        title: 'Immediate visibility',
        body: 'Graffiticode is a public, agent-reachable MCP server carrying the machine-readable discovery files agents look for. Every smart tool is live in list_languages the moment it ships — nothing to register, configure, or wire up on your side.',
      },
      {
        // CLAIM DISCIPLINE: first-attempt success is instrumented but unpublished.
        // No percentage until we can publish cohort, task definition, window, and
        // sample size. Until then the claim is structural, not numeric.
        title: 'Reliability',
        body: 'The compiler validates every result server-side before it reaches your agent, so a request either returns something that works or fails loudly enough to correct. You get a working result instead of plausible-but-broken output.',
      },
      {
        title: 'Safety',
        body: 'A capability-based security model gives you fine-grained control over what an agent can do and when. Agents operate strictly inside the guardrails you set — permissioned, scoped, and observable.',
      },
      {
        title: 'Versioning',
        body: 'Every change is recorded and reversible. Agent-driven edits are fully auditable and safe to undo — what makes handing an agent write access tolerable in the first place.',
      },
    ],
  } satisfies PricingSection,
  eyebrow: 'Pricing',
  title: 'Create with agent-driven tools',
  lead: 'Connect an agent and start creating — no credential, no credit card. Your first 50 items each month are free; past that you pay per successful item, at a flat rate that falls as volume grows.',
  principles: [
    {
      title: 'Billed per successful item',
      body: 'A successful item is a create request that returns a compiled, valid result. If it doesn\u2019t produce something that works, you don\u2019t pay for it.',
    },
    {
      title: 'Free to start, capped by you',
      body: 'Your first 50 items each month are free, and need no credit card at all. A card is required only to create additional items — and only alongside a monthly spend cap, so you can never be billed more than you chose.',
    },
    {
      title: 'Iteration & reads are free',
      body: 'Refining an item is part of creating it, not a separate charge. Reading and retrieving items is always free.',
    },
  ] satisfies PricingPrinciple[],
  plansHeading: 'Plans',
  plansIntro: 'Each paid plan is a flat per-item rate with a monthly minimum — the included bucket is priced at the same rate as additional items, so there\u2019s no penalty for going over. Move up a plan exactly when it lowers your per-item cost. Bronze\u2019s pay-as-you-go rate is higher by design: it\u2019s the bridge past the first 50 items, not a way to stay below a subscription.',
  plansFootnote:
    'Example: 20,000 items in a month costs $1,000 on Gold ($0.05/item). At 100,000 items, still $5,000 on Gold. At 500,000 items, $12,500 on Platinum.',
  cta: {
    title: 'Start free',
    body: 'No credential needed — connect an agent and start creating. Your first 50 items each month are free, and nothing is billed until you add a card and set a cap yourself.',
    // `external: false` is explicit so the renderer can read `.external` off the
    // literal \u2014 `satisfies` preserves literal types, so an omitted optional is
    // absent from the type, not undefined.
    primary: { label: 'Start free \u2192', href: '/agents', external: false },
  } satisfies PricingCta,
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
