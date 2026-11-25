import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PostCover } from './PostCover'

describe('PostCover', () => {
  it('renders cover image and switches to placeholder when image fails to load', () => {
    render(<PostCover src="/posts/broken.png" alt="Post React" />)

    const img = screen.getByRole('img', { name: 'Post React' })
    expect(img).toHaveAttribute('src', '/posts/broken.png')

    fireEvent.error(img)
    expect(screen.getByText('Prévia indisponível')).toBeInTheDocument()
  })

  it('renders placeholder directly when src is null', () => {
    render(<PostCover src={null} alt="Post sem capa" />)

    expect(screen.getByText('Prévia indisponível')).toBeInTheDocument()
  })
})
