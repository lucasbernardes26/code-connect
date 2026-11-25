import type { InputHTMLAttributes } from 'react'
import { cn } from '../../../lib/cn'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
}

/** Styled text input with validation state support. */
export function Input({ invalid = false, className, ...rest }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        'w-full rounded-md bg-field px-3 py-2 text-sm text-ink placeholder:text-ink/60 outline-none transition focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
        invalid && 'ring-2 ring-red-400 focus:ring-red-400',
        className,
      )}
      {...rest}
    />
  )
}
