import { cn } from '../../../lib/cn'

export type IconName =
  | 'arrow-right'
  | 'clipboard'
  | 'check'
  | 'login'
  | 'logout'
  | 'feed'
  | 'account'
  | 'info'
  | 'search'
  | 'close'
  | 'heart'
  | 'code'
  | 'share'
  | 'chat'

export type IconProps = {
  name: IconName
  filled?: boolean
  className?: string
}

/** Inline SVG icon set for UI controls. */
export function Icon({ name, filled = false, className }: IconProps) {
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
    case 'logout':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          data-icon={name}
          className={cn('h-6 w-6', shared)}
        >
          <path d="m17 7-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
        </svg>
      )
    case 'feed':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          data-icon={name}
          className={cn('h-6 w-6', shared)}
        >
          <path d="M16 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8l-5-5zm-1 14H7v-2h8v2zm2-4H7v-2h10v2zm-2-4H7V7h8v2z" />
        </svg>
      )
    case 'account':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          data-icon={name}
          className={cn('h-6 w-6', shared)}
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.95 9.95 0 0 1 12.28 0C16.43 19.18 14.03 20 12 20z" />
        </svg>
      )
    case 'info':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          data-icon={name}
          className={cn('h-6 w-6', shared)}
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      )
    case 'search':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          data-icon={name}
          className={cn('h-6 w-6', shared)}
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      )
    case 'close':
      return (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden="true"
          data-icon={name}
          className={cn('h-4 w-4', shared)}
        >
          <path d="M5 5l10 10" />
          <path d="M15 5 5 15" />
        </svg>
      )
    case 'heart':
      return (
        <svg
          viewBox="0 0 24 24"
          fill={filled ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          data-icon={name}
          className={cn('h-5 w-5', shared)}
        >
          <path d="M19.5 12.572 12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.566Z" />
        </svg>
      )
    case 'code':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          data-icon={name}
          className={cn('h-5 w-5', shared)}
        >
          <path d="m8 17-5-5 5-5" />
          <path d="m16 7 5 5-5 5" />
        </svg>
      )
    case 'share':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          data-icon={name}
          className={cn('h-5 w-5', shared)}
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.59 13.51 6.83 3.98" />
          <path d="m15.41 6.51-6.82 3.98" />
        </svg>
      )
    case 'chat':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          data-icon={name}
          className={cn('h-5 w-5', shared)}
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 11H7v-2h10v2zm0-3H7V8h10v2z" />
        </svg>
      )
  }
}
