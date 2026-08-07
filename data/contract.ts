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

/** The language-development offer. A productized service, not a retainer:
 * unlimited requests worked one at a time from a queue the partner prioritizes. */
export interface PricingLanguageService extends PricingSection {
  /** Fine print, one line each. */
  terms: string[]
}

export interface PricingLink {
  label: string
  href: string
  external?: boolean
}

export interface PricingCta {
  title: string
  body: string
  /** The action this audience should take. Partners are asked to talk to us;
   * agents are asked to start free. Never hard-code either in the view. */
  primary: PricingLink
  secondary?: PricingLink
}

/** Per-audience framing for the pricing page. The plans/rates are shared; each
 * audience projects a subset of them and tells its own story around them. */
export interface PricingAudience {
  /** Toggle label + hero eyebrow, e.g. "For partners". */
  eyebrow: string
  title: string
  lead: string
  principles: PricingPrinciple[]
  /** Which of the shared plans this audience shows, filtered out of
   * PRICING.plans (so the ladder keeps its canonical low-to-high order). */
  planNames: PricingPlanName[]
  plansHeading: string
  plansIntro: string
  /** Optional worked example printed under the plan grid. */
  plansFootnote?: string
  /** Visibility only — the prose lives in PRICING.included. */
  showIncluded: boolean
  /** Visibility only — the prose lives in PRICING.languageService. */
  showLanguageService: boolean
  cta: PricingCta
  /** Optional invoicing fine print at the foot of the page. */
  billingNote?: string
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
 * Two things here are projections, not plan data:
 *   - Each audience shows a SUBSET of the ladder via `planNames`. Partners see
 *     Platinum only (it is the language-development engagement); agents see all
 *     four. The plans array itself stays a field-for-field mirror of plans-config,
 *     names included — both surfaces call the top tier Platinum.
 *   - `languageService` describes what Platinum buys. Its terms — unlimited
 *     requests, one worked at a time, pause or cancel any month — are a PUBLIC
 *     COMMITMENT, not just copy. Keep them in sync with the price sheet and the
 *     console's plan copy, and don't add a turnaround figure we can't hold to.
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
      // Note deliberately makes no cross-tier comparison: partners see this card
      // alone, so "cheaper than Gold" would point at a tier that isn't on screen.
      // The agent view carries the crossover math in `plansFootnote` instead.
      note: 'The partner engagement — our lowest per-item rate at $0.025, and it includes custom language development with no additional fee.',
    },
  ] as PricingPlan[],
  /** What the agent-accessibility surface delivers, whatever the volume. */
  included: {
    heading: 'Included in every engagement',
    lead: 'Whatever the volume, partnering includes the full agent-accessibility surface for your product.',
    items: [
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
  } satisfies PricingSection,
  /**
   * The partner offer. Modelled on the productized-service firms that bill a
   * flat monthly fee for a continuous stream of work: "unlimited" describes the
   * requests and revisions, never the throughput. One request is active at a
   * time and the partner sets the order — that limit is the whole reason the
   * flat fee works, so it is stated plainly rather than buried as an internal cap.
   */
  languageService: {
    heading: 'Custom language development',
    lead: 'A bespoke agent surface tailored to your product — your data model, your item types, your workflows. This is the done-for-you build: we design and operate the language and skills that let agents drive your product natively, and keep them current as agent platforms evolve. It is what Platinum buys, with no separate build fee and no statement of work to negotiate.',
    items: [
      {
        title: 'Unlimited requests',
        body: 'Ask for as much as you need — a new item type, a change to the spec, a new capability, a revision to any of it. There is no request budget and no per-change quote, and revisions to the active request are unlimited.',
      },
      {
        title: 'One at a time',
        body: 'We work a single request at a time and start the next when the current one ships. That is what keeps a flat monthly fee honest: you are buying a continuous stream of work, not a promise of infinite parallel capacity.',
      },
      {
        title: 'You set the priority',
        body: 'Your queue, your order. Reorder it whenever the roadmap moves — whatever sits at the top is what we build next, and nothing needs re-scoping or re-contracting to change that.',
      },
    ],
    terms: [
      'Included at Platinum — no separate build fee.',
      'Pause or cancel any month.',
      'Early design-partner program: a limited number of partners on preferred terms, by invitation.',
    ],
  } satisfies PricingLanguageService,
  /** Per-audience framing. The plans above are shared; each audience projects
   * the subset named in `planNames`. */
  audiences: {
    partner: {
      eyebrow: 'For partners',
      title: 'We build the language your product speaks',
      lead: 'You bring the product; we make it something an AI agent can drive — reliably, safely, and inside your guardrails. Partnering is one flat monthly fee that buys both: the agent-accessibility surface, and the ongoing language development that keeps it fitted to your product as it changes.',
      principles: [
        {
          title: 'Development is the product',
          body: 'The language and skills that let agents drive your product are not a one-off build we hand over. We design them, operate them, and keep revising them for as long as you are a partner.',
        },
        {
          title: 'A continuous stream, not a project',
          body: 'No statements of work, no change orders, no per-request quotes. Requests go in a queue you prioritize and we work them one at a time — so the roadmap can move without renegotiating anything.',
        },
        {
          title: 'You own the customer relationship',
          body: 'Your customers authenticate with your credentials and never see Artcompiler. Pass our fee through, bundle it, or resell agentic authoring as a premium feature.',
        },
      ],
      planNames: ['Platinum'],
      plansHeading: 'What partnering costs',
      plansIntro: 'One tier, one flat monthly fee. It covers 400,000 successful items a month and the language development that makes them worth creating — additional items bill at the lowest per-item rate we offer.',
      showIncluded: true,
      showLanguageService: true,
      cta: {
        title: 'Talk to us about your product',
        body: 'Partnering starts with a conversation about what your product does and what an agent would need to drive it. You can also connect an agent and create your first 50 items free, right now, to see the surface before you talk to anyone.',
        primary: {
          label: 'Talk to us →',
          href: 'mailto:jeff@artcompiler.com?subject=Graffiticode%20partnership',
          external: true,
        },
        secondary: { label: 'Try it free', href: '/agents' },
      },
      billingNote:
        'The monthly fee is billed in advance and delivered as a single invoice, with any additional items metered to your tenant and billed in arrears. Committed-use terms are available as the engagement matures.',
    },
    agent: {
      eyebrow: 'For agents',
      title: 'Create with agent-driven tools',
      lead: 'Connect an agent and start creating — no credential, no credit card. Your first 50 items each month are free; past that you pay per successful item, at a flat rate that falls as volume grows.',
      principles: [
        {
          title: 'Billed per successful item',
          body: 'A successful item is a create request that returns a compiled, valid artifact. If it doesn’t produce a working result, you don’t pay for it.',
        },
        {
          title: 'Free to start, capped by you',
          body: 'Your first 50 items each month are free, and need no credit card at all. A card is required only to create additional items — and only alongside a monthly spend cap, so you can never be billed more than you chose.',
        },
        {
          title: 'Iteration & reads are free',
          body: 'Refining an item is part of creating it, not a separate charge. Reading and retrieving items is always free.',
        },
      ],
      planNames: ['Bronze', 'Silver', 'Gold', 'Platinum'],
      plansHeading: 'Plans',
      plansIntro: 'Each paid plan is a flat per-item rate with a monthly minimum — the included bucket is priced at the same rate as additional items, so there’s no penalty for going over. Move up a plan exactly when it lowers your per-item cost. Bronze’s pay-as-you-go rate is higher by design: it’s the bridge past the first 50 items, not a way to stay below a subscription.',
      plansFootnote:
        'Example: 20,000 items in a month costs $1,000 on Gold ($0.05/item). At 100,000 items, still $5,000 on Gold. At 500,000 items, $12,500 on Platinum.',
      showIncluded: false,
      showLanguageService: false,
      cta: {
        title: 'Start free',
        body: 'No credential needed — connect an agent and start creating. Your first 50 items each month are free, and nothing is billed until you add a card and set a cap yourself.',
        primary: { label: 'Start free →', href: '/agents' },
      },
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
