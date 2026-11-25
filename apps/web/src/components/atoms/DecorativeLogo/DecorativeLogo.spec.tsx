import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DecorativeLogo } from './DecorativeLogo'

describe('DecorativeLogo', () => {
  it('renders an aria-hidden decorative mark with exported SVG parts', () => {
    const { container } = render(<DecorativeLogo className="right-36 bottom-0" />)
    const wrapper = container.firstElementChild

    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute('aria-hidden', 'true')
    expect(wrapper).toHaveClass('right-36', 'bottom-0')

    const images = container.querySelectorAll('img')
    expect(images).toHaveLength(2)
    expect(images[0]).toHaveAttribute('src', '/decorative/symbol-a.svg')
    expect(images[1]).toHaveAttribute('src', '/decorative/symbol-b.svg')
  })
})
