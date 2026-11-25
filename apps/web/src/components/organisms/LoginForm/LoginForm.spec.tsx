import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { LoginForm } from './LoginForm'

function renderLoginForm(props?: Partial<React.ComponentProps<typeof LoginForm>>) {
  const onSubmit = props?.onSubmit ?? vi.fn()
  const onSocialLogin = props?.onSocialLogin ?? vi.fn()

  render(
    <MemoryRouter>
      <LoginForm {...props} onSubmit={onSubmit} onSocialLogin={onSocialLogin} />
    </MemoryRouter>,
  )

  return { onSubmit, onSocialLogin }
}

describe('LoginForm', () => {
  it('renders fields, links, and social buttons', () => {
    renderLoginForm()

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Lembrar-me' })).toBeChecked()
    expect(screen.getByRole('link', { name: 'Esqueci a senha' })).toHaveAttribute(
      'href',
      '/esqueci-senha',
    )
    expect(screen.getByRole('link', { name: /crie seu cadastro/i })).toHaveAttribute(
      'href',
      '/cadastro',
    )
    expect(screen.getByRole('button', { name: 'Github' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Gmail' })).toBeInTheDocument()
  })

  it('shows validation errors and does not submit when fields are empty or invalid', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderLoginForm()

    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(screen.getByText('Informe seu email')).toBeInTheDocument()
    expect(screen.getByText('Informe sua senha')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()

    await user.type(screen.getByLabelText('Email'), 'email-invalido')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(screen.getByText('Informe um email válido')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits normalized email credentials when form is valid', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderLoginForm()

    await user.type(screen.getByLabelText('Email'), '  Ada@Example.com  ')
    await user.type(screen.getByLabelText('Senha'), 'segredo123')
    await user.click(screen.getByRole('checkbox', { name: 'Lembrar-me' }))
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'ada@example.com',
      password: 'segredo123',
      remember: false,
    })
  })

  it('displays success/error banners and disables submit while submitting', () => {
    renderLoginForm({
      defaultEmail: 'ada@example.com',
      successMessage: 'Cadastro realizado com sucesso!',
      errorMessage: 'E-mail ou senha inválidos.',
      isSubmitting: true,
    })

    expect(screen.getByLabelText('Email')).toHaveValue('ada@example.com')
    expect(screen.getByRole('status')).toHaveTextContent('Cadastro realizado com sucesso!')
    expect(screen.getByRole('alert')).toHaveTextContent('E-mail ou senha inválidos.')
    expect(screen.getByRole('button', { name: 'Entrando...' })).toBeDisabled()
  })

  it('forwards social login clicks', async () => {
    const user = userEvent.setup()
    const { onSocialLogin } = renderLoginForm()

    await user.click(screen.getByRole('button', { name: 'Github' }))
    expect(onSocialLogin).toHaveBeenCalledWith('github')
  })
})
