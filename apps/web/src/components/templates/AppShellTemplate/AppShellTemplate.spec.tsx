import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppShellTemplate } from './AppShellTemplate'

describe('AppShellTemplate', () => {
  it('renders brand logo header and main content', () => {
    render(
      <AppShellTemplate>
        <p>Conteúdo principal</p>
      </AppShellTemplate>,
    )

    expect(screen.getByRole('img', { name: 'Code Connect' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveTextContent('Conteúdo principal')
  })
})
