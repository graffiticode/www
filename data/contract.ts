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
 * Vocabulary: a *language* (dialect) is the formal capability boundary and is
 * what a partner buys; a *micro-agent* is the generator+compiler pairing and is
 * what an agent calls; a *smart tool* is the user-facing packaging and belongs
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
        // CLAIM DISCIPLINE: registry listings are not submitted or evidenced yet,
        // so this may NOT say we are registered across the major registries. What
        // is true and shippable: the server is public, agent-reachable, and carries
        // the machine-readable discovery files agents look for.
        title: 'Immediate visibility',
        body: 'Your product is live in every list_languages call the moment its micro-agent ships. Graffiticode is a public, agent-reachable MCP server carrying the machine-readable discovery files agents look for — no registry submissions or discovery engineering on your side.',
      },
      {
        // CLAIM DISCIPLINE: first-attempt success is instrumented but unpublished.
        // No percentage until we can publish cohort, task definition, window, and
        // sample size. Until then the claim is structural, not numeric.
        title: 'Reliability',
        body: 'The compiler validates every result server-side before it reaches the agent, so a request either returns something that works or fails loudly enough to correct. An agent gets a working result instead of plausible-but-broken output — which keeps it reaching for your product.',
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

/**
 * The service-partner narrative surface at /partners.
 *
 * Deliberately separate from PRICING: this is the story of who a partner is and
 * what the first step looks like, not what it costs. The page renders
 * PRICING.languageService for the Platinum terms rather than restating them, so
 * there is exactly one description of the productized service.
 *
 * The first step is a *product-specific working session* — the canonical partner
 * funnel event (marketing/graffiticode-funnel-and-omtm-contract.md). Nothing here
 * may imply a fixed-scope proposal or a scoped build; that is not what we sell.
 */
export const PARTNERS = {
  eyebrow: 'For partners',
  title: 'Your product, drivable by an agent',
  lead:
    'Your customers are starting to work through agents instead of dashboards. The product an agent can drive is the product that gets used — and the one it can’t becomes a backend it guesses at or routes around. We make yours drivable, and keep it that way.',
  qualifies: {
    heading: 'Who this is for',
    lead: 'Partnering fits an established product with something worth defending. Three traits matter more than your vertical.',
    items: [
      {
        title: 'An incumbency worth defending',
        body: 'You already have distribution, customers, and a trusted position inside other people’s platforms. That is exactly what makes an agent routing around you an existential problem rather than an academic one.',
      },
      {
        title: 'A structured product surface',
        body: 'An API, a content model, an item bank — something with real structure for an agent to drive. We do not need it to be tidy, but it has to exist.',
      },
      {
        title: 'Customers already moving to agents',
        body: 'Your authors, admins, and end users are starting to work through AI assistants. If that has not begun, the urgency is not there yet and we will say so.',
      },
    ],
  } satisfies PricingSection,
  exchange: {
    heading: 'What each side brings',
    lead: 'You are not buying a protocol. You are buying a designed, operated agent surface for your product.',
    items: [
      {
        title: 'You bring the product',
        body: 'The API or data model, the domain knowledge, the customer context, and a view of the workflows an agent should be able to drive. You keep the customer relationship throughout — your customers authenticate with your credentials and never see Artcompiler.',
      },
      {
        title: 'We bring the language',
        body: 'We design, operate, and keep revising the Graffiticode language and skills that make your product agent-drivable — intent-shaped tools rather than a one-to-one dump of your API, inside the permissions and guardrails you set.',
      },
    ],
  } satisfies PricingSection,
  /** The canonical first step. Prose only — no cards. */
  session: {
    heading: 'It starts with a working session',
    lead: 'The first step is not a proposal. It is 30 minutes against your real product: we run a live agent at a sandbox, work through the two or three jobs you most want an agent to do, and find out what it would actually take. What comes out is a language brief — what agents should be able to do inside your product, in priority order. If the answer is that this is premature for you, that is a legitimate outcome and you will hear it from us.',
  },
  path: {
    heading: 'From session to agents using it',
    lead: 'Five steps, and only the first needs a decision from you.',
    items: [
      {
        title: 'Product-specific working session',
        body: 'A live agent against your sandbox, and an honest read on what an agent could drive today.',
      },
      {
        title: 'Language brief',
        body: 'What agents should be able to do inside your product, in the order you want it. Written down, agreed, and revisable.',
      },
      {
        title: 'Engagement starts',
        body: 'The monthly engagement begins and your request queue opens. No statement of work to negotiate first.',
      },
      {
        title: 'First language live',
        body: 'Your language is deployed and callable through the MCP endpoint agents already reach.',
      },
      {
        title: 'External agents using it',
        body: 'A real agent completes a real task inside your product. That is the moment this has worked — everything before it is progress.',
      },
    ],
  } satisfies PricingSection,
  cta: {
    title: 'Ask for a working session',
    body: 'Tell us what your product does and what you would want an agent to be able to do with it. If it is a fit we will run the session against your sandbox; if it is not, we will tell you that instead.',
    primary: {
      label: 'Request a session →',
      href: 'mailto:jeff@artcompiler.com?subject=Graffiticode%20partner%20working%20session',
      external: true,
    },
    // `external: false` is explicit so the renderer can read `.external` off the
    // literal — `satisfies` preserves literal types, so an omitted optional is
    // absent from the type, not undefined.
    // ?audience=partner opens /pricing on the partner tab rather than the
    // agent default — PricingView reads it on mount.
    secondary: { label: 'What partnering costs', href: '/pricing?audience=partner', external: false },
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
