import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, AxiosHeaders } from 'axios'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext, type AuthContextValue } from '../../contexts/AuthContext'
import { LoginPage } from './LoginPage'

function renderLoginPage(
  authOverrides?: Partial<AuthContextValue>,
  initialEntry: string | { pathname: string; state?: unknown } = '/login',
) {
  const login = authOverrides?.login ?? vi.fn()
  const contextValue: AuthContextValue = {
    user: null,
    isAuthenticated: false,
    isInitializing: false,
    login,
    logout: vi.fn(),
    ...authOverrides,
  }

  render(
    <AuthContext.Provider value={contextValue}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<h1>Área logada</h1>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )

  return { login }
}

describe('LoginPage', () => {
  it('renders the login banner and login form', () => {
    renderLoginPage()

    expect(
      screen.getByRole('img', { name: 'Pessoa programando em ambiente com telas verdes' }),
    ).toHaveAttribute('src', '/banner.png')
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
  })

  it('shows post-registration success banner and pre-fills email from route state', () => {
    renderLoginPage(undefined, {
      pathname: '/login',
      state: {
        successMessage: 'Cadastro realizado com sucesso! Faça seu login.',
        registeredEmail: 'ada@example.com',
      },
    })

    expect(screen.getByRole('status')).toHaveTextContent(
      'Cadastro realizado com sucesso! Faça seu login.',
    )
    expect(screen.getByLabelText('Email')).toHaveValue('ada@example.com')
  })

  it('submits credentials to login and navigates to / on success', async () => {
    const user = userEvent.setup()
    const login = vi.fn().mockResolvedValue({
      id: 'user-1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      createdAt: '2026-11-25T03:00:00.000Z',
    })

    renderLoginPage({ login })

    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Senha'), 'secret123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'ada@example.com',
        password: 'secret123',
        remember: true,
      })
    })
    expect(await screen.findByRole('heading', { name: 'Área logada' })).toBeInTheDocument()
  })

  it('displays API error message when login returns 401', async () => {
    const user = userEvent.setup()
    const unauthorizedError = new AxiosError(
      'Unauthorized',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        data: { statusCode: 401, message: 'Invalid email or password', error: 'Unauthorized' },
        status: 401,
        statusText: 'Unauthorized',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      },
    )
    const login = vi.fn().mockRejectedValue(unauthorizedError)

    renderLoginPage({ login })

    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Senha'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail ou senha inválidos.')
  })
})
