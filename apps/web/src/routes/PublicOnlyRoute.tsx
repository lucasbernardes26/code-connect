import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth'

/** Redirects already authenticated users away from public auth pages to /. */
export function PublicOnlyRoute() {
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

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
