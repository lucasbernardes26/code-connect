import type { ReactNode } from 'react'
import { cn } from '../../../lib/cn'
import { Icon } from '../../atoms/Icon'
import { TextLink } from '../../atoms/TextLink'

export type AuthPromptProps = {
  question: string
  linkLabel: string
  to: string
  icon?: ReactNode
  className?: string
}

/** Secondary navigation prompt below authentication forms. */
export function AuthPrompt({
  question,
  linkLabel,
  to,
  icon = <Icon name="clipboard" />,
  className,
}: AuthPromptProps) {
  return (
    <div className={cn('flex flex-col items-center gap-1.5 text-center', className)}>
      <p className="text-xs text-muted">{question}</p>
      <TextLink to={to} variant="primary" icon={icon} className="text-sm font-medium">
        {linkLabel}
      </TextLink>
    </div>
  )
}
