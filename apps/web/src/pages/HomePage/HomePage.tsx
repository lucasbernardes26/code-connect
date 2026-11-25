import { UserProfileCard } from '../../components/organisms/UserProfileCard'
import { AppShellTemplate } from '../../components/templates/AppShellTemplate'
import { useAuth } from '../../hooks/useAuth'

/** Protected home page displaying the authenticated user's profile from GET /users/me. */
export function HomePage() {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  return (
    <AppShellTemplate>
      <UserProfileCard name={user.name} email={user.email} onLogout={logout} />
    </AppShellTemplate>
  )
}
