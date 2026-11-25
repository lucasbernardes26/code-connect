import type { ReactNode } from 'react'
import { DecorativeLogo } from '../../atoms/DecorativeLogo'

export type AuthTemplateProps = {
  bannerSrc: string
  bannerAlt: string
  children: ReactNode
}

/** Shared two-column authentication card layout with decorative background marks. */
export function AuthTemplate({ bannerSrc, bannerAlt, children }: AuthTemplateProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink p-6">
      <DecorativeLogo className="pointer-events-none absolute -top-10 left-12 w-56 text-deco" />
      <DecorativeLogo className="pointer-events-none absolute -bottom-12 right-12 w-56 text-deco" />

      <section className="relative z-10 flex w-full max-w-4xl flex-col gap-10 rounded-3xl bg-surface p-8 md:flex-row md:p-10">
        <img
          src={bannerSrc}
          alt={bannerAlt}
          className="hidden w-full max-w-xs rounded object-cover md:block"
        />
        <div className="flex flex-1 flex-col justify-center">{children}</div>
      </section>
    </main>
  )
}
