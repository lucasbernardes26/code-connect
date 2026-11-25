import { cn } from '../../../lib/cn'

export type AuthHeaderProps = {
  title: string
  subtitle: string
  className?: string
}

/** Header block for authentication forms with title and subtitle. */
export function AuthHeader({ title, subtitle, className }: AuthHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-6', className)}>
      <h1 className="text-3xl leading-normal font-semibold text-offwhite">{title}</h1>
      <p className="text-xl leading-normal text-offwhite">{subtitle}</p>
    </header>
  )
}
