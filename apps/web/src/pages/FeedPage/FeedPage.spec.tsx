import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthContext, type AuthContextValue } from '../../contexts/AuthContext'
import type { PostSummary } from '../../services/contracts'
import { postsService } from '../../services/posts.service'
import { FeedPage } from './FeedPage'

const mockPosts: PostSummary[] = [
  {
    id: 'post-1',
    slug: 'design-system',
    title: 'Design System com React',
    summary: 'Tokens semânticos e Atomic Design.',
    coverImageUrl: '/posts/cover-1.png',
    tags: ['React', 'Front-end'],
    likesCount: 4,
    commentsCount: 1,
    sharesCount: 2,
    likedByMe: false,
    createdAt: '2026-11-25T10:00:00.000Z',
    author: { id: 'u1', name: 'Júlio', handle: '@julio', avatarUrl: '/avatars/julio.png' },
  },
]

function renderFeed(isAuthenticated: boolean) {
  const value: AuthContextValue = {
    user: isAuthenticated
      ? {
          id: 'u2',
          name: 'Márcia',
          email: 'marcia@codeconnect.dev',
          createdAt: '2026-11-25T00:00:00.000Z',
        }
      : null,
    isAuthenticated,
    isInitializing: false,
    login: vi.fn(),
    logout: vi.fn(),
  }

  return render(
    <AuthContext.Provider value={value}>
      <FeedPage />
    </AuthContext.Provider>,
  )
}

describe('FeedPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('allows unauthenticated users to view and search posts while disabling likes and comments', async () => {
    const user = userEvent.setup()
    const listSpy = vi
      .spyOn(postsService, 'listPosts')
      .mockResolvedValue({
        items: mockPosts,
        meta: { page: 1, limit: 12, total: 1, totalPages: 1 },
      })

    renderFeed(false)

    expect(await screen.findByText('Design System com React')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Curtir post: 4' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Comentários: 1' })).toBeDisabled()

    await user.type(screen.getByPlaceholderText('Digite o que você procura'), 'acessibilidade{enter}')

    await waitFor(() => {
      expect(listSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ q: 'acessibilidade' }),
      )
    })
  })

  it('allows authenticated users to like posts and switch sort tabs', async () => {
    const user = userEvent.setup()
    const listSpy = vi
      .spyOn(postsService, 'listPosts')
      .mockResolvedValue({
        items: mockPosts,
        meta: { page: 1, limit: 12, total: 1, totalPages: 1 },
      })
    const likeSpy = vi
      .spyOn(postsService, 'likePost')
      .mockResolvedValue({ likesCount: 5, likedByMe: true })

    renderFeed(true)

    const likeButton = await screen.findByRole('button', { name: 'Curtir post: 4' })
    expect(likeButton).toBeEnabled()

    await user.click(likeButton)
    expect(likeSpy).toHaveBeenCalledWith('post-1')
    expect(await screen.findByRole('button', { name: 'Remover curtida: 5' })).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Populares' }))
    await waitFor(() => {
      expect(listSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ sort: 'popular' }),
      )
    })
  })
})
