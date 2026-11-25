import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { RegisterPage } from './RegisterPage'

describe('RegisterPage', () => {
  it('renders the registration banner, brand logo overlay, and form', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('img', { name: 'Mulher programando em ambiente com telas verdes' }),
    ).toHaveAttribute('src', '/banner-cadastro.png')
    expect(screen.getByRole('img', { name: 'Code Connect' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cadastro' })).toBeInTheDocument()
  })
})
