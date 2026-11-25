import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Icon, type IconName } from './Icon'

describe('Icon', () => {
  it.each<IconName>(['arrow-right', 'clipboard', 'check'])(
    'renders decorative SVG for %s',
    (name) => {
      const { container } = render(<Icon name={name} className="text-primary" />)
      const svg = container.querySelector('svg')

      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      expect(svg).toHaveAttribute('data-icon', name)
      expect(svg).toHaveClass('text-primary')
    },
  )
})
