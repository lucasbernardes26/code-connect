import { cn } from '../../../lib/cn'
import type { PostSortOption } from '../../../services/contracts'

export type FeedTabsProps = {
  activeTab: PostSortOption
  onChange: (tab: PostSortOption) => void
  className?: string
}

const TABS: Array<{ value: PostSortOption; label: string }> = [
  { value: 'recent', label: 'Recentes' },
  { value: 'popular', label: 'Populares' },
]

/** Sorting tabs for switching between recent and popular posts. */
export function FeedTabs({ activeTab, onChange, className }: FeedTabsProps) {
  return (
    <div role="tablist" aria-label="Ordenação de publicações" className={cn('flex items-center justify-center gap-6', className)}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.value
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={cn(
              'cursor-pointer px-1 text-xl leading-normal transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              isActive
                ? 'font-semibold text-primary underline underline-offset-4'
                : 'font-normal text-field hover:text-muted',
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
