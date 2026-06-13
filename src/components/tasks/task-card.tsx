'use client'

import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/tasks/status-badge"
import { PriorityBadge } from "@/components/tasks/priority-badge"
import { TaskTags } from "@/components/tasks/task-tags"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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

        {/* Title + menu */}
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-sm leading-tight line-clamp-2 text-foreground flex-1 min-w-0">
            {task.title}
          </p>

          <DropdownMenu>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="-mr-1 -mt-1 shrink-0 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="Task options"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">Task options</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end" className="w-36">
              {onEdit && (
                <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={onDuplicate} className="cursor-pointer">
                  <Copy className="h-3.5 w-3.5 mr-2" />
                  Duplicate
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  {(onEdit || onDuplicate) && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    onClick={onDelete}
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

        {/* Project + due date */}
        <div className="-mt-1 flex min-h-5 items-center justify-between gap-2">
          {showProject && task.project ? (
            <p className="min-w-0 truncate text-xs text-muted-foreground">
              {task.project.name}
            </p>
          ) : (
            <span />
          )}

          {dueDate && onDueDateClick ? (
            <button
              type="button"
              onClick={() => onDueDateClick(dueDate)}
              className={`flex shrink-0 items-center gap-1 rounded-sm text-xs transition-opacity hover:opacity-75 ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              {format(dueDate, 'MMM d')}
            </button>
          ) : dueDate ? (
            <div className={`flex shrink-0 items-center gap-1 text-xs ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
              <CalendarDays className="h-3.5 w-3.5" />
              {format(dueDate, 'MMM d')}
            </div>
          ) : (
            <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              —
            </div>
          )}
        </div>

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

        {/* Footer: tags */}
        <div className="mt-auto flex min-h-[30px] items-end pt-2">
          <TaskTags taskId={task.id} tags={task.tags} onTagClick={onTagClick} />
        </div>

      </CardContent>
    </Card>
  )
}
