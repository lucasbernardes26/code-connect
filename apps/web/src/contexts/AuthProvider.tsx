import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { clearToken, getToken, saveToken } from '../lib/token-storage'
import { setUnauthorizedHandler } from '../services/api'
import { authService } from '../services/auth.service'
import type { UserResponse } from '../services/contracts'
import { AuthContext, type LoginInput } from './AuthContext'

export type AuthProviderProps = {
  children: ReactNode
}

/** Manages authenticated user session, token storage, and GET /users/me hydration. */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [isInitializing, setIsInitializing] = useState<boolean>(() => Boolean(getToken()))

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null)
    })

    return () => {
      setUnauthorizedHandler(null)
    }
  }, [])

  useEffect(() => {
    const token = getToken()
    if (!token) {
      return
    }

    let active = true

    authService
      .getMe()
      .then((profile) => {
        if (active) {
          setUser(profile)
        }
      })
      .catch(() => {
        clearToken()
        if (active) {
          setUser(null)
        }
      })
      .finally(() => {
        if (active) {
          setIsInitializing(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async ({ email, password, remember }: LoginInput) => {
    const { accessToken } = await authService.login({ email, password })
    saveToken(accessToken, remember)

    try {
      const profile = await authService.getMe()
      setUser(profile)
      return profile
    } catch (error) {
      clearToken()
      setUser(null)
      throw error
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isInitializing,
      login,
      logout,
    }),
    [user, isInitializing, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
