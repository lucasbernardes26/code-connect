import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext, type AuthContextValue } from '../contexts/AuthContext'
import { ProtectedRoute } from './ProtectedRoute'

function renderWithAuth(value: Partial<AuthContextValue>, initialPath = '/') {
  const contextValue: AuthContextValue = {
    user: null,
    isAuthenticated: false,
    isInitializing: false,
    login: vi.fn(),
    logout: vi.fn(),
    ...value,
  }

  render(
    <AuthContext.Provider value={contextValue}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<h1>Área logada</h1>} />
          </Route>
          <Route path="/login" element={<h1>Página de login</h1>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('ProtectedRoute', () => {
  it('renders loading status while session is initializing', () => {
    renderWithAuth({ isInitializing: true })

    expect(screen.getByRole('status')).toHaveTextContent('Carregando sessão...')
  })

  it('redirects unauthenticated users to /login', () => {
    renderWithAuth({ isAuthenticated: false, isInitializing: false })

    expect(screen.getByRole('heading', { name: 'Página de login' })).toBeInTheDocument()
  })

  it('renders child route when user is authenticated', () => {
    renderWithAuth({
      isAuthenticated: true,
      isInitializing: false,
      user: {
        id: 'user-1',
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        createdAt: '2026-11-25T03:00:00.000Z',
      },
    })

    expect(screen.getByRole('heading', { name: 'Área logada' })).toBeInTheDocument()
  })
})
