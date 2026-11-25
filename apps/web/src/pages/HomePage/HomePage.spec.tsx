import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext, type AuthContextValue } from '../../contexts/AuthContext'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders authenticated user profile and triggers logout', async () => {
    const user = userEvent.setup()
    const logout = vi.fn()
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
      logout,
    }

    render(
      <AuthContext.Provider value={contextValue}>
        <HomePage />
      </AuthContext.Provider>,
    )

    expect(screen.getByRole('heading', { name: 'Olá, Ada Lovelace' })).toBeInTheDocument()
    expect(screen.getByText('ada@example.com')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Sair' }))
    expect(logout).toHaveBeenCalledTimes(1)
  })
})
