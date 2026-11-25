import type { ReactNode } from 'react'
import { BrandLogo } from '../../atoms/BrandLogo'
import { DecorativeLogo } from '../../atoms/DecorativeLogo'

export type AuthTemplateProps = {
  bannerSrc: string
  bannerAlt: string
  showBrandLogo?: boolean
  children: ReactNode
}

/** Shared two-column authentication card layout with decorative background marks. */
export function AuthTemplate({
  bannerSrc,
  bannerAlt,
  showBrandLogo = false,
  children,
}: AuthTemplateProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink p-6">
      <DecorativeLogo className="absolute -top-2 left-36" />
      <DecorativeLogo className="absolute right-36 bottom-0" />

      <section className="relative z-10 flex w-full max-w-5xl flex-col justify-between gap-10 rounded-4xl border border-ink bg-surface p-8 md:flex-row md:items-stretch md:px-20 md:py-14">
        <div className="relative hidden shrink-0 self-stretch md:flex md:w-102 md:items-center md:justify-center">
          <img src={bannerSrc} alt={bannerAlt} className="h-full w-full object-cover" />
          {showBrandLogo && (
            <BrandLogo className="absolute bottom-9 left-1/2 -translate-x-1/2" />
          )}
        </div>
        <div className="flex w-full flex-col justify-center md:w-102 md:px-8">{children}</div>
      </section>
    </main>
  )
}
