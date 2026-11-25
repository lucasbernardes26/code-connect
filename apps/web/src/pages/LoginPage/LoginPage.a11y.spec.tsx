import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, it } from 'vitest'
import { AuthProvider } from '../../contexts/AuthProvider'
import { expectNoWcagViolations } from '../../test/a11y'
import { LoginPage } from './LoginPage'

describe('LoginPage (WCAG AA)', () => {
  it('has no WCAG AA violations on initial render', async () => {
    const { container } = render(
      <AuthProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>,
    )

    await expectNoWcagViolations(container)
  })

  it('has no WCAG AA violations when displaying validation errors', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <AuthProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Login' }))

    await expectNoWcagViolations(container)
  })
})
