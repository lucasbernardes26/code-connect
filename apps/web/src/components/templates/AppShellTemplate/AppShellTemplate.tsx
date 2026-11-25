import type { ReactNode } from 'react'
import { BrandLogo } from '../../atoms/BrandLogo'

export type AppShellTemplateProps = {
  children: ReactNode
}

/** Main layout template for authenticated application screens. */
export function AppShellTemplate({ children }: AppShellTemplateProps) {
  return (
    <div className="min-h-screen bg-ink text-offwhite">
      <header className="border-b border-deco bg-surface">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <BrandLogo />
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-6 py-10">{children}</main>
    </div>
  )
}
