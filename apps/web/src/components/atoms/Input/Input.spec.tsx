import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('renders with placeholder and handles typing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Input placeholder="usuario123" onChange={onChange} />)

    const input = screen.getByPlaceholderText('usuario123')
    await user.type(input, 'lucas')
    expect(input).toHaveValue('lucas')
    expect(onChange).toHaveBeenCalled()
  })

  it('sets aria-invalid when invalid is true', () => {
    render(<Input invalid aria-label="Email" />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('supports disabled state', () => {
    render(<Input disabled aria-label="Email" />)
    expect(screen.getByLabelText('Email')).toBeDisabled()
  })
})
