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
      <LoginForm onSubmit={onSubmit} onSocialLogin={onSocialLogin} />
    </MemoryRouter>,
  )

  return { onSubmit, onSocialLogin }
}

describe('LoginForm', () => {
  it('renders fields, links, and social buttons', () => {
    renderLoginForm()

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email ou usuário')).toBeInTheDocument()
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

  it('shows validation errors and does not submit when fields are empty', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderLoginForm()

    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(screen.getByText('Informe seu email ou usuário')).toBeInTheDocument()
    expect(screen.getByText('Informe sua senha')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits credentials when form is valid', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderLoginForm()

    await user.type(screen.getByLabelText('Email ou usuário'), '  usuario123  ')
    await user.type(screen.getByLabelText('Senha'), 'segredo')
    await user.click(screen.getByRole('checkbox', { name: 'Lembrar-me' }))
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      identifier: 'usuario123',
      password: 'segredo',
      remember: false,
    })
  })

  it('forwards social login clicks', async () => {
    const user = userEvent.setup()
    const { onSocialLogin } = renderLoginForm()

    await user.click(screen.getByRole('button', { name: 'Github' }))
    expect(onSocialLogin).toHaveBeenCalledWith('github')
  })
})
