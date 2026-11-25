import { cn } from '../../../lib/cn'

export type DecorativeLogoProps = {
  className?: string
}

/** Decorative Code Connect chain-link mark for page backgrounds. */
export function DecorativeLogo({ className }: DecorativeLogoProps) {
  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      stroke="currentColor"
      strokeWidth={26}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('h-auto w-56 select-none', className)}
    >
      <rect x="28" y="64" width="84" height="122" rx="42" />
      <rect x="108" y="34" width="84" height="122" rx="42" />
    </svg>
  )
}
