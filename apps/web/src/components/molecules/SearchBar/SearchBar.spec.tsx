import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('updates search value, toggles tags, and triggers clear all', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onToggleTag = vi.fn()
    const onClearAll = vi.fn()

    render(
      <SearchBar
        value="react"
        onChange={onChange}
        tags={['Front-end', 'React', 'Acessibilidade']}
        selectedTag="Front-end"
        onToggleTag={onToggleTag}
        onClearAll={onClearAll}
      />,
    )

    const input = screen.getByPlaceholderText('Digite o que você procura')
    await user.type(input, 'x')
    expect(onChange).toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'React' }))
    expect(onToggleTag).toHaveBeenCalledWith('React')

    await user.click(screen.getByRole('button', { name: 'Limpar tudo' }))
    expect(onClearAll).toHaveBeenCalledTimes(1)
  })
})
