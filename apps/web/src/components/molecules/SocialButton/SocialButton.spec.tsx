import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SocialButton } from './SocialButton'

describe('SocialButton', () => {
  it('renders provider label and icon and triggers onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<SocialButton iconSrc="/social/github.svg" label="Github" onClick={onClick} />)

    const button = screen.getByRole('button', { name: 'Github' })
    expect(button).toBeInTheDocument()

    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
