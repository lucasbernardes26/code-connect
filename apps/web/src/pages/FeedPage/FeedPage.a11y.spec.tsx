import { render, screen } from '@testing-library/react'
import { beforeEach, describe, it, vi } from 'vitest'
import { AuthContext, type AuthContextValue } from '../../contexts/AuthContext'
import { postsService } from '../../services/posts.service'
import { expectNoWcagViolations } from '../../test/a11y'
import { FeedPage } from './FeedPage'

describe('FeedPage (WCAG AA)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('has no accessibility violations', async () => {
    vi.spyOn(postsService, 'listPosts').mockResolvedValueOnce({
      items: [
        {
          id: 'post-1',
          slug: 'design-system',
          title: 'Design System com React',
          summary: 'Tokens semânticos e Atomic Design.',
          coverImageUrl: null,
          tags: ['React', 'Front-end'],
          likesCount: 4,
          commentsCount: 1,
          sharesCount: 2,
          likedByMe: false,
          createdAt: '2026-11-25T10:00:00.000Z',
          author: { id: 'u1', name: 'Júlio', handle: '@julio', avatarUrl: null },
        },
      ],
      meta: { page: 1, limit: 12, total: 1, totalPages: 1 },
    })

    const value: AuthContextValue = {
      user: null,
      isAuthenticated: false,
      isInitializing: false,
      login: vi.fn(),
      logout: vi.fn(),
    }

    const { container } = render(
      <AuthContext.Provider value={value}>
        <FeedPage />
      </AuthContext.Provider>,
    )

    await screen.findByText('Design System com React')
    await expectNoWcagViolations(container)
  })
})
