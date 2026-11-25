import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../lib/cn'

const variants = {
  primary: 'bg-primary text-ink hover:brightness-110',
  ghost: 'bg-transparent text-offwhite hover:text-primary',
} as const

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  fullWidth?: boolean
  icon?: ReactNode
}

/** Primary action button with optional trailing icon and variant styling. */
export function Button({
  variant = 'primary',
  fullWidth = false,
  icon,
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {children}
      {icon}
    </button>
  )
}
