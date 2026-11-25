import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PostSummary } from '../../../services/contracts'
import { postsService } from '../../../services/posts.service'
import { PostCommentsModal } from './PostCommentsModal'

const samplePost: PostSummary = {
  id: 'post-1',
  slug: 'design-system',
  title: 'Design System com React',
  summary: 'Tokens semânticos',
  coverImageUrl: null,
  tags: ['React'],
  likesCount: 4,
  commentsCount: 1,
  sharesCount: 2,
  likedByMe: false,
  createdAt: '2026-11-25T10:00:00.000Z',
  author: { id: 'u1', name: 'Júlio', handle: '@julio', avatarUrl: null },
}

describe('PostCommentsModal', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('loads comments and submits a new comment', async () => {
    const user = userEvent.setup()
    const onCommentCreated = vi.fn()

    vi.spyOn(postsService, 'listComments').mockResolvedValueOnce([
      {
        id: 'c1',
        postId: 'post-1',
        body: 'Excelente código!',
        createdAt: '2026-11-25T10:05:00.000Z',
        author: { id: 'u2', name: 'Márcia', handle: '@marcia', avatarUrl: null },
      },
    ])
    vi.spyOn(postsService, 'createComment').mockResolvedValueOnce({
      id: 'c2',
      postId: 'post-1',
      body: 'Parabéns pelo projeto!',
      createdAt: '2026-11-25T10:10:00.000Z',
      author: { id: 'u3', name: 'Ana', handle: '@ana', avatarUrl: null },
    })

    render(
      <PostCommentsModal
        post={samplePost}
        onClose={vi.fn()}
        onCommentCreated={onCommentCreated}
      />,
    )

    expect(await screen.findByText('Excelente código!')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Adicionar comentário'), 'Parabéns pelo projeto!')
    await user.click(screen.getByRole('button', { name: 'Comentar' }))

    await waitFor(() => {
      expect(screen.getByText('Parabéns pelo projeto!')).toBeInTheDocument()
    })
    expect(onCommentCreated).toHaveBeenCalledWith('post-1')
  })
})
