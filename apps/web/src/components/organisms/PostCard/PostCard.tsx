import type { PostSummary } from '../../../services/contracts'
import { Avatar } from '../../atoms/Avatar'
import { Tag } from '../../atoms/Tag'
import { PostActionStat } from '../../molecules/PostActionStat'
import { PostCover } from '../../molecules/PostCover'

export type PostCardProps = {
  post: PostSummary
  canInteract: boolean
  isLiking?: boolean
  onToggleLike: (post: PostSummary) => void
  onOpenComments: (post: PostSummary) => void
  onTagClick?: (tag: string) => void
}

/** Feed card displaying post cover, summary, tags, interaction metrics, and author. */
export function PostCard({
  post,
  canInteract,
  isLiking = false,
  onToggleLike,
  onOpenComments,
  onTagClick,
}: PostCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg bg-surface">
      <PostCover src={post.coverImageUrl} alt={post.title} size="card" />

      <div className="flex flex-1 flex-col justify-between gap-4 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="line-clamp-2 text-lg leading-normal font-semibold text-muted">
              {post.title}
            </h2>
            <p className="line-clamp-3 text-sm leading-normal text-muted">{post.summary}</p>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2.5">
              {post.tags.map((tag) => (
                <Tag
                  key={tag}
                  label={tag}
                  onClick={onTagClick ? () => onTagClick(tag) : undefined}
                />
              ))}
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-4">
            <PostActionStat
              icon="heart"
              count={post.likesCount}
              label={post.likedByMe ? 'Remover curtida' : 'Curtir post'}
              active={post.likedByMe}
              disabled={!canInteract || isLiking}
              title={!canInteract ? 'Faça login para curtir' : undefined}
              onClick={() => onToggleLike(post)}
            />
            <PostActionStat
              icon="share"
              count={post.sharesCount}
              label="Compartilhamentos"
              disabled
            />
            <PostActionStat
              icon="chat"
              count={post.commentsCount}
              label="Comentários"
              disabled={!canInteract}
              title={!canInteract ? 'Faça login para comentar' : undefined}
              onClick={() => onOpenComments(post)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Avatar src={post.author.avatarUrl} name={post.author.name} />
            <span className="text-sm leading-normal font-semibold text-field">
              {post.author.handle}
            </span>
          </div>
        </footer>
      </div>
    </article>
  )
}
