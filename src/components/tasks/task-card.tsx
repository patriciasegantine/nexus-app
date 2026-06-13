'use client'

import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/tasks/status-badge"
import { PriorityBadge } from "@/components/tasks/priority-badge"
import { TaskTags } from "@/components/tasks/task-tags"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Copy, Trash2, CalendarDays } from "lucide-react"
import { format, isBefore, startOfToday } from "date-fns"
import type { TaskCard as TaskCardType } from "@/types/task"

interface TaskCardProps {
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

export function TaskCard({
  task,
  onEdit,
  onDuplicate,
  onDelete,
  onTagClick,
  onStatusClick,
  onPriorityClick,
  onDueDateClick,
  showProject = false,
}: TaskCardProps) {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null
  const isOverdue = dueDate != null && task.status !== 'DONE' && isBefore(dueDate, startOfToday())

  return (
    <Card
      className="group h-full border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md"
    >
      <CardContent className="p-4 flex flex-col h-full gap-3">

        {/* Title + date on same line */}
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-sm leading-tight line-clamp-2 text-foreground flex-1 min-w-0">
            {task.title}
          </p>
          {dueDate && onDueDateClick ? (
            <button
              type="button"
              onClick={() => onDueDateClick?.(dueDate)}
              className={`mt-0.5 flex shrink-0 items-center gap-1 rounded-sm text-xs transition-opacity hover:opacity-75 ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              {format(dueDate, 'MMM d')}
            </button>
          ) : dueDate ? (
            <div className={`mt-0.5 flex shrink-0 items-center gap-1 text-xs ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
              <CalendarDays className="h-3.5 w-3.5" />
              {format(dueDate, 'MMM d')}
            </div>
          ) : (
            <div className="mt-0.5 flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              —
            </div>
          )}
        </div>

        {/* Project name */}
        {showProject && task.project && (
          <p className="text-xs text-muted-foreground -mt-1">{task.project.name}</p>
        )}

        {/* Status + Priority */}
        <div className="flex items-center justify-between gap-2">
          <StatusBadge
            status={task.status}
            onClick={onStatusClick ? () => onStatusClick(task.status) : undefined}
          />
          <PriorityBadge
            priority={task.priority}
            onClick={onPriorityClick ? () => onPriorityClick(task.priority) : undefined}
          />
        </div>

        {/* Footer: tags (left) + ⋮ menu (right) */}
        <div className="mt-auto flex min-h-[30px] items-end justify-between gap-2 pt-2">
          <TaskTags tags={task.tags} onTagClick={onTagClick} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-1 rounded hover:bg-muted shrink-0 -mb-0.5 -mr-1 text-muted-foreground hover:text-foreground"
                onClick={(e) => e.stopPropagation()}
                aria-label="Task options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {onEdit && (
                <DropdownMenuItem
                  onClick={(e) => { e.stopPropagation(); onEdit() }}
                  className="cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem
                  onClick={(e) => { e.stopPropagation(); onDuplicate() }}
                  className="cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5 mr-2" />
                  Duplicate
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  {(onEdit || onDuplicate) && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    onClick={(e) => { e.stopPropagation(); onDelete() }}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </CardContent>
    </Card>
  )
}
