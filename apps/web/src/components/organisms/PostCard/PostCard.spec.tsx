import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { PostSummary } from '../../../services/contracts'
import { PostCard } from './PostCard'

const samplePost: PostSummary = {
  id: 'post-1',
  slug: 'design-system',
  title: 'Design System com React',
  summary: 'Tokens semânticos e Atomic Design.',
  coverImageUrl: null,
  tags: ['React', 'Front-end'],
  likesCount: 8,
  commentsCount: 2,
  sharesCount: 5,
  likedByMe: false,
  createdAt: '2026-11-25T10:00:00.000Z',
  author: {
    id: 'user-1',
    name: 'Júlio Oliveira',
    handle: '@julio',
    avatarUrl: null,
  },
}

describe('PostCard', () => {
  it('disables like and comment buttons when visitor is unauthenticated', () => {
    render(
      <PostCard
        post={samplePost}
        canInteract={false}
        onToggleLike={vi.fn()}
        onOpenComments={vi.fn()}
      />,
    )

    expect(screen.getByText('Design System com React')).toBeInTheDocument()
    expect(screen.getByText('Prévia indisponível')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Curtir post: 8' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Comentários: 2' })).toBeDisabled()
  })

  it('triggers like and comment handlers when user is authenticated', async () => {
    const user = userEvent.setup()
    const onToggleLike = vi.fn()
    const onOpenComments = vi.fn()

    render(
      <PostCard
        post={samplePost}
        canInteract
        onToggleLike={onToggleLike}
        onOpenComments={onOpenComments}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Curtir post: 8' }))
    expect(onToggleLike).toHaveBeenCalledWith(samplePost)

    await user.click(screen.getByRole('button', { name: 'Comentários: 2' }))
    expect(onOpenComments).toHaveBeenCalledWith(samplePost)
  })
})
