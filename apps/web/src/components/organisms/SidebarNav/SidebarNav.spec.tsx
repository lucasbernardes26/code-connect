import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { SidebarNav } from './SidebarNav'

describe('SidebarNav', () => {
  it('renders Entrar link and hides Perfil when unauthenticated', () => {
    render(
      <MemoryRouter>
        <SidebarNav isAuthenticated={false} onLogout={vi.fn()} currentPath="/" />
      </MemoryRouter>,
    )

    expect(screen.getAllByRole('link', { name: 'Entrar' }).length).toBeGreaterThan(0)
    expect(screen.queryByRole('link', { name: 'Perfil' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Sair' })).not.toBeInTheDocument()
  })

  it('renders Perfil and Sair button when authenticated and triggers logout', async () => {
    const user = userEvent.setup()
    const onLogout = vi.fn()

    render(
      <MemoryRouter>
        <SidebarNav isAuthenticated onLogout={onLogout} currentPath="/perfil" />
      </MemoryRouter>,
    )

    expect(screen.getAllByRole('link', { name: 'Perfil' }).length).toBeGreaterThan(0)
    const sairButtons = screen.getAllByRole('button', { name: 'Sair' })
    await user.click(sairButtons[0])
    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})
