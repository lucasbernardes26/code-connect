import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthTemplate } from './AuthTemplate'

describe('AuthTemplate', () => {
  it('renders banner image with alt text and children slot', () => {
    render(
      <AuthTemplate bannerSrc="/banner.png" bannerAlt="Banner de login">
        <div>Formulário</div>
      </AuthTemplate>,
    )

    const banner = screen.getByRole('img', { name: 'Banner de login' })
    expect(banner).toHaveAttribute('src', '/banner.png')
    expect(screen.getByText('Formulário')).toBeInTheDocument()
  })
})
