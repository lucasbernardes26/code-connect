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
    expect(screen.queryByRole('img', { name: 'Code Connect' })).not.toBeInTheDocument()
  })

  it('renders optional brand logo overlay when showBrandLogo is enabled', () => {
    render(
      <AuthTemplate bannerSrc="/banner-cadastro.png" bannerAlt="Banner de cadastro" showBrandLogo>
        <div>Cadastro</div>
      </AuthTemplate>,
    )

    expect(screen.getByRole('img', { name: 'Code Connect' })).toBeInTheDocument()
  })
})
