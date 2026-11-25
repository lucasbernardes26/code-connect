import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { LoginPage } from './LoginPage'

describe('LoginPage', () => {
  it('renders the login banner and login form', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('img', { name: 'Pessoa programando em ambiente com telas verdes' }),
    ).toHaveAttribute('src', '/banner.png')
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
  })
})
