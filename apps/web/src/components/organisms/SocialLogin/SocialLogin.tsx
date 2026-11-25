import { cn } from '../../../lib/cn'
import { Divider } from '../../atoms/Divider'
import { SocialButton } from '../../molecules/SocialButton'

export type SocialProvider = 'github' | 'google'

const providers: ReadonlyArray<{
  id: SocialProvider
  label: string
  iconSrc: string
  iconClassName: string
}> = [
  { id: 'github', label: 'Github', iconSrc: '/social/github.svg', iconClassName: 'h-8 w-8' },
  { id: 'google', label: 'Gmail', iconSrc: '/social/google.svg', iconClassName: 'h-7 w-7' },
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
    <div className={cn('flex flex-col gap-2', className)}>
      <Divider label={label} />
      <div className="flex items-center justify-center gap-6">
        {providers.map((provider) => (
          <SocialButton
            key={provider.id}
            iconSrc={provider.iconSrc}
            iconClassName={provider.iconClassName}
            label={provider.label}
            onClick={() => onSelect?.(provider.id)}
          />
        ))}
      </div>
    </div>
  )
}
