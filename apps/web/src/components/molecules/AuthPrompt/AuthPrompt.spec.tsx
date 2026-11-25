import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AuthPrompt } from './AuthPrompt'

describe('AuthPrompt', () => {
  it('renders question text and primary navigation link', () => {
    render(
      <MemoryRouter>
        <AuthPrompt question="Ainda não tem conta?" linkLabel="Crie seu cadastro!" to="/cadastro" />
      </MemoryRouter>,
    )

    expect(screen.getByText('Ainda não tem conta?')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /crie seu cadastro/i })
    expect(link).toHaveAttribute('href', '/cadastro')
    expect(link).toHaveClass('text-primary')
  })

  it('supports inline layout for registration footer prompt', () => {
    const { container } = render(
      <MemoryRouter>
        <AuthPrompt
          layout="inline"
          question="Já tem conta?"
          linkLabel="Faça seu login!"
          to="/login"
        />
      </MemoryRouter>,
    )

    expect(container.firstElementChild).toHaveClass('flex-row')
    expect(screen.getByText('Já tem conta?')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /faça seu login/i })).toHaveAttribute('href', '/login')
  })
})
