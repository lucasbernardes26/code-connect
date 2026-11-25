import type { ReactNode } from 'react'
import { cn } from '../../../lib/cn'
import { Icon } from '../../atoms/Icon'
import { TextLink } from '../../atoms/TextLink'

const layouts = {
  stacked: {
    root: 'flex-col items-center gap-2 text-center',
    question: 'text-sm leading-normal text-offwhite',
  },
  inline: {
    root: 'flex-row flex-wrap items-center gap-2',
    question: 'text-lg leading-normal text-offwhite',
  },
} as const

export type AuthPromptProps = {
  question: string
  linkLabel: string
  to: string
  icon?: ReactNode
  layout?: keyof typeof layouts
  className?: string
}

/** Secondary navigation prompt below authentication forms. */
export function AuthPrompt({
  question,
  linkLabel,
  to,
  icon = <Icon name="clipboard" />,
  layout = 'stacked',
  className,
}: AuthPromptProps) {
  const styles = layouts[layout]

  return (
    <div className={cn('flex', styles.root, className)}>
      <p className={styles.question}>{question}</p>
      <TextLink
        to={to}
        variant="primary"
        icon={icon}
        className="gap-3 text-lg leading-normal font-normal"
      >
        {linkLabel}
      </TextLink>
    </div>
  )
}
