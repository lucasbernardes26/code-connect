import { cn } from '../../../lib/cn'

export type BrandLogoProps = {
  className?: string
}

/** Code Connect brand mark composed of chain-link symbol and wordmark. */
export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <div
      role="img"
      aria-label="Code Connect"
      className={cn('relative h-10 w-32 shrink-0 overflow-clip', className)}
    >
      <div className="absolute inset-[35.48%_88.04%_6.09%_0]">
        <img alt="" className="block size-full max-w-none" src="/logo/logo-mark-a.svg" />
      </div>
      <div className="absolute inset-[15.11%_78.6%_26.47%_9.43%]">
        <img alt="" className="block size-full max-w-none" src="/logo/logo-mark-b.svg" />
      </div>
      <div className="absolute inset-[0_0_0_26.88%]">
        <img alt="" className="block size-full max-w-none" src="/logo/logo-text.svg" />
      </div>
    </div>
  )
}
