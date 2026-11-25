import { cn } from '../../../lib/cn'

export type SocialButtonProps = {
  iconSrc: string
  label: string
  onClick?: () => void
  className?: string
}

/** Social authentication provider button displaying icon and caption. */
export function SocialButton({ iconSrc, label, onClick, className }: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex cursor-pointer flex-col items-center gap-1.5 rounded-lg p-2 transition hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        className,
      )}
    >
      <img src={iconSrc} alt="" className="h-7 w-7 object-contain" />
      <span className="text-xs text-muted transition group-hover:text-offwhite">{label}</span>
    </button>
  )
}
