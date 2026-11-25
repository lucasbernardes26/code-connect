import { cn } from '../../../lib/cn'

export type DecorativeLogoProps = {
  className?: string
}

/** Decorative Code Connect chain-link mark for page backgrounds. */
export function DecorativeLogo({ className }: DecorativeLogoProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none relative h-122 w-102 overflow-clip opacity-30 select-none',
        className,
      )}
    >
      <div className="absolute inset-[25.85%_44.09%_0_0]">
        <img alt="" className="block size-full max-w-none" src="/decorative/symbol-a.svg" />
      </div>
      <div className="absolute inset-[0_0.02%_25.85%_44.09%]">
        <img alt="" className="block size-full max-w-none" src="/decorative/symbol-b.svg" />
      </div>
    </div>
  )
}
