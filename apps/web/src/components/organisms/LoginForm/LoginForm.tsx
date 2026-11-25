import { useState, type FormEvent } from 'react'
import { Button } from '../../atoms/Button'
import { Icon } from '../../atoms/Icon'
import { TextLink } from '../../atoms/TextLink'
import { AuthHeader } from '../../molecules/AuthHeader'
import { AuthPrompt } from '../../molecules/AuthPrompt'
import { Checkbox } from '../../molecules/Checkbox'
import { FormField } from '../../molecules/FormField'
import { SocialLogin, type SocialProvider } from '../SocialLogin'

export type LoginCredentials = {
  identifier: string
  password: string
  remember: boolean
}

export type LoginFormProps = {
  onSubmit: (credentials: LoginCredentials) => void
  onSocialLogin?: (provider: SocialProvider) => void
}

type FieldErrors = {
  identifier?: string
  password?: string
}

/** Controlled login form with client-side validation, social login, and signup link. */
export function LoginForm({ onSubmit, onSocialLogin }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<FieldErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedIdentifier = identifier.trim()
    const nextErrors: FieldErrors = {}

    if (!trimmedIdentifier) {
      nextErrors.identifier = 'Informe seu email ou usuário'
    }
    if (!password) {
      nextErrors.password = 'Informe sua senha'
    }

    if (nextErrors.identifier || nextErrors.password) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    onSubmit({
      identifier: trimmedIdentifier,
      password,
      remember,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <AuthHeader title="Login" subtitle="Boas-vindas! Faça seu login." />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormField
          id="login-identifier"
          name="identifier"
          label="Email ou usuário"
          placeholder="usuario123"
          autoComplete="username"
          value={identifier}
          error={errors.identifier}
          onChange={(event) => {
            setIdentifier(event.target.value)
            if (errors.identifier) {
              setErrors((prev) => ({ ...prev, identifier: undefined }))
            }
          }}
        />

        <FormField
          id="login-password"
          name="password"
          type="password"
          label="Senha"
          placeholder="******"
          autoComplete="current-password"
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
            onChange={(event) => setRemember(event.target.checked)}
          />
          <TextLink to="/esqueci-senha" underline className="text-xs">
            Esqueci a senha
          </TextLink>
        </div>

        <Button
          type="submit"
          fullWidth
          icon={<Icon name="arrow-right" />}
          className="mt-2"
        >
          Login
        </Button>
      </form>

      <SocialLogin label="ou entre com outras contas" onSelect={onSocialLogin} />

      <AuthPrompt
        question="Ainda não tem conta?"
        linkLabel="Crie seu cadastro!"
        to="/cadastro"
      />
    </div>
  )
}
