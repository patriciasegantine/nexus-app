import { fireEvent, render, screen } from '@testing-library/react'
import { TaskCard } from '@/components/tasks/task-card/task-card'
import type { TaskCard as TaskCardType } from '@/types/task'

jest.mock('@/actions/tasks', () => ({
  addTaskTag: jest.fn(),
}))

class ResizeObserverMock {
  constructor(callback: ResizeObserverCallback) {
    void callback
  }
  observe(target: Element) {
    void target
  }
  unobserve(target: Element) {
    void target
  }
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock

const task: TaskCardType = {
  id: 'task-1',
  title: 'Prepare launch notes',
  description: null,
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  tags: [],
  dueDate: new Date(2026, 5, 13),
}

describe('TaskCard filters', () => {
  it('filters from card metadata without opening edit', () => {
    const onEdit = jest.fn()
    const onStatusClick = jest.fn()
    const onPriorityClick = jest.fn()
    const onDueDateClick = jest.fn()

    render(
      <TaskCard
        task={task}
        onEdit={onEdit}
        onStatusClick={onStatusClick}
        onPriorityClick={onPriorityClick}
        onDueDateClick={onDueDateClick}
      />,
    )

    fireEvent.click(screen.getByText('Prepare launch notes'))
    fireEvent.click(screen.getByRole('button', { name: 'In Progress' }))
    fireEvent.click(screen.getByRole('button', { name: 'High' }))
    fireEvent.click(screen.getByRole('button', { name: /Jun 13/ }))

    expect(onEdit).not.toHaveBeenCalled()
    expect(onStatusClick).toHaveBeenCalledWith('IN_PROGRESS')
    expect(onPriorityClick).toHaveBeenCalledWith('HIGH')
    expect(onDueDateClick).toHaveBeenCalledWith(task.dueDate)
  })

  it('shows quick tag creation only below the tag limit', () => {
    const { rerender } = render(<TaskCard task={task} />)

    expect(screen.getByRole('button', { name: 'Add tag' })).toBeInTheDocument()

    rerender(
      <TaskCard
        task={{ ...task, tags: ['one', 'two', 'three', 'four', 'five'] }}
      />,
    )

    expect(screen.queryByRole('button', { name: 'Add tag' })).not.toBeInTheDocument()
  })
})
