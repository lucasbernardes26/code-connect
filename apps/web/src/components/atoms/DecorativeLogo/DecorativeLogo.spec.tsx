import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DecorativeLogo } from './DecorativeLogo'

describe('DecorativeLogo', () => {
  it('renders an aria-hidden SVG with custom className', () => {
    const { container } = render(<DecorativeLogo className="text-deco" />)
    const svg = container.querySelector('svg')

    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveClass('text-deco')
  })
})
