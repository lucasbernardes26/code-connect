import { api } from './api'
import type {
  CreateTokenRequest,
  CreateUserRequest,
  TokenResponse,
  UserResponse,
} from './contracts'

/** Authentication and user account API service backed by Axios. */
export const authService = {
  async register(payload: CreateUserRequest): Promise<UserResponse> {
    const { data } = await api.post<UserResponse>('/users', payload)
    return data
  },

  async login(payload: CreateTokenRequest): Promise<TokenResponse> {
    const { data } = await api.post<TokenResponse>('/auth/tokens', payload)
    return data
  },

  async getMe(): Promise<UserResponse> {
    const { data } = await api.get<UserResponse>('/users/me')
    return data
  },
}
