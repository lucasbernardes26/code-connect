import type { ReactNode } from 'react'

export type AppShellTemplateProps = {
  sidebar: ReactNode
  children: ReactNode
}

/** Shared two-column application layout reused across Feed, Post Details, and Profile screens. */
export function AppShellTemplate({ sidebar, children }: AppShellTemplateProps) {
  return (
    <div className="min-h-screen bg-ink text-offwhite">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-8 pb-28 lg:flex-row lg:items-start lg:gap-7 lg:px-6 lg:py-14">
        {sidebar}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
