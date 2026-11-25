import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext, type AuthContextValue } from '../contexts/AuthContext'
import { AppLayout } from './AppLayout'

function renderWithAuth(isAuthenticated: boolean) {
  const value: AuthContextValue = {
    user: isAuthenticated
      ? {
          id: 'u1',
          name: 'Júlio',
          email: 'julio@codeconnect.dev',
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
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<div>Feed content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('AppLayout', () => {
  it('shows Entrar in sidebar when visitor is unauthenticated', () => {
    renderWithAuth(false)

    expect(screen.getByText('Feed content')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Entrar' }).length).toBeGreaterThan(0)
  })

  it('shows Sair in sidebar when user is authenticated', () => {
    renderWithAuth(true)

    expect(screen.getByText('Feed content')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Sair' }).length).toBeGreaterThan(0)
  })
})
