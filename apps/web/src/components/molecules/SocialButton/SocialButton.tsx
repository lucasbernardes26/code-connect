import { cn } from '../../../lib/cn'

export type SocialButtonProps = {
  iconSrc: string
  label: string
  onClick?: () => void
  iconClassName?: string
  className?: string
}

/** Social authentication provider button displaying icon and caption. */
export function SocialButton({
  iconSrc,
  label,
  onClick,
  iconClassName,
  className,
}: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex cursor-pointer flex-col items-center gap-1 rounded-lg p-1 transition hover:bg-offwhite/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        className,
      )}
    >
      <img src={iconSrc} alt="" className={cn('h-7 w-7 object-contain', iconClassName)} />
      <span className="text-xs leading-normal text-offwhite transition group-hover:text-primary">
        {label}
      </span>
    </button>
  )
}
