import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth'

/** Guards private routes, redirecting unauthenticated visitors to /login. */
export function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-screen items-center justify-center bg-ink px-6 text-offwhite"
      >
        Carregando sessão...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
