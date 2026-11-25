import { cn } from '../../../lib/cn'

export type DividerProps = {
  label?: string
  className?: string
}

/** Horizontal separator with an optional centered text label. */
export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return <div role="separator" className={cn('h-px w-full bg-muted/40', className)} />
  }

  return (
    <div role="separator" aria-label={label} className={cn('flex items-center gap-3', className)}>
      <span className="h-px flex-1 bg-muted/40" />
      <span className="text-xs text-muted">{label}</span>
      <span className="h-px flex-1 bg-muted/40" />
    </div>
  )
}
