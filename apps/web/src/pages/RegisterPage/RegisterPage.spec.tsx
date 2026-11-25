import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, AxiosHeaders } from 'axios'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { authService } from '../../services/auth.service'
import { RegisterPage } from './RegisterPage'

describe('RegisterPage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

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

  it('registers user via POST /users and redirects to /login on success', async () => {
    const user = userEvent.setup()
    const registerSpy = vi.spyOn(authService, 'register').mockResolvedValue({
      id: 'user-1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      createdAt: '2026-11-25T03:00:00.000Z',
    })

    render(
      <MemoryRouter initialEntries={['/cadastro']}>
        <Routes>
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route path="/login" element={<h1>Página de login</h1>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Nome'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Senha'), 'secret123')
    await user.click(screen.getByRole('button', { name: /cadastrar/i }))

    await waitFor(() => {
      expect(registerSpy).toHaveBeenCalledWith({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        password: 'secret123',
      })
    })
    expect(await screen.findByRole('heading', { name: 'Página de login' })).toBeInTheDocument()
  })

  it('displays conflict error message when email is already registered (409)', async () => {
    const user = userEvent.setup()
    const conflictError = new AxiosError('Conflict', 'ERR_BAD_REQUEST', undefined, undefined, {
      data: { statusCode: 409, message: 'Email already registered', error: 'Conflict' },
      status: 409,
      statusText: 'Conflict',
      headers: new AxiosHeaders(),
      config: { headers: new AxiosHeaders() },
    })
    vi.spyOn(authService, 'register').mockRejectedValue(conflictError)

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Nome'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Senha'), 'secret123')
    await user.click(screen.getByRole('button', { name: /cadastrar/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Este e-mail já está cadastrado.')
  })
})
