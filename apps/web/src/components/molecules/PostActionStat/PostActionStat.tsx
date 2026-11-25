import { cn } from '../../../lib/cn'
import { Icon, type IconName } from '../../atoms/Icon'

export type PostActionStatProps = {
  icon: IconName
  count: number
  label: string
  active?: boolean
  disabled?: boolean
  title?: string
  onClick?: () => void
}

/** Interactive metric button (like, share, comment) displayed in post cards and detail headers. */
export function PostActionStat({
  icon,
  count,
  label,
  active = false,
  disabled = false,
  title,
  onClick,
}: PostActionStatProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={`${label}: ${count}`}
      aria-pressed={active || undefined}
      className={cn(
        'inline-flex flex-col items-center justify-center gap-1 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        active ? 'text-primary' : 'text-field',
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-pointer hover:text-offwhite',
      )}
    >
      <Icon name={icon} filled={active} className="h-6 w-6" />
      <span className="text-sm leading-normal">{count}</span>
    </button>
  )
}
