import { cn } from '../../../lib/cn'
import { Input, type InputProps } from '../../atoms/Input'
import { Label } from '../../atoms/Label'

export type FormFieldProps = Omit<InputProps, 'id' | 'invalid'> & {
  id: string
  label: string
  error?: string
  containerClassName?: string
}

/** Combines a Label, Input, and optional validation error message. */
export function FormField({
  id,
  label,
  error,
  containerClassName,
  className,
  ...inputProps
}: FormFieldProps) {
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={cn('flex flex-col gap-2', containerClassName)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        invalid={Boolean(error)}
        aria-describedby={errorId}
        className={className}
        {...inputProps}
      />
      {error && (
        <p id={errorId} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
