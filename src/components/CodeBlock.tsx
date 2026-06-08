'use client'

import { useState } from 'react'
import clsx from 'clsx'

import { track } from '@/lib/analytics'

export function CodeBlock({
  code,
  language = 'json',
  label,
  className,
}: {
  code: string
  language?: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      track('copy_config', { label: label ?? language })
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className={clsx('group relative overflow-hidden rounded-lg border border-white/10 bg-zinc-900', className)}>
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="font-mono text-xs text-sand-500">{label ?? language}</span>
        <button
          onClick={copy}
          className="rounded px-2 py-0.5 text-xs text-sand-400 transition hover:bg-white/5 hover:text-white"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-sand-100">{code}</code>
      </pre>
    </div>
  )
}
