import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders label and optional icon', () => {
    render(<Button icon={<span data-testid="btn-icon">→</span>}>Login</Button>)

    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByTestId('btn-icon')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Entrar</Button>)

    await user.click(screen.getByRole('button', { name: /entrar/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not trigger onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Entrar
      </Button>,
    )

    const button = screen.getByRole('button', { name: /entrar/i })
    expect(button).toBeDisabled()
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies variant and fullWidth classes', () => {
    render(
      <Button variant="ghost" fullWidth>
        Cancelar
      </Button>,
    )

    const button = screen.getByRole('button', { name: /cancelar/i })
    expect(button).toHaveClass('bg-transparent', 'w-full')
  })
})
