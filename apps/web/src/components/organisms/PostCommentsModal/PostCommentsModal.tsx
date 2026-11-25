import { useEffect, useState, type FormEvent } from 'react'
import { extractApiErrorMessage } from '../../../services/api'
import type { PostComment, PostSummary } from '../../../services/contracts'
import { postsService } from '../../../services/posts.service'
import { Avatar } from '../../atoms/Avatar'
import { Button } from '../../atoms/Button'
import { Icon } from '../../atoms/Icon'
import { FeedbackBanner } from '../../molecules/FeedbackBanner'

export type PostCommentsModalProps = {
  post: PostSummary
  onClose: () => void
  onCommentCreated: (postId: string) => void
}

/** Accessible modal for viewing and publishing comments on a post. */
export function PostCommentsModal({
  post,
  onClose,
  onCommentCreated,
}: PostCommentsModalProps) {
  const [comments, setComments] = useState<PostComment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    let active = true

    postsService
      .listComments(post.id)
      .then((data) => {
        if (active) {
          setComments(data)
          setErrorMessage(undefined)
        }
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(
            extractApiErrorMessage(error, 'Não foi possível carregar os comentários.'),
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
  }, [post.id])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = body.trim()
    if (!trimmed) return

    setIsSubmitting(true)
    setErrorMessage(undefined)

    try {
      const created = await postsService.createComment(post.id, { body: trimmed })
      setComments((prev) => [...prev, created])
      setBody('')
      onCommentCreated(post.id)
    } catch (error) {
      setErrorMessage(extractApiErrorMessage(error, 'Não foi possível enviar seu comentário.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="comments-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
    >
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col gap-6 rounded-2xl border border-deco bg-surface p-6">
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 id="comments-modal-title" className="text-xl font-semibold text-offwhite">
              Comentários
            </h2>
            <p className="text-sm text-muted">{post.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar comentários"
            className="cursor-pointer rounded p-1.5 text-muted transition hover:bg-deco hover:text-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </header>

        {errorMessage && <FeedbackBanner variant="error" message={errorMessage} />}

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-1">
          {isLoading ? (
            <p role="status" className="text-sm text-muted">
              Carregando comentários...
            </p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-muted">
              Nenhum comentário ainda. Seja a primeira pessoa a comentar!
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-deco">
              {comments.map((comment) => (
                <li key={comment.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <Avatar src={comment.author.avatarUrl} name={comment.author.name} />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-offwhite">
                      {comment.author.handle}
                    </span>
                    <p className="text-sm leading-relaxed text-muted">{comment.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 border-t border-deco pt-4">
          <label htmlFor="new-comment-input" className="text-sm font-medium text-offwhite">
            Adicionar comentário
          </label>
          <textarea
            id="new-comment-input"
            rows={3}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Escreva seu comentário sobre este projeto..."
            maxLength={1000}
            required
            className="w-full rounded bg-field px-4 py-2 text-sm text-ink placeholder:text-surface outline-none transition focus:ring-2 focus:ring-primary"
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Fechar
            </Button>
            <Button type="submit" disabled={isSubmitting || !body.trim()}>
              {isSubmitting ? 'Enviando...' : 'Comentar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
