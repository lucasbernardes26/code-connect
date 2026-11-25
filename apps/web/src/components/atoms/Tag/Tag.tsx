import { cn } from '../../../lib/cn'
import { Icon } from '../Icon'

export type TagProps = {
  label: string
  active?: boolean
  removable?: boolean
  onClick?: () => void
  className?: string
}

/** Technology or category pill used in search filters and post cards. */
export function Tag({
  label,
  active = false,
  removable = false,
  onClick,
  className,
}: TagProps) {
  const baseClass = cn(
    'inline-flex items-center gap-2 rounded px-2 py-1 text-sm leading-normal transition',
    active ? 'bg-field text-surface font-medium' : 'bg-muted text-surface',
    onClick &&
      'cursor-pointer hover:bg-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    className,
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={baseClass}
      >
        <span>{label}</span>
        {removable && active && <Icon name="close" className="h-3.5 w-3.5" />}
      </button>
    )
  }

  return <span className={baseClass}>{label}</span>
}
