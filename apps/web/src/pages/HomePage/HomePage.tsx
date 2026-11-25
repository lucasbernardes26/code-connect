import { UserProfileCard } from '../../components/organisms/UserProfileCard'
import { useAuth } from '../../hooks/useAuth'

/** Protected profile page displaying the authenticated user's profile from GET /users/me. */
export function HomePage() {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  return <UserProfileCard name={user.name} email={user.email} onLogout={logout} />
}
