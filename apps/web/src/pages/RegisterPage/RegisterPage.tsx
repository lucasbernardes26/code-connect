import { RegisterForm, type RegisterData } from '../../components/organisms/RegisterForm'
import type { SocialProvider } from '../../components/organisms/SocialLogin'
import { AuthTemplate } from '../../components/templates/AuthTemplate'

/** Registration page connecting the AuthTemplate layout with the RegisterForm organism. */
export function RegisterPage() {
  function handleRegister(data: RegisterData) {
    // TODO: integrate with user registration API endpoint when available
    console.info('Registration submitted', {
      name: data.name,
      email: data.email,
      remember: data.remember,
    })
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
      <RegisterForm onSubmit={handleRegister} onSocialLogin={handleSocialLogin} />
    </AuthTemplate>
  )
}
