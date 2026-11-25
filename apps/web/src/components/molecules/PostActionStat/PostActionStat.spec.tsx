import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PostActionStat } from './PostActionStat'

describe('PostActionStat', () => {
  it('renders count and triggers onClick when enabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<PostActionStat icon="heart" count={12} label="Curtir post" active onClick={onClick} />)

    const button = screen.getByRole('button', { name: 'Curtir post: 12' })
    expect(button).toHaveAttribute('aria-pressed', 'true')
    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('respects disabled state without firing onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <PostActionStat
        icon="chat"
        count={3}
        label="Comentar"
        disabled
        title="Faça login para comentar"
        onClick={onClick}
      />,
    )

    const button = screen.getByRole('button', { name: 'Comentar: 3' })
    expect(button).toBeDisabled()
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})
