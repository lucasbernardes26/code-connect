import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BrandLogo } from './BrandLogo'

describe('BrandLogo', () => {
  it('renders accessible brand logo with exported SVG parts', () => {
    const { container } = render(<BrandLogo className="mx-auto" />)

    const logo = screen.getByRole('img', { name: 'Code Connect' })
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveClass('mx-auto')

    const images = container.querySelectorAll('img')
    expect(images).toHaveLength(3)
    expect(images[0]).toHaveAttribute('src', '/logo/logo-mark-a.svg')
    expect(images[1]).toHaveAttribute('src', '/logo/logo-mark-b.svg')
    expect(images[2]).toHaveAttribute('src', '/logo/logo-text.svg')
  })
})
