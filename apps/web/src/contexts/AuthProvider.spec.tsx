import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../hooks/useAuth'
import { clearToken, getToken, saveToken } from '../lib/token-storage'
import { authService } from '../services/auth.service'
import { AuthProvider } from './AuthProvider'

function AuthProbe() {
  const { user, isAuthenticated, isInitializing, login, logout } = useAuth()

  return (
    <div>
      <span data-testid="init">{String(isInitializing)}</span>
      <span data-testid="auth">{String(isAuthenticated)}</span>
      <span data-testid="user">{user ? `${user.name} <${user.email}>` : 'none'}</span>
      <button
        type="button"
        onClick={() => {
          void login({ email: 'ada@example.com', password: 'secret123', remember: true }).catch(
            () => {},
          )
        }}
      >
        Entrar
      </button>
      <button type="button" onClick={logout}>
        Sair
      </button>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    clearToken()
  })

  it('starts unauthenticated when no token is stored', () => {
    const getMeSpy = vi.spyOn(authService, 'getMe')

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    )

    expect(screen.getByTestId('init')).toHaveTextContent('false')
    expect(screen.getByTestId('auth')).toHaveTextContent('false')
    expect(screen.getByTestId('user')).toHaveTextContent('none')
    expect(getMeSpy).not.toHaveBeenCalled()
  })

  it('hydrates user profile via GET /users/me when token exists', async () => {
    saveToken('valid-token', true)
    vi.spyOn(authService, 'getMe').mockResolvedValue({
      id: 'user-1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      createdAt: '2026-11-25T03:00:00.000Z',
    })

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('init')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('auth')).toHaveTextContent('true')
    expect(screen.getByTestId('user')).toHaveTextContent('Ada Lovelace <ada@example.com>')
  })

  it('clears invalid token when GET /users/me fails during hydration', async () => {
    saveToken('invalid-token', true)
    vi.spyOn(authService, 'getMe').mockRejectedValue(new Error('Unauthorized'))

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('init')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('auth')).toHaveTextContent('false')
    expect(getToken()).toBeNull()
  })

  it('logs in, persists token, fetches profile, and clears on logout', async () => {
    const user = userEvent.setup()
    vi.spyOn(authService, 'login').mockResolvedValue({
      accessToken: 'fresh-jwt',
      expiresIn: 900,
    })
    vi.spyOn(authService, 'getMe').mockResolvedValue({
      id: 'user-1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      createdAt: '2026-11-25T03:00:00.000Z',
    })

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => {
      expect(screen.getByTestId('auth')).toHaveTextContent('true')
    })

    expect(getToken()).toBe('fresh-jwt')
    expect(screen.getByTestId('user')).toHaveTextContent('Ada Lovelace <ada@example.com>')

    await user.click(screen.getByRole('button', { name: 'Sair' }))

    expect(screen.getByTestId('auth')).toHaveTextContent('false')
    expect(getToken()).toBeNull()
  })
})
