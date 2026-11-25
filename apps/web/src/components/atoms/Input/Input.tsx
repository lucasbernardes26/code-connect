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
        'w-full rounded bg-field px-4 py-2 text-sm leading-normal text-ink placeholder:text-surface outline-none transition focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
        invalid && 'ring-2 ring-danger focus:ring-danger',
        className,
      )}
      {...rest}
    />
  )
}
