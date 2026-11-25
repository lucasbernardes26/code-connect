import type { ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '../../../lib/cn'

const variants = {
  default: 'text-muted hover:text-offwhite',
  primary: 'text-primary hover:brightness-110',
} as const

export type TextLinkProps = LinkProps & {
  variant?: keyof typeof variants
  underline?: boolean
  icon?: ReactNode
}

/** Router navigation link with color variants and optional trailing icon. */
export function TextLink({
  variant = 'default',
  underline = false,
  icon,
  className,
  children,
  ...rest
}: TextLinkProps) {
  return (
    <Link
      className={cn(
        'inline-flex items-center gap-1.5 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        variants[variant],
        underline && 'underline underline-offset-4',
        className,
      )}
      {...rest}
    >
      {children}
      {icon}
    </Link>
  )
}
