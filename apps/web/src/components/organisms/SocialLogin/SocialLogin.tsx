import { cn } from '../../../lib/cn'
import { Divider } from '../../atoms/Divider'
import { SocialButton } from '../../molecules/SocialButton'

export type SocialProvider = 'github' | 'google'

const providers: ReadonlyArray<{ id: SocialProvider; label: string; iconSrc: string }> = [
  { id: 'github', label: 'Github', iconSrc: '/github.png' },
  { id: 'google', label: 'Gmail', iconSrc: '/google.png' },
]

export type SocialLoginProps = {
  label?: string
  onSelect?: (provider: SocialProvider) => void
  className?: string
}

/** Social login section with divider and provider buttons. */
export function SocialLogin({
  label = 'ou entre com outras contas',
  onSelect,
  className,
}: SocialLoginProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Divider label={label} />
      <div className="flex items-center justify-center gap-6">
        {providers.map((provider) => (
          <SocialButton
            key={provider.id}
            iconSrc={provider.iconSrc}
            label={provider.label}
            onClick={() => onSelect?.(provider.id)}
          />
        ))}
      </div>
    </div>
  )
}
