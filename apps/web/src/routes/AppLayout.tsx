import { Outlet, useLocation, useNavigate } from 'react-router'
import { SidebarNav } from '../components/organisms/SidebarNav'
import { AppShellTemplate } from '../components/templates/AppShellTemplate'
import { useAuth } from '../hooks/useAuth'

/** Shared route layout connecting session state to SidebarNav and AppShellTemplate. */
export function AppLayout() {
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  function handlePublishClick() {
    if (!isAuthenticated) {
      void navigate('/login')
    }
  }

  return (
    <AppShellTemplate
      sidebar={
        <SidebarNav
          isAuthenticated={isAuthenticated}
          onLogout={logout}
          currentPath={location.pathname}
          onPublishClick={handlePublishClick}
        />
      }
    >
      <Outlet />
    </AppShellTemplate>
  )
}
