import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Divider } from './Divider'

describe('Divider', () => {
  it('renders a plain separator when no label is provided', () => {
    render(<Divider />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('renders centered label text when provided', () => {
    render(<Divider label="ou entre com outras contas" />)
    expect(screen.getByRole('separator', { name: /ou entre com outras contas/i })).toBeInTheDocument()
    expect(screen.getByText('ou entre com outras contas')).toBeInTheDocument()
  })
})
