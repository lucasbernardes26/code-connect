import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { UserProfileCard } from './UserProfileCard'

describe('UserProfileCard', () => {
  it('renders user name, email, and active session heading', () => {
    render(
      <UserProfileCard name="Ada Lovelace" email="ada@example.com" onLogout={vi.fn()} />,
    )

    expect(screen.getByRole('heading', { name: 'Olá, Ada Lovelace' })).toBeInTheDocument()
    expect(screen.getByText('ada@example.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
  })

  it('calls onLogout when clicking Sair', async () => {
    const user = userEvent.setup()
    const onLogout = vi.fn()

    render(
      <UserProfileCard name="Ada Lovelace" email="ada@example.com" onLogout={onLogout} />,
    )

    await user.click(screen.getByRole('button', { name: 'Sair' }))
    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})
