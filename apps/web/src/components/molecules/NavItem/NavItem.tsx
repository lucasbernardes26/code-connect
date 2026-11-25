import { Link } from 'react-router'
import { cn } from '../../../lib/cn'
import { Icon, type IconName } from '../../atoms/Icon'

export type NavItemProps = {
  icon: IconName
  label: string
  to?: string
  active?: boolean
  onClick?: () => void
  className?: string
}

/** Navigation item with icon and label for desktop sidebar and mobile bottom bar. */
export function NavItem({
  icon,
  label,
  to,
  active = false,
  onClick,
  className,
}: NavItemProps) {
  const sharedClass = cn(
    'flex flex-col items-center justify-center gap-2 rounded-lg px-4 py-2 text-center transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    active ? 'text-offwhite' : 'text-field hover:text-offwhite',
    className,
  )

  const content = (
    <>
      <Icon name={icon} className="h-8 w-8" />
      <span className="text-base leading-normal lg:text-xl">{label}</span>
    </>
  )

  if (to) {
    return (
      <Link to={to} aria-current={active ? 'page' : undefined} className={sharedClass}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={cn('cursor-pointer', sharedClass)}>
      {content}
    </button>
  )
}
