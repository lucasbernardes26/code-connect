import { useState } from 'react'
import { cn } from '../../../lib/cn'

export type AvatarProps = {
  src?: string | null
  name: string
  className?: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'CC'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

/** Circular user avatar with automatic initials fallback when image is missing or fails to load. */
export function Avatar({ src, name, className }: AvatarProps) {
  const [hasError, setHasError] = useState(false)
  const showImage = Boolean(src) && !hasError

  if (showImage) {
    return (
      <img
        src={src ?? undefined}
        alt={`Avatar de ${name}`}
        onError={() => setHasError(true)}
        className={cn('size-8 shrink-0 rounded-full object-cover', className)}
      />
    )
  }

  return (
    <span
      role="img"
      aria-label={`Avatar de ${name}`}
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-deco text-xs font-semibold text-primary',
        className,
      )}
    >
      {getInitials(name)}
    </span>
  )
}
