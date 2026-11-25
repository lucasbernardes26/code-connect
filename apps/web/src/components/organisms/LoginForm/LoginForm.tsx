import { useState, type FormEvent } from 'react'
import { Button } from '../../atoms/Button'
import { Icon } from '../../atoms/Icon'
import { TextLink } from '../../atoms/TextLink'
import { AuthHeader } from '../../molecules/AuthHeader'
import { AuthPrompt } from '../../molecules/AuthPrompt'
import { Checkbox } from '../../molecules/Checkbox'
import { FeedbackBanner } from '../../molecules/FeedbackBanner'
import { FormField } from '../../molecules/FormField'
import { SocialLogin, type SocialProvider } from '../SocialLogin'

export type LoginCredentials = {
  email: string
  password: string
  remember: boolean
}

export type LoginFormProps = {
  onSubmit: (credentials: LoginCredentials) => void | Promise<void>
  onSocialLogin?: (provider: SocialProvider) => void
  defaultEmail?: string
  isSubmitting?: boolean
  errorMessage?: string
  successMessage?: string
}

type FieldErrors = {
  email?: string
  password?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Controlled login form with client-side validation, API feedback, social login, and signup link. */
export function LoginForm({
  onSubmit,
  onSocialLogin,
  defaultEmail = '',
  isSubmitting = false,
  errorMessage,
  successMessage,
}: LoginFormProps) {
  const [email, setEmail] = useState(defaultEmail)
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<FieldErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedEmail = email.trim().toLowerCase()
    const nextErrors: FieldErrors = {}

    if (!trimmedEmail) {
      nextErrors.email = 'Informe seu email'
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      nextErrors.email = 'Informe um email válido'
    }

    if (!password) {
      nextErrors.password = 'Informe sua senha'
    }

    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    void onSubmit({
      email: trimmedEmail,
      password,
      remember,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-8">
        <AuthHeader title="Login" subtitle="Boas-vindas! Faça seu login." />

        {successMessage && <FeedbackBanner variant="success" message={successMessage} />}
        {errorMessage && <FeedbackBanner variant="error" message={errorMessage} />}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <FormField
              id="login-email"
              name="email"
              type="email"
              label="Email"
              placeholder="Digite seu email"
              autoComplete="email"
              disabled={isSubmitting}
              value={email}
              error={errors.email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }))
                }
              }}
            />

            <div className="flex flex-col gap-2">
              <FormField
                id="login-password"
                name="password"
                type="password"
                label="Senha"
                placeholder="******"
                autoComplete="current-password"
                disabled={isSubmitting}
                value={password}
                error={errors.password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }))
                  }
                }}
              />

              <div className="flex items-center justify-between gap-4">
                <Checkbox
                  id="login-remember"
                  label="Lembrar-me"
                  checked={remember}
                  disabled={isSubmitting}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                <TextLink
                  to="/esqueci-senha"
                  underline
                  className="text-sm leading-normal text-offwhite"
                >
                  Esqueci a senha
                </TextLink>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            disabled={isSubmitting}
            icon={<Icon name="arrow-right" />}
          >
            {isSubmitting ? 'Entrando...' : 'Login'}
          </Button>
        </form>

        <SocialLogin label="ou entre com outras contas" onSelect={onSocialLogin} />
      </div>

      <AuthPrompt
        question="Ainda não tem conta?"
        linkLabel="Crie seu cadastro!"
        to="/cadastro"
      />
    </div>
  )
}
