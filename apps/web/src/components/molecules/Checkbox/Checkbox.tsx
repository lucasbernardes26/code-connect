import type { InputHTMLAttributes } from 'react'
import { cn } from '../../../lib/cn'
import { Icon } from '../../atoms/Icon'

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> & {
  id: string
  label: string
}

/** Accessible checkbox control with custom styling. */
export function Checkbox({ id, label, checked, className, ...rest }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn('inline-flex cursor-pointer items-center gap-2 text-xs text-muted select-none', className)}
    >
      <span className="relative inline-flex h-4 w-4 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          className="peer sr-only"
          {...rest}
        />
        <span className="flex h-4 w-4 items-center justify-center rounded border border-muted/70 bg-transparent transition peer-checked:border-offwhite peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
          {checked && <Icon name="check" className="text-offwhite" />}
        </span>
      </span>
      <span>{label}</span>
    </label>
  )
}
