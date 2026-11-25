import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { RegisterForm } from './RegisterForm'

function renderRegisterForm(props?: Partial<React.ComponentProps<typeof RegisterForm>>) {
  const onSubmit = props?.onSubmit ?? vi.fn()
  const onSocialLogin = props?.onSocialLogin ?? vi.fn()

  render(
    <MemoryRouter>
      <RegisterForm onSubmit={onSubmit} onSocialLogin={onSocialLogin} />
    </MemoryRouter>,
  )

  return { onSubmit, onSocialLogin }
}

describe('RegisterForm', () => {
  it('renders fields, login link, and social buttons', () => {
    renderRegisterForm()

    expect(screen.getByRole('heading', { name: 'Cadastro' })).toBeInTheDocument()
    expect(screen.getByText('Olá! Preencha seus dados.')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Lembrar-me' })).toBeChecked()
    expect(screen.getByRole('link', { name: /faça seu login/i })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('button', { name: 'Github' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Gmail' })).toBeInTheDocument()
  })

  it('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderRegisterForm()

    await user.click(screen.getByRole('button', { name: /cadastrar/i }))

    expect(screen.getByText('Informe seu nome')).toBeInTheDocument()
    expect(screen.getByText('Informe seu email')).toBeInTheDocument()
    expect(screen.getByText('A senha deve ter pelo menos 6 caracteres')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows email and password format errors and clears them on edit', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderRegisterForm()

    await user.type(screen.getByLabelText('Nome'), 'Maria Silva')
    await user.type(screen.getByLabelText('Email'), 'email-invalido')
    await user.type(screen.getByLabelText('Senha'), '123')
    await user.click(screen.getByRole('button', { name: /cadastrar/i }))

    expect(screen.getByText('Informe um email válido')).toBeInTheDocument()
    expect(screen.getByText('A senha deve ter pelo menos 6 caracteres')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()

    await user.clear(screen.getByLabelText('Email'))
    expect(screen.queryByText('Informe um email válido')).not.toBeInTheDocument()
  })

  it('submits trimmed registration data when form is valid', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderRegisterForm()

    await user.type(screen.getByLabelText('Nome'), '  Maria Silva  ')
    await user.type(screen.getByLabelText('Email'), '  maria@example.com  ')
    await user.type(screen.getByLabelText('Senha'), 'segredo123')
    await user.click(screen.getByRole('checkbox', { name: 'Lembrar-me' }))
    await user.click(screen.getByRole('button', { name: /cadastrar/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Maria Silva',
      email: 'maria@example.com',
      password: 'segredo123',
      remember: false,
    })
  })

  it('forwards social login clicks', async () => {
    const user = userEvent.setup()
    const { onSocialLogin } = renderRegisterForm()

    await user.click(screen.getByRole('button', { name: 'Gmail' }))
    expect(onSocialLogin).toHaveBeenCalledWith('google')
  })
})
