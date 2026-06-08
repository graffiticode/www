import Link from 'next/link'

import { viewUrl } from '@data/contract'

/**
 * A live, interactive Graffiticode item — real proof, not a screenshot.
 * Renders the hosted item in an iframe at a landscape aspect ratio (most items
 * are wider than 1:1). When no showcase id is set yet, shows a labelled
 * placeholder so the page is honest about what's wired vs pending.
 */
export function Embed({
  itemId,
  title,
  className,
  ratio = '3 / 2',
  scale = 1,
}: {
  itemId: string | null
  title: string
  className?: string
  /** CSS aspect-ratio for the frame, e.g. '3 / 2' (default) or '16 / 9'. */
  ratio?: string
  /** Zoom the embedded content, e.g. 0.75 to render the form at 75%. */
  scale?: number
}) {
  if (!itemId) {
    return (
      <div
        className={
          'flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-zinc-900/50 text-center text-sm text-sand-500 ' +
          (className ?? '')
        }
        style={{ aspectRatio: ratio }}
      >
        <span>Live example coming online</span>
        <span className="text-xs">{title}</span>
      </div>
    )
  }

  return (
    <figure className={'overflow-hidden rounded-xl border border-white/10 bg-white ' + (className ?? '')}>
      <div style={{ aspectRatio: ratio }} className="w-full overflow-hidden">
        <iframe
          src={viewUrl(itemId)}
          title={title}
          loading="lazy"
          className="h-full w-full"
          style={
            scale !== 1
              ? {
                  width: `${100 / scale}%`,
                  height: `${100 / scale}%`,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                }
              : undefined
          }
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
      <figcaption className="flex items-center justify-between border-t border-brand-cream bg-brand-cream/60 px-3 py-1.5 text-xs text-brand-maroon">
        <span>{title}</span>
        <Link href={viewUrl(itemId)} target="_blank" className="font-medium text-brand-deep hover:underline">
          Open ↗
        </Link>
      </figcaption>
    </figure>
  )
}
