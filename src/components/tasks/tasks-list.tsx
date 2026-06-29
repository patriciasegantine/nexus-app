'use client'

import { TaskCard } from "@/components/tasks/task-card/task-card"
import { TaskListRow } from "@/components/tasks/task-list-row/task-list-row"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { TaskListItem } from "@/types/task"
import type { TaskViewOption } from "@/constants/preferences"

interface TasksListProps {
  tasks: TaskListItem[]
  view?: TaskViewOption
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
  view = "cards",
  onEdit,
  onDuplicate,
  onDelete,
  onTagClick,
  onStatusClick,
  onPriorityClick,
  onDueDateClick,
}: TasksListProps) {
  const sharedProps = (task: TaskListItem) => ({
    task,
    showProject: true,
    onEdit: onEdit ? () => onEdit(task) : undefined,
    onDuplicate: onDuplicate ? () => onDuplicate(task) : undefined,
    onDelete: onDelete ? () => onDelete(task) : undefined,
    onTagClick,
    onStatusClick,
    onPriorityClick,
    onDueDateClick,
  })

  if (view === "list") {
    return (
      <div className="rounded-lg border border-border overflow-hidden shadow-sm">
        <Table className="table-fixed">
          <TableHeader className="bg-white dark:bg-card">
            <TableRow className="hover:bg-white dark:hover:bg-card border-b-2 border-border">
              <TableHead className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Title / Project</TableHead>
              <TableHead className="hidden xl:table-cell w-48 text-xs font-semibold text-foreground/70 uppercase tracking-wide">Tags</TableHead>
              <TableHead className="hidden sm:table-cell w-28 text-xs font-semibold text-foreground/70 uppercase tracking-wide">Status</TableHead>
              <TableHead className="hidden sm:table-cell w-28 text-xs font-semibold text-foreground/70 uppercase tracking-wide">Priority</TableHead>
              <TableHead className="w-28 text-right text-xs font-semibold text-foreground/70 uppercase tracking-wide">Due date</TableHead>
              <TableHead className="w-14 lg:w-28" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks?.map((task) => (
              <TaskListRow key={task.id} {...sharedProps(task)} />
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {tasks?.map((task) => (
        <TaskCard key={task.id} {...sharedProps(task)} />
      ))}
    </div>
  )
}
