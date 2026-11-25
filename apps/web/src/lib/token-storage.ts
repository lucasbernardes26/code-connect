const ACCESS_TOKEN_KEY = 'code-connect:access-token'

/** Persists the JWT access token in localStorage (remember) or sessionStorage. */
export function saveToken(token: string, remember: boolean): void {
  clearToken()
  const storage = remember ? window.localStorage : window.sessionStorage
  storage.setItem(ACCESS_TOKEN_KEY, token)
}

/** Retrieves the stored JWT access token from localStorage or sessionStorage. */
export function getToken(): string | null {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY) ?? window.sessionStorage.getItem(ACCESS_TOKEN_KEY)
}

/** Removes the JWT access token from both localStorage and sessionStorage. */
export function clearToken(): void {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY)
}
