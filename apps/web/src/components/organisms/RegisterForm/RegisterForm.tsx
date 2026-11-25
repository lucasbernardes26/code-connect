import { useState, type FormEvent } from 'react'
import { Button } from '../../atoms/Button'
import { Icon } from '../../atoms/Icon'
import { AuthHeader } from '../../molecules/AuthHeader'
import { AuthPrompt } from '../../molecules/AuthPrompt'
import { Checkbox } from '../../molecules/Checkbox'
import { FeedbackBanner } from '../../molecules/FeedbackBanner'
import { FormField } from '../../molecules/FormField'
import { SocialLogin, type SocialProvider } from '../SocialLogin'

export type RegisterData = {
  name: string
  email: string
  password: string
  remember: boolean
}

export type RegisterFormProps = {
  onSubmit: (data: RegisterData) => void | Promise<void>
  onSocialLogin?: (provider: SocialProvider) => void
  isSubmitting?: boolean
  errorMessage?: string
}

type FieldErrors = {
  name?: string
  email?: string
  password?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Controlled registration form with client-side validation, API feedback, social login, and login link. */
export function RegisterForm({
  onSubmit,
  onSocialLogin,
  isSubmitting = false,
  errorMessage,
}: RegisterFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<FieldErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()
    const nextErrors: FieldErrors = {}

    if (!trimmedName) {
      nextErrors.name = 'Informe seu nome'
    } else if (trimmedName.length < 2) {
      nextErrors.name = 'O nome deve ter pelo menos 2 caracteres'
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Informe seu email'
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      nextErrors.email = 'Informe um email válido'
    }

    if (password.length < 6) {
      nextErrors.password = 'A senha deve ter pelo menos 6 caracteres'
    }

    if (nextErrors.name || nextErrors.email || nextErrors.password) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    void onSubmit({
      name: trimmedName,
      email: trimmedEmail,
      password,
      remember,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-8">
        <AuthHeader title="Cadastro" subtitle="Olá! Preencha seus dados." />

        {errorMessage && <FeedbackBanner variant="error" message={errorMessage} />}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <FormField
              id="register-name"
              name="name"
              label="Nome"
              placeholder="Nome completo"
              autoComplete="name"
              disabled={isSubmitting}
              value={name}
              error={errors.name}
              onChange={(event) => {
                setName(event.target.value)
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: undefined }))
                }
              }}
            />

            <FormField
              id="register-email"
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
                id="register-password"
                name="password"
                type="password"
                label="Senha"
                placeholder="******"
                autoComplete="new-password"
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

              <Checkbox
                id="register-remember"
                label="Lembrar-me"
                checked={remember}
                disabled={isSubmitting}
                onChange={(event) => setRemember(event.target.checked)}
              />
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            disabled={isSubmitting}
            icon={<Icon name="arrow-right" />}
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>

        <SocialLogin label="ou entre com outras contas" onSelect={onSocialLogin} />
      </div>

      <AuthPrompt
        layout="inline"
        question="Já tem conta?"
        linkLabel="Faça seu login!"
        to="/login"
        icon={<Icon name="login" className="h-6 w-6" />}
      />
    </div>
  )
}
