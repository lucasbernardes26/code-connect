import { afterEach, describe, expect, it, vi } from 'vitest'
import { api } from './api'
import { authService } from './auth.service'

describe('authService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('registers a new user via POST /users', async () => {
    const createdUser = {
      id: 'user-1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      createdAt: '2026-11-25T03:00:00.000Z',
    }
    const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ data: createdUser })

    const result = await authService.register({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secret123',
    })

    expect(postSpy).toHaveBeenCalledWith('/users', {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secret123',
    })
    expect(result).toEqual(createdUser)
  })

  it('authenticates credentials via POST /auth/tokens', async () => {
    const tokenResponse = { accessToken: 'jwt-token', expiresIn: 900 }
    const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ data: tokenResponse })

    const result = await authService.login({
      email: 'ada@example.com',
      password: 'secret123',
    })

    expect(postSpy).toHaveBeenCalledWith('/auth/tokens', {
      email: 'ada@example.com',
      password: 'secret123',
    })
    expect(result).toEqual(tokenResponse)
  })

  it('fetches authenticated user profile via GET /users/me', async () => {
    const user = {
      id: 'user-1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      createdAt: '2026-11-25T03:00:00.000Z',
    }
    const getSpy = vi.spyOn(api, 'get').mockResolvedValue({ data: user })

    const result = await authService.getMe()

    expect(getSpy).toHaveBeenCalledWith('/users/me')
    expect(result).toEqual(user)
  })
})
