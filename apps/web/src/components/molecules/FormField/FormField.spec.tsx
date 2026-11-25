import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FormField } from './FormField'

describe('FormField', () => {
  it('associates label with input and handles user input', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <FormField
        id="identifier"
        label="Email ou usuário"
        placeholder="usuario123"
        onChange={onChange}
      />,
    )

    const input = screen.getByLabelText('Email ou usuário')
    await user.type(input, 'dev')
    expect(input).toHaveValue('dev')
    expect(onChange).toHaveBeenCalled()
  })

  it('displays error message and marks input as invalid', () => {
    render(<FormField id="password" label="Senha" error="Informe sua senha" />)

    const input = screen.getByLabelText('Senha')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Informe sua senha')
  })
})
