import { useEffect, useState } from 'react'
import { FeedbackBanner } from '../../components/molecules/FeedbackBanner'
import { FeedTabs } from '../../components/molecules/FeedTabs'
import { SearchBar } from '../../components/molecules/SearchBar'
import { PostCard } from '../../components/organisms/PostCard'
import { PostCommentsModal } from '../../components/organisms/PostCommentsModal'
import { useAuth } from '../../hooks/useAuth'
import { extractApiErrorMessage } from '../../services/api'
import type { PostSortOption, PostSummary } from '../../services/contracts'
import { postsService } from '../../services/posts.service'

const QUICK_TAGS = ['Front-end', 'React', 'Acessibilidade', 'TypeScript', 'NestJS']

/** Public posts feed page with backend Full-Text Search, tag filters, sorting, likes, and comments. */
export function FeedPage() {
  const { isAuthenticated } = useAuth()

  const [searchInput, setSearchInput] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [sort, setSort] = useState<PostSortOption>('recent')

  const [posts, setPosts] = useState<PostSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [likingPostIds, setLikingPostIds] = useState<Record<string, boolean>>({})
  const [activeCommentPost, setActiveCommentPost] = useState<PostSummary | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(searchInput.trim())
    }, 300)

    return () => window.clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    let active = true

    postsService
      .listPosts({
        q: debouncedQuery || undefined,
        tag: selectedTag ?? undefined,
        sort,
        page: 1,
        limit: 12,
      })
      .then((response) => {
        if (active) {
          setPosts(response.items)
          setErrorMessage(undefined)
        }
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(
            extractApiErrorMessage(error, 'Não foi possível carregar as publicações.'),
          )
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [debouncedQuery, selectedTag, sort])

  function handleSearchSubmit() {
    setDebouncedQuery(searchInput.trim())
  }

  function handleToggleTag(tag: string) {
    setSelectedTag((current) =>
      current?.toLowerCase() === tag.toLowerCase() ? null : tag,
    )
  }

  function handleClearAll() {
    setSearchInput('')
    setDebouncedQuery('')
    setSelectedTag(null)
  }

  async function handleToggleLike(post: PostSummary) {
    if (!isAuthenticated || likingPostIds[post.id]) return

    setLikingPostIds((prev) => ({ ...prev, [post.id]: true }))
    setErrorMessage(undefined)

    try {
      const status = post.likedByMe
        ? await postsService.unlikePost(post.id)
        : await postsService.likePost(post.id)

      setPosts((prev) =>
        prev.map((item) =>
          item.id === post.id
            ? { ...item, likesCount: status.likesCount, likedByMe: status.likedByMe }
            : item,
        ),
      )
    } catch (error) {
      setErrorMessage(extractApiErrorMessage(error, 'Não foi possível atualizar sua curtida.'))
    } finally {
      setLikingPostIds((prev) => ({ ...prev, [post.id]: false }))
    }
  }

  function handleCommentCreated(postId: string) {
    setPosts((prev) =>
      prev.map((item) =>
        item.id === postId ? { ...item, commentsCount: item.commentsCount + 1 } : item,
      ),
    )
  }

  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      <h1 className="sr-only">Feed de publicações do Code Connect</h1>

      <SearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSubmit={handleSearchSubmit}
        tags={QUICK_TAGS}
        selectedTag={selectedTag}
        onToggleTag={handleToggleTag}
        onClearAll={handleClearAll}
      />

      <section aria-label="Lista de publicações" className="flex flex-col gap-8">
        <FeedTabs activeTab={sort} onChange={setSort} />

        {errorMessage && <FeedbackBanner variant="error" message={errorMessage} />}

        {isLoading ? (
          <div
            role="status"
            aria-live="polite"
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-lg bg-surface"
                aria-hidden="true"
              />
            ))}
            <span className="sr-only">Carregando publicações...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-deco bg-surface px-6 py-12 text-center">
            <p className="text-lg font-semibold text-offwhite">
              Nenhuma publicação encontrada
            </p>
            <p className="text-sm text-muted">
              Tente outro termo de pesquisa ou limpe os filtros aplicados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                canInteract={isAuthenticated}
                isLiking={Boolean(likingPostIds[post.id])}
                onToggleLike={handleToggleLike}
                onOpenComments={setActiveCommentPost}
                onTagClick={handleToggleTag}
              />
            ))}
          </div>
        )}
      </section>

      {activeCommentPost && isAuthenticated && (
        <PostCommentsModal
          post={activeCommentPost}
          onClose={() => setActiveCommentPost(null)}
          onCommentCreated={handleCommentCreated}
        />
      )}
    </div>
  )
}
