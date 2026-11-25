import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SocialLogin } from './SocialLogin'

describe('SocialLogin', () => {
  it('renders divider label and social provider buttons', () => {
    render(<SocialLogin label="ou entre com outras contas" />)

    expect(screen.getByText('ou entre com outras contas')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Github' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Gmail' })).toBeInTheDocument()
  })

  it('calls onSelect with the chosen provider', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<SocialLogin onSelect={onSelect} />)

    await user.click(screen.getByRole('button', { name: 'Github' }))
    expect(onSelect).toHaveBeenCalledWith('github')

    await user.click(screen.getByRole('button', { name: 'Gmail' }))
    expect(onSelect).toHaveBeenCalledWith('google')
  })
})
