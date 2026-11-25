import { useLocation } from 'react-router'
import { FeedbackBanner } from '../../components/molecules/FeedbackBanner'
import { UserProfileCard } from '../../components/organisms/UserProfileCard'
import { AppShellTemplate } from '../../components/templates/AppShellTemplate'
import { useAuth } from '../../hooks/useAuth'

type HomeLocationState = {
  successMessage?: string
} | null

/** Protected home page displaying the authenticated user's profile from GET /users/me. */
export function HomePage() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const locationState = (location.state as HomeLocationState) ?? null

  if (!user) {
    return null
  }

  return (
    <AppShellTemplate>
      <div className="flex flex-col gap-6">
        {locationState?.successMessage && (
          <FeedbackBanner variant="success" message={locationState.successMessage} />
        )}
        <UserProfileCard name={user.name} email={user.email} onLogout={logout} />
      </div>
    </AppShellTemplate>
  )
}
