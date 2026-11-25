import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, it } from 'vitest'
import { expectNoWcagViolations } from '../../test/a11y'
import { RegisterPage } from './RegisterPage'

describe('RegisterPage (WCAG AA)', () => {
  it('has no WCAG AA violations on initial render', async () => {
    const { container } = render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    await expectNoWcagViolations(container)
  })

  it('has no WCAG AA violations when displaying validation errors', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await expectNoWcagViolations(container)
  })
})
