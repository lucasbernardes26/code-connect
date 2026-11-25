import { useState } from 'react'
import { useNavigate } from 'react-router'
import { RegisterForm, type RegisterData } from '../../components/organisms/RegisterForm'
import type { SocialProvider } from '../../components/organisms/SocialLogin'
import { AuthTemplate } from '../../components/templates/AuthTemplate'
import { extractApiErrorMessage } from '../../services/api'
import { authService } from '../../services/auth.service'

/** Registration page connecting the AuthTemplate layout with RegisterForm and POST /users. */
export function RegisterPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  async function handleRegister(data: RegisterData) {
    setIsSubmitting(true)
    setErrorMessage(undefined)

    try {
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      void navigate('/login', {
        replace: true,
        state: {
          successMessage: 'Cadastro realizado com sucesso! Faça seu login.',
          registeredEmail: data.email,
        },
      })
    } catch (error) {
      setErrorMessage(
        extractApiErrorMessage(error, 'Não foi possível concluir o cadastro. Tente novamente.'),
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
      bannerSrc="/banner-cadastro.png"
      bannerAlt="Mulher programando em ambiente com telas verdes"
      showBrandLogo
    >
      <RegisterForm
        onSubmit={handleRegister}
        onSocialLogin={handleSocialLogin}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
      />
    </AuthTemplate>
  )
}
