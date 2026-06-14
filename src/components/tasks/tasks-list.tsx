'use client'

import { TaskCard } from "@/components/tasks/task-card"
import type { TaskListItem } from "@/types/task"

interface TasksListProps {
  tasks: TaskListItem[]
  onEdit?: (task: TaskListItem) => void
  onDuplicate?: (task: TaskListItem) => void
  onDelete?: (task: TaskListItem) => void
  onTagClick?: (tag: string) => void
  onStatusClick?: (status: TaskListItem["status"]) => void
  onPriorityClick?: (priority: TaskListItem["priority"]) => void
  onDueDateClick?: (dueDate: Date) => void
}

export function TasksList({
  tasks,
  onEdit,
  onDuplicate,
  onDelete,
  onTagClick,
  onStatusClick,
  onPriorityClick,
  onDueDateClick,
}: TasksListProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {tasks?.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          showProject={true}
          onEdit={() => onEdit?.(task)}
          onDuplicate={() => onDuplicate?.(task)}
          onDelete={() => onDelete?.(task)}
          onTagClick={onTagClick}
          onStatusClick={onStatusClick}
          onPriorityClick={onPriorityClick}
          onDueDateClick={onDueDateClick}
        />
      ))}
    </div>
  )
}
