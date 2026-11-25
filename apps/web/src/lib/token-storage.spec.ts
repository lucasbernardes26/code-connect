import { beforeEach, describe, expect, it } from 'vitest'
import { clearToken, getToken, saveToken } from './token-storage'

describe('token-storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  it('stores token in localStorage when remember is true', () => {
    saveToken('jwt-token-123', true)

    expect(window.localStorage.getItem('code-connect:access-token')).toBe('jwt-token-123')
    expect(window.sessionStorage.getItem('code-connect:access-token')).toBeNull()
    expect(getToken()).toBe('jwt-token-123')
  })

  it('stores token in sessionStorage when remember is false', () => {
    saveToken('jwt-token-456', false)

    expect(window.sessionStorage.getItem('code-connect:access-token')).toBe('jwt-token-456')
    expect(window.localStorage.getItem('code-connect:access-token')).toBeNull()
    expect(getToken()).toBe('jwt-token-456')
  })

  it('replaces previous storage location when saving again', () => {
    saveToken('first-token', true)
    saveToken('second-token', false)

    expect(window.localStorage.getItem('code-connect:access-token')).toBeNull()
    expect(window.sessionStorage.getItem('code-connect:access-token')).toBe('second-token')
    expect(getToken()).toBe('second-token')
  })

  it('clears token from both storages', () => {
    saveToken('jwt-token-789', true)
    clearToken()

    expect(getToken()).toBeNull()
    expect(window.localStorage.getItem('code-connect:access-token')).toBeNull()
    expect(window.sessionStorage.getItem('code-connect:access-token')).toBeNull()
  })
})
