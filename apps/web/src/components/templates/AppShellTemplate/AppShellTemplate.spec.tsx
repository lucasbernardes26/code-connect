import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppShellTemplate } from './AppShellTemplate'

describe('AppShellTemplate', () => {
  it('renders sidebar slot and main content', () => {
    render(
      <AppShellTemplate sidebar={<aside aria-label="Menu lateral">Sidebar</aside>}>
        <p>Conteúdo principal</p>
      </AppShellTemplate>,
    )

    expect(screen.getByLabelText('Menu lateral')).toHaveTextContent('Sidebar')
    expect(screen.getByRole('main')).toHaveTextContent('Conteúdo principal')
  })
})
