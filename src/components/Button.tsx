import Link from 'next/link'
import clsx from 'clsx'

const styles = {
  primary: 'bg-brand-deep text-white hover:bg-[#dd6fc7]',
  secondary: 'border border-white/15 text-sand-100 hover:bg-white/5',
}

export function Button({
  href,
  variant = 'primary',
  className,
  children,
  external,
}: {
  href: string
  variant?: keyof typeof styles
  className?: string
  children: React.ReactNode
  external?: boolean
}) {
  const cls = clsx(
    'inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition',
    styles[variant],
    className,
  )
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}
