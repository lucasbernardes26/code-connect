import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders label and toggles on click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox id="remember" label="Lembrar-me" checked={false} onChange={onChange} />)

    const checkbox = screen.getByRole('checkbox', { name: 'Lembrar-me' })
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('reflects checked state', () => {
    render(<Checkbox id="remember" label="Lembrar-me" checked onChange={() => {}} />)
    expect(screen.getByRole('checkbox', { name: 'Lembrar-me' })).toBeChecked()
  })
})
