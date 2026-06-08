/**
 * Lightweight, privacy-friendly analytics. Wraps Plausible's custom-event API
 * when the script is loaded (NEXT_PUBLIC_PLAUSIBLE_DOMAIN set); otherwise a
 * no-op. Used to measure the top of the funnel: CTA clicks, config copies.
 *
 * The deeper funnel (first call → claim) lives in the MCP server / console
 * (Phase 1 instrumentation) — out of scope for this repo.
 */
type Props = Record<string, string | number | boolean>

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Props }) => void
  }
}

export function track(event: string, props?: Props) {
  if (typeof window === 'undefined') return
  window.plausible?.(event, props ? { props } : undefined)
}
