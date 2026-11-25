import { cn } from '../../../lib/cn'

export type IconName = 'arrow-right' | 'clipboard' | 'check' | 'login'

export type IconProps = {
  name: IconName
  className?: string
}

/** Inline SVG icon set for UI controls. */
export function Icon({ name, className }: IconProps) {
  const shared = cn('inline-block shrink-0', className)

  switch (name) {
    case 'arrow-right':
      return (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          data-icon={name}
          className={cn('h-4 w-4', shared)}
        >
          <path d="M4 10h12" />
          <path d="m11 5 5 5-5 5" />
        </svg>
      )
    case 'clipboard':
      return (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          data-icon={name}
          className={cn('h-4 w-4', shared)}
        >
          <rect x="4" y="3" width="12" height="14" rx="2" />
          <path d="M7.5 2.5h5v2h-5z" />
          <path d="M7.5 8.5h5" />
          <path d="M7.5 11.5h5" />
          <path d="M7.5 14.5h3" />
        </svg>
      )
    case 'check':
      return (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          data-icon={name}
          className={cn('h-3.5 w-3.5', shared)}
        >
          <path d="m3.5 8.5 3 3 6-6.5" />
        </svg>
      )
    case 'login':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          data-icon={name}
          className={cn('h-6 w-6', shared)}
        >
          <path d="M11 7 9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
        </svg>
      )
  }
}
