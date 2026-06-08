'use client'

import { useRef } from 'react'

import { CodeBlock } from '@/components/CodeBlock'
import { track } from '@/lib/analytics'

/**
 * A text-link trigger that opens a modal showing the exact create_item call
 * that produced the embedded artifact. Uses the native <dialog> element
 * (Escape-to-close, backdrop) — no dependencies.
 */
export function PromptDialog({
  language,
  prompt,
  label = 'Show the prompt',
}: {
  language: string
  prompt: string
  label?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)

  const call = `create_item({
  language: "${language}",
  description: "${prompt}"
})`

  function open() {
    track('show_prompt', { language })
    ref.current?.showModal()
  }

  return (
    <>
      <button type="button" onClick={open} className="font-medium text-brand-clay hover:underline">
        {label}
      </button>

      <dialog
        ref={ref}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close()
        }}
        className="m-auto w-[min(92vw,40rem)] rounded-xl border border-white/10 bg-zinc-900 p-0 text-sand-100 backdrop:bg-black/70"
      >
        <div className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-sand-50">One call made the artifact</h2>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="rounded p-1 text-sand-400 transition hover:bg-white/5 hover:text-sand-50"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <CodeBlock label="create_item" language="javascript" code={call} />
          <p className="mt-3 text-xs text-sand-400">
            No credential required — call the MCP server with this and open the returned{' '}
            <code className="font-mono">view_url</code>.
          </p>
        </div>
      </dialog>
    </>
  )
}
