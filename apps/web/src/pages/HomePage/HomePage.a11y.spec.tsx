import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, vi } from 'vitest'
import { AuthContext, type AuthContextValue } from '../../contexts/AuthContext'
import { expectNoWcagViolations } from '../../test/a11y'
import { HomePage } from './HomePage'

describe('HomePage (WCAG AA)', () => {
  it('has no WCAG AA violations when rendering authenticated profile', async () => {
    const contextValue: AuthContextValue = {
      user: {
        id: 'user-1',
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        createdAt: '2026-11-25T03:00:00.000Z',
      },
      isAuthenticated: true,
      isInitializing: false,
      login: vi.fn(),
      logout: vi.fn(),
    }

    const { container } = render(
      <AuthContext.Provider value={contextValue}>
        <MemoryRouter
          initialEntries={[{ pathname: '/', state: { successMessage: 'Login realizado com sucesso!' } }]}
        >
          <HomePage />
        </MemoryRouter>
      </AuthContext.Provider>,
    )

    await expectNoWcagViolations(container)
  })
})
