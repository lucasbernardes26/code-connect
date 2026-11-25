import { BrandLogo } from '../../atoms/BrandLogo'
import { Button } from '../../atoms/Button'
import { NavItem } from '../../molecules/NavItem'

export type SidebarNavProps = {
  isAuthenticated: boolean
  onLogout: () => void
  currentPath?: string
  onPublishClick?: () => void
}

/** Responsive navigation menu: vertical sidebar on desktop, top brand + bottom bar on mobile/tablet. */
export function SidebarNav({
  isAuthenticated,
  onLogout,
  currentPath = '/',
  onPublishClick,
}: SidebarNavProps) {
  return (
    <>
      {/* Mobile / Tablet Top Header */}
      <div className="flex w-full items-center justify-between gap-4 lg:hidden">
        <BrandLogo />
        <Button type="button" variant="outline" onClick={onPublishClick}>
          Publicar
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-44 shrink-0 flex-col items-center gap-20 self-stretch rounded-lg bg-surface px-4 py-10 lg:flex">
        <BrandLogo />

        <nav aria-label="Navegação principal" className="flex w-full flex-col items-center gap-10">
          <Button type="button" variant="outline" fullWidth onClick={onPublishClick}>
            Publicar
          </Button>

          <NavItem icon="feed" label="Feed" to="/" active={currentPath === '/'} />

          {isAuthenticated && (
            <NavItem
              icon="account"
              label="Perfil"
              to="/perfil"
              active={currentPath === '/perfil'}
            />
          )}

          <NavItem icon="info" label="Sobre nós" to="/#sobre" />

          {isAuthenticated ? (
            <NavItem icon="logout" label="Sair" onClick={onLogout} />
          ) : (
            <NavItem icon="login" label="Entrar" to="/login" active={currentPath === '/login'} />
          )}
        </nav>
      </aside>

      {/* Mobile / Tablet Bottom Navigation */}
      <nav
        aria-label="Navegação móvel"
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-deco bg-surface px-4 py-3 lg:hidden"
      >
        <NavItem icon="feed" label="Feed" to="/" active={currentPath === '/'} />

        {isAuthenticated && (
          <NavItem
            icon="account"
            label="Perfil"
            to="/perfil"
            active={currentPath === '/perfil'}
          />
        )}

        <NavItem icon="info" label="Sobre nós" to="/#sobre" />

        {isAuthenticated ? (
          <NavItem icon="logout" label="Sair" onClick={onLogout} />
        ) : (
          <NavItem icon="login" label="Entrar" to="/login" active={currentPath === '/login'} />
        )}
      </nav>
    </>
  )
}
