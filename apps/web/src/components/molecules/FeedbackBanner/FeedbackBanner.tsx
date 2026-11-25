import { cn } from '../../../lib/cn'

export type FeedbackBannerProps = {
  variant: 'error' | 'success'
  message: string
  className?: string
}

const variantClasses = {
  error: 'border-danger bg-ink text-danger',
  success: 'border-primary bg-deco text-primary',
} as const

/** Accessible inline banner for API error and success feedback messages. */
export function FeedbackBanner({ variant, message, className }: FeedbackBannerProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      className={cn(
        'rounded-lg border px-4 py-3 text-sm leading-relaxed font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {message}
    </div>
  )
}
