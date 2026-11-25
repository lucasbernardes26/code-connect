import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FeedbackBanner } from './FeedbackBanner'

describe('FeedbackBanner', () => {
  it('renders error message with alert role', () => {
    render(<FeedbackBanner variant="error" message="E-mail ou senha inválidos." />)

    const banner = screen.getByRole('alert')
    expect(banner).toHaveTextContent('E-mail ou senha inválidos.')
  })

  it('renders success message with status role', () => {
    render(<FeedbackBanner variant="success" message="Cadastro realizado com sucesso!" />)

    const banner = screen.getByRole('status')
    expect(banner).toHaveTextContent('Cadastro realizado com sucesso!')
  })
})
