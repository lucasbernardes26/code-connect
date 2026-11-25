import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Tag } from './Tag'

describe('Tag', () => {
  it('renders static label', () => {
    render(<Tag label="React" />)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('triggers onClick and exposes pressed state when interactive', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Tag label="Front-end" active removable onClick={onClick} />)

    const button = screen.getByRole('button', { name: 'Front-end' })
    expect(button).toHaveAttribute('aria-pressed', 'true')
    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
