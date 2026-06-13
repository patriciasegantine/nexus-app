import { fireEvent, render, screen } from '@testing-library/react'
import { TaskCard } from '@/components/tasks/task-card'
import type { TaskCard as TaskCardType } from '@/types/task'

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
    fireEvent.click(screen.getByRole('button', { name: 'Jun 13' }))

    expect(onEdit).not.toHaveBeenCalled()
    expect(onStatusClick).toHaveBeenCalledWith('IN_PROGRESS')
    expect(onPriorityClick).toHaveBeenCalledWith('HIGH')
    expect(onDueDateClick).toHaveBeenCalledWith(task.dueDate)
  })
})
