import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext, type AuthContextValue } from '../contexts/AuthContext'
import { PublicOnlyRoute } from './PublicOnlyRoute'

function renderWithAuth(value: Partial<AuthContextValue>, initialPath = '/login') {
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
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<h1>Página de login</h1>} />
          </Route>
          <Route path="/" element={<h1>Área logada</h1>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('PublicOnlyRoute', () => {
  it('renders public route when user is not authenticated', () => {
    renderWithAuth({ isAuthenticated: false, isInitializing: false })

    expect(screen.getByRole('heading', { name: 'Página de login' })).toBeInTheDocument()
  })

  it('redirects authenticated users to /', () => {
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
