import { useState } from 'react'
import { cn } from '../../../lib/cn'
import { Icon } from '../../atoms/Icon'

export type PostCoverProps = {
  src: string | null
  alt: string
  size?: 'card' | 'detail'
  className?: string
}

/** Post thumbnail frame with automatic CodeConnect editor placeholder when image is missing or fails to load. */
export function PostCover({ src, alt, size = 'card', className }: PostCoverProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const hasValidImage = Boolean(src?.trim()) && failedSrc !== src

  return (
    <div
      className={cn(
        'flex w-full flex-col items-start rounded-t-lg bg-field p-6',
        size === 'card' ? 'h-60' : 'h-80 md:h-96',
        className,
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-lg bg-ink shadow-xl">
        {hasValidImage ? (
          <img
            src={src ?? undefined}
            alt={alt}
            onError={() => setFailedSrc(src)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            role="img"
            aria-label={`Prévia indisponível para ${alt}`}
            className="flex h-full w-full flex-col justify-between bg-ink p-4 text-muted"
          >
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-danger" />
              <span className="size-2.5 rounded-full bg-primary" />
              <span className="size-2.5 rounded-full bg-field" />
            </div>
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <Icon name="code" className="h-8 w-8 text-primary" />
              <span className="text-xs font-medium text-muted">Prévia indisponível</span>
            </div>
            <div className="h-2 w-2/3 rounded bg-surface" />
          </div>
        )}
      </div>
    </div>
  )
}
