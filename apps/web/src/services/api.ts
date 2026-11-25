import axios, { type AxiosError } from 'axios'
import { clearToken, getToken } from '../lib/token-storage'
import type { ApiErrorResponse } from './contracts'

const DEFAULT_API_URL = 'http://localhost:3000'

type UnauthorizedHandler = () => void

let unauthorizedHandler: UnauthorizedHandler | null = null

/** Registers a callback invoked when an authenticated request receives HTTP 401. */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler
}

/** Shared Axios instance configured for the Code Connect NestJS API. */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.trim() || DEFAULT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const requestUrl = error.config?.url ?? ''
      const isLoginAttempt = requestUrl.endsWith('/auth/tokens')

      if (status === 401 && !isLoginAttempt) {
        clearToken()
        unauthorizedHandler?.()
      }
    }

    return Promise.reject(error)
  },
)

/** Converts an unknown API error into a user-friendly Portuguese message. */
export function extractApiErrorMessage(
  error: unknown,
  fallback = 'Ocorreu um erro inesperado. Tente novamente.',
): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallback
  }

  const axiosError = error as AxiosError<ApiErrorResponse>

  if (!axiosError.response) {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
  }

  const { status, data } = axiosError.response

  if (status === 401) {
    return 'E-mail ou senha inválidos.'
  }

  if (status === 409) {
    return 'Este e-mail já está cadastrado.'
  }

  const apiMessage = data?.message
  if (Array.isArray(apiMessage) && apiMessage.length > 0) {
    return apiMessage[0]
  }
  if (typeof apiMessage === 'string' && apiMessage.trim()) {
    return apiMessage
  }

  return fallback
}
