'use client'

import { TaskTags } from "@/components/tasks/task-tags/task-tags"
import { TASK_PRIORITIES_COLORS, TASK_STATUS_COLORS } from "@/constants/task"
import { TableCell, TableRow } from "@/components/ui/table"
import { TaskCardStatus } from "@/components/tasks/task-card/task-card-status"
import { TaskListRowTitle } from "@/components/tasks/task-list-row/task-list-row-title"
import { TaskListRowPriority } from "@/components/tasks/task-list-row/task-list-row-priority"
import { TaskListRowDueDate } from "@/components/tasks/task-list-row/task-list-row-due-date"
import { TaskListRowActions } from "@/components/tasks/task-list-row/task-list-row-actions"
import { isBefore, startOfToday } from "date-fns"
import type { TaskCard as TaskCardType } from "@/types/task"

interface TaskListRowProps {
  task: TaskCardType & { project?: { id?: string; name: string } | null }
  onEdit?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
  onTagClick?: (tag: string) => void
  onStatusClick?: (status: TaskCardType["status"]) => void
  onPriorityClick?: (priority: TaskCardType["priority"]) => void
  onDueDateClick?: (dueDate: Date) => void
  showProject?: boolean
}

export function TaskListRow({
  task,
  onEdit,
  onDuplicate,
  onDelete,
  onTagClick,
  onStatusClick,
  onPriorityClick,
  onDueDateClick,
}: TaskListRowProps) {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null
  const isOverdue = dueDate != null && task.status !== 'DONE' && isBefore(dueDate, startOfToday())
  const statusColor = TASK_STATUS_COLORS[task.status]
  const priorityColor = TASK_PRIORITIES_COLORS[task.priority]

  return (
    <TableRow className="bg-white dark:bg-card border-b border-border/50 hover:bg-muted/40 dark:hover:bg-muted/20 transition-colors">

      <TableCell className="w-full min-w-[150px]">
        <TaskListRowTitle
          title={task.title}
          project={task.project}
          dueDate={dueDate}
          isOverdue={isOverdue}
        />
      </TableCell>

      <TableCell className="hidden xl:table-cell w-48">
        <TaskTags taskId={task.id} tags={task.tags} onTagClick={onTagClick} showAll />
      </TableCell>

      <TableCell className="w-28 whitespace-nowrap">
        <TaskCardStatus status={task.status} color={statusColor} onClick={onStatusClick} />
      </TableCell>

      <TableCell className="w-28 whitespace-nowrap">
        <TaskListRowPriority priority={task.priority} color={priorityColor} onClick={onPriorityClick} />
      </TableCell>

      <TableCell className="hidden sm:table-cell w-28 whitespace-nowrap text-right">
        <TaskListRowDueDate dueDate={dueDate} isOverdue={isOverdue} onClick={onDueDateClick} />
      </TableCell>

      <TableCell className="w-10 lg:w-28 text-center lg:text-right">
        <TaskListRowActions onEdit={onEdit} onDuplicate={onDuplicate} onDelete={onDelete} />
      </TableCell>

    </TableRow>
  )
}
