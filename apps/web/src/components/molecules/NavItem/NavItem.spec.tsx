import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { NavItem } from './NavItem'

describe('NavItem', () => {
  it('renders link with aria-current when active', () => {
    render(
      <MemoryRouter>
        <NavItem icon="feed" label="Feed" to="/" active />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: 'Feed' })
    expect(link).toHaveAttribute('href', '/')
    expect(link).toHaveAttribute('aria-current', 'page')
  })

  it('renders action button and triggers onClick when no route is provided', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<NavItem icon="logout" label="Sair" onClick={onClick} />)

    await user.click(screen.getByRole('button', { name: 'Sair' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
