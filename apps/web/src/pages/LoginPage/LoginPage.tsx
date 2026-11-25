import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { LoginForm, type LoginCredentials } from '../../components/organisms/LoginForm'
import type { SocialProvider } from '../../components/organisms/SocialLogin'
import { AuthTemplate } from '../../components/templates/AuthTemplate'
import { useAuth } from '../../hooks/useAuth'
import { extractApiErrorMessage } from '../../services/api'

type LoginLocationState = {
  successMessage?: string
  registeredEmail?: string
} | null

/** Login page connecting the AuthTemplate layout with the LoginForm organism and AuthContext. */
export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = (location.state as LoginLocationState) ?? null

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  async function handleLogin(credentials: LoginCredentials) {
    setIsSubmitting(true)
    setErrorMessage(undefined)

    try {
      await login({
        email: credentials.email,
        password: credentials.password,
        remember: credentials.remember,
      })
      void navigate('/', {
        replace: true,
        state: {
          successMessage: 'Login realizado com sucesso!',
        },
      })
    } catch (error) {
      setErrorMessage(
        extractApiErrorMessage(error, 'Não foi possível realizar o login. Tente novamente.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleSocialLogin(provider: SocialProvider) {
    // TODO: integrate with OAuth provider flow when available
    console.info('Social login selected', { provider })
  }

  return (
    <AuthTemplate
      bannerSrc="/banner.png"
      bannerAlt="Pessoa programando em ambiente com telas verdes"
    >
      <LoginForm
        onSubmit={handleLogin}
        onSocialLogin={handleSocialLogin}
        defaultEmail={locationState?.registeredEmail}
        successMessage={locationState?.successMessage}
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
      />
    </AuthTemplate>
  )
}
