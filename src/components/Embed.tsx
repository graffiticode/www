import Link from 'next/link'

import { viewUrl } from '@data/contract'

/**
 * A live, interactive Graffiticode item — real proof, not a screenshot.
 * Renders the hosted item in an iframe. When no showcase id is set yet, shows a
 * labelled placeholder so the page is honest about what's wired vs pending.
 */
export function Embed({
  itemId,
  title,
  className,
  height = 420,
}: {
  itemId: string | null
  title: string
  className?: string
  height?: number
}) {
  if (!itemId) {
    return (
      <div
        className={
          'flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-zinc-900/50 text-center text-sm text-zinc-500 ' +
          (className ?? '')
        }
        style={{ minHeight: height }}
      >
        <span>Live example coming online</span>
        <span className="text-xs">{title}</span>
      </div>
    )
  }

  return (
    <figure className={'overflow-hidden rounded-xl border border-white/10 bg-white ' + (className ?? '')}>
      <iframe
        src={viewUrl(itemId)}
        title={title}
        loading="lazy"
        className="w-full"
        style={{ height }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
      <figcaption className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-600">
        <span>{title}</span>
        <Link href={viewUrl(itemId)} target="_blank" className="font-medium text-emerald-700 hover:underline">
          Open ↗
        </Link>
      </figcaption>
    </figure>
  )
}
