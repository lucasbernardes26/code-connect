export type CreateTokenRequest = {
  email: string
  password: string
}

export type TokenResponse = {
  accessToken: string
  expiresIn: number
}

export type CreateUserRequest = {
  name: string
  email: string
  password: string
}

export type UserResponse = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type ApiErrorResponse = {
  statusCode: number
  message: string | string[]
  error: string
}
