import { createContext } from 'react'
import type { UserResponse } from '../services/contracts'

export type LoginInput = {
  email: string
  password: string
  remember: boolean
}

export type AuthContextValue = {
  user: UserResponse | null
  isAuthenticated: boolean
  isInitializing: boolean
  login: (input: LoginInput) => Promise<UserResponse>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
