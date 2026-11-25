import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext, type AuthContextValue } from '../../contexts/AuthContext'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders authenticated user profile, login success banner, and triggers logout', async () => {
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
        <MemoryRouter
          initialEntries={[{ pathname: '/', state: { successMessage: 'Login realizado com sucesso!' } }]}
        >
          <HomePage />
        </MemoryRouter>
      </AuthContext.Provider>,
    )

    expect(screen.getByRole('status')).toHaveTextContent('Login realizado com sucesso!')
    expect(screen.getByRole('heading', { name: 'Olá, Ada Lovelace' })).toBeInTheDocument()
    expect(screen.getByText('ada@example.com')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Sair' }))
    expect(logout).toHaveBeenCalledTimes(1)
  })
})
