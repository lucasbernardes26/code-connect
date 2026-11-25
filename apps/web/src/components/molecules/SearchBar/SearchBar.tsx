import type { FormEvent } from 'react'
import { cn } from '../../../lib/cn'
import { Icon } from '../../atoms/Icon'
import { Tag } from '../../atoms/Tag'

export type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  tags: string[]
  selectedTag: string | null
  onToggleTag: (tag: string) => void
  onClearAll: () => void
  className?: string
}

/** Full-text search bar with quick tag filters and clear-all action. */
export function SearchBar({
  value,
  onChange,
  onSubmit,
  tags,
  selectedTag,
  onToggleTag,
  onClearAll,
  className,
}: SearchBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit?.()
  }

  const hasFilters = Boolean(value.trim() || selectedTag)

  return (
    <section aria-label="Busca de publicações" className={cn('flex w-full flex-col gap-4', className)}>
      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex w-full items-center gap-4 rounded bg-surface px-4 py-2.5 text-muted focus-within:ring-2 focus-within:ring-primary"
      >
        <Icon name="search" className="h-7 w-7 text-muted" />
        <label htmlFor="feed-search-input" className="sr-only">
          Pesquisar publicações
        </label>
        <input
          id="feed-search-input"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Digite o que você procura"
          className="w-full bg-transparent text-lg leading-normal text-offwhite placeholder:text-muted outline-none"
        />
      </form>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 md:gap-6">
          {tags.map((tag) => {
            const isSelected = selectedTag?.toLowerCase() === tag.toLowerCase()
            return (
              <Tag
                key={tag}
                label={tag}
                active={isSelected}
                removable={isSelected}
                onClick={() => onToggleTag(tag)}
              />
            )
          })}
        </div>

        <button
          type="button"
          onClick={onClearAll}
          disabled={!hasFilters}
          className="cursor-pointer text-base leading-normal text-field transition hover:text-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default disabled:opacity-60"
        >
          Limpar tudo
        </button>
      </div>
    </section>
  )
}
