import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FeedTabs } from './FeedTabs'

describe('FeedTabs', () => {
  it('marks active tab and notifies on tab selection', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<FeedTabs activeTab="recent" onChange={onChange} />)

    expect(screen.getByRole('tab', { name: 'Recentes' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Populares' })).toHaveAttribute('aria-selected', 'false')

    await user.click(screen.getByRole('tab', { name: 'Populares' }))
    expect(onChange).toHaveBeenCalledWith('popular')
  })
})
