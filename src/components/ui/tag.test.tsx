import { fireEvent, render, screen } from '@testing-library/react'
import { Tag } from '@/components/ui/tag'

describe('Tag', () => {
  it('renders with # prefix', () => {
    render(<Tag label="frontend" />)
    expect(screen.getByText('#frontend')).toBeInTheDocument()
  })

  it('supports an interactive tag', () => {
    const onClick = jest.fn()

    render(<Tag label="frontend" onClick={onClick} />)
    fireEvent.click(screen.getByRole('button', { name: '#frontend' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('supports removing a tag', () => {
    const onRemove = jest.fn()

    render(<Tag label="frontend" onRemove={onRemove} />)
    fireEvent.click(screen.getByRole('button', { name: 'Remove tag frontend' }))

    expect(onRemove).toHaveBeenCalledTimes(1)
  })
})
