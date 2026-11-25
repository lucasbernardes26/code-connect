import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { clearToken, saveToken } from '../lib/token-storage'
import { api, extractApiErrorMessage, setUnauthorizedHandler } from './api'

describe('api client', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    setUnauthorizedHandler(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('attaches Bearer token from storage in request interceptor', async () => {
    saveToken('my-jwt-token', true)

    const adapterSpy = vi.fn(async (config: InternalAxiosRequestConfig) => ({
      data: { ok: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }))

    await api.get('/users/me', { adapter: adapterSpy })

    expect(adapterSpy).toHaveBeenCalledTimes(1)
    const sentConfig = adapterSpy.mock.calls[0][0]
    expect(sentConfig.headers.Authorization).toBe('Bearer my-jwt-token')
  })

  it('clears token and notifies handler on 401 from authenticated endpoints', async () => {
    saveToken('expired-token', true)
    const onUnauthorized = vi.fn()
    setUnauthorizedHandler(onUnauthorized)

    const failingAdapter = vi.fn(async (config: InternalAxiosRequestConfig) => {
      throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, {
        data: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' },
        status: 401,
        statusText: 'Unauthorized',
        headers: new AxiosHeaders(),
        config,
      })
    })

    await expect(api.get('/users/me', { adapter: failingAdapter })).rejects.toThrow()

    expect(onUnauthorized).toHaveBeenCalledTimes(1)
    expect(window.localStorage.getItem('code-connect:access-token')).toBeNull()
  })

  it('does not trigger unauthorized handler on 401 from POST /auth/tokens', async () => {
    saveToken('existing-token', true)
    const onUnauthorized = vi.fn()
    setUnauthorizedHandler(onUnauthorized)

    const failingAdapter = vi.fn(async (config: InternalAxiosRequestConfig) => {
      throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, {
        data: { statusCode: 401, message: 'Invalid email or password', error: 'Unauthorized' },
        status: 401,
        statusText: 'Unauthorized',
        headers: new AxiosHeaders(),
        config,
      })
    })

    await expect(
      api.post('/auth/tokens', { email: 'a@b.com', password: 'wrong' }, { adapter: failingAdapter }),
    ).rejects.toThrow()

    expect(onUnauthorized).not.toHaveBeenCalled()
    clearToken()
  })

  it('formats API and network errors into friendly Portuguese messages', () => {
    const networkError = new AxiosError('Network Error', 'ERR_NETWORK')
    expect(extractApiErrorMessage(networkError)).toBe(
      'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
    )

    const unauthorizedError = new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', undefined, undefined, {
      data: { statusCode: 401, message: 'Invalid email or password', error: 'Unauthorized' },
      status: 401,
      statusText: 'Unauthorized',
      headers: new AxiosHeaders(),
      config: { headers: new AxiosHeaders() },
    })
    expect(extractApiErrorMessage(unauthorizedError)).toBe('E-mail ou senha inválidos.')

    const conflictError = new AxiosError('Conflict', 'ERR_BAD_REQUEST', undefined, undefined, {
      data: { statusCode: 409, message: 'Email already registered', error: 'Conflict' },
      status: 409,
      statusText: 'Conflict',
      headers: new AxiosHeaders(),
      config: { headers: new AxiosHeaders() },
    })
    expect(extractApiErrorMessage(conflictError)).toBe('Este e-mail já está cadastrado.')

    const validationError = new AxiosError('Bad Request', 'ERR_BAD_REQUEST', undefined, undefined, {
      data: { statusCode: 400, message: ['email must be an email'], error: 'Bad Request' },
      status: 400,
      statusText: 'Bad Request',
      headers: new AxiosHeaders(),
      config: { headers: new AxiosHeaders() },
    })
    expect(extractApiErrorMessage(validationError)).toBe('email must be an email')

    expect(extractApiErrorMessage(new Error('unknown'), 'Erro padrão')).toBe('Erro padrão')
  })
})
