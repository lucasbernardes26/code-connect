import { Button } from '../../atoms/Button'
import { Icon } from '../../atoms/Icon'

export type UserProfileCardProps = {
  name: string
  email: string
  onLogout: () => void
}

/** Displays the authenticated user's profile summary and logout action. */
export function UserProfileCard({ name, email, onLogout }: UserProfileCardProps) {
  return (
    <section
      aria-labelledby="profile-heading"
      className="flex flex-col gap-6 rounded-2xl border border-deco bg-surface p-8"
    >
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold tracking-wider text-primary uppercase">
          Sessão ativa
        </span>
        <h1 id="profile-heading" className="text-3xl leading-tight font-semibold text-offwhite">
          Olá, {name}
        </h1>
        <p className="text-sm text-muted">
          Autenticado com o e-mail <span className="font-medium text-offwhite">{email}</span>
        </p>
      </div>

      <div className="flex items-center justify-end">
        <Button type="button" variant="ghost" onClick={onLogout} icon={<Icon name="login" />}>
          Sair
        </Button>
      </div>
    </section>
  )
}
