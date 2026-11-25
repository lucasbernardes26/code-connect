import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthHeader } from './AuthHeader'

describe('AuthHeader', () => {
  it('renders heading and subtitle', () => {
    render(<AuthHeader title="Login" subtitle="Boas-vindas! Faça seu login." />)

    expect(screen.getByRole('heading', { level: 1, name: 'Login' })).toBeInTheDocument()
    expect(screen.getByText('Boas-vindas! Faça seu login.')).toBeInTheDocument()
  })
})
