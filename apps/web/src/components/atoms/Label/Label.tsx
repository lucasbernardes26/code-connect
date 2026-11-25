import type { LabelHTMLAttributes } from 'react'
import { cn } from '../../../lib/cn'

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

/** Form field label. */
export function Label({ className, children, ...rest }: LabelProps) {
  return (
    <label className={cn('block text-lg leading-normal font-normal text-offwhite', className)} {...rest}>
      {children}
    </label>
  )
}
