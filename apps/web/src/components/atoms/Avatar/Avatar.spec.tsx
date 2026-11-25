import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders image when src is provided and falls back to initials on error', () => {
    render(<Avatar src="/avatars/julio.png" name="Júlio Oliveira" />)

    const img = screen.getByRole('img', { name: 'Avatar de Júlio Oliveira' })
    expect(img).toHaveAttribute('src', '/avatars/julio.png')

    fireEvent.error(img)
    expect(screen.getByRole('img', { name: 'Avatar de Júlio Oliveira' })).toHaveTextContent('JO')
  })

  it('renders initials directly when src is null', () => {
    render(<Avatar src={null} name="Márcia" />)
    expect(screen.getByRole('img', { name: 'Avatar de Márcia' })).toHaveTextContent('MÁ')
  })
})
