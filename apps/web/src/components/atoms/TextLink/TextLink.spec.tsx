import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { TextLink } from './TextLink'

describe('TextLink', () => {
  it('renders link with target href and text', () => {
    render(
      <MemoryRouter>
        <TextLink to="/esqueci-senha" underline>
          Esqueci a senha
        </TextLink>
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: /esqueci a senha/i })
    expect(link).toHaveAttribute('href', '/esqueci-senha')
    expect(link).toHaveClass('underline')
  })

  it('applies primary variant and renders icon', () => {
    render(
      <MemoryRouter>
        <TextLink to="/cadastro" variant="primary" icon={<span data-testid="link-icon" />}>
          Crie seu cadastro!
        </TextLink>
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: /crie seu cadastro/i })
    expect(link).toHaveClass('text-primary')
    expect(screen.getByTestId('link-icon')).toBeInTheDocument()
  })
})
