import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Label } from './Label'

describe('Label', () => {
  it('renders text and associates with htmlFor', () => {
    render(
      <>
        <Label htmlFor="email-input">Email ou usuário</Label>
        <input id="email-input" />
      </>,
    )

    expect(screen.getByLabelText('Email ou usuário')).toBeInTheDocument()
  })
})
