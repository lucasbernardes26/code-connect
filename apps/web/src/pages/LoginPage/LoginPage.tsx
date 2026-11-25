import { LoginForm, type LoginCredentials } from '../../components/organisms/LoginForm'
import type { SocialProvider } from '../../components/organisms/SocialLogin'
import { AuthTemplate } from '../../components/templates/AuthTemplate'

/** Login page connecting the AuthTemplate layout with the LoginForm organism. */
export function LoginPage() {
  function handleLogin(credentials: LoginCredentials) {
    // TODO: integrate with authentication API endpoint when available
    console.info('Login submitted', {
      identifier: credentials.identifier,
      remember: credentials.remember,
    })
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
      <LoginForm onSubmit={handleLogin} onSocialLogin={handleSocialLogin} />
    </AuthTemplate>
  )
}
