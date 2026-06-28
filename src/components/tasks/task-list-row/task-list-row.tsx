'use client'

import { TaskTags } from "@/components/tasks/task-tags/task-tags"
import { TASK_PRIORITIES_COLORS, TASK_STATUS_COLORS, TASK_STATUS_NAMES, TASK_PRIORITY_NAMES } from "@/constants/task"
import { TableCell, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AlertTriangle, CalendarDays, Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { format, isBefore, startOfToday } from "date-fns"
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

  const dueDateClass = `inline-flex items-center gap-1 text-xs ${isOverdue ? 'text-amber-600 dark:text-amber-500' : 'text-muted-foreground'}`
  const DueDateIcon = isOverdue ? AlertTriangle : CalendarDays
  const hasActions = onEdit || onDuplicate || onDelete

  return (
    <TableRow className="bg-white dark:bg-card border-b border-border/50 hover:bg-muted/40 dark:hover:bg-muted/20 transition-colors">

      {/* Title + project below */}
      <TableCell className="w-full min-w-[150px]">
        <p className="font-semibold text-sm leading-tight text-foreground line-clamp-2 sm:line-clamp-1">
          {task.title}
        </p>
        {task.project && (
          <p className="text-xs text-muted-foreground/60 truncate mt-0.5">{task.project.name}</p>
        )}
        {dueDate && (
          <div className={`sm:hidden mt-0.5 inline-flex items-center gap-1 text-xs ${isOverdue ? 'text-amber-600 dark:text-amber-500' : 'text-muted-foreground/60'}`}>
            <DueDateIcon className="h-3 w-3 shrink-0" />
            {format(dueDate, 'MMM d')}
          </div>
        )}
      </TableCell>

      {/* Tags — xl+ only */}
      <TableCell className="hidden xl:table-cell w-48">
        <TaskTags taskId={task.id} tags={task.tags} onTagClick={onTagClick} showAll />
      </TableCell>

      {/* Status — plain colored text, all sizes */}
      <TableCell className="w-28 whitespace-nowrap">
        {onStatusClick ? (
          <button
            type="button"
            onClick={() => onStatusClick(task.status)}
            className="text-xs font-semibold hover:opacity-75 transition-opacity"
            style={{ color: statusColor }}
          >
            {TASK_STATUS_NAMES[task.status]}
          </button>
        ) : (
          <span className="text-xs font-semibold" style={{ color: statusColor }}>
            {TASK_STATUS_NAMES[task.status]}
          </span>
        )}
      </TableCell>

      {/* Priority — square + label on all sizes */}
      <TableCell className="w-28 whitespace-nowrap">
        {onPriorityClick ? (
          <button
            type="button"
            onClick={() => onPriorityClick(task.priority)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground rounded px-1.5 py-0.5 transition-colors hover:bg-muted hover:text-foreground"
          >
            <span className="h-2 w-2 shrink-0 rounded-[1px]" style={{ backgroundColor: priorityColor }} />
            {TASK_PRIORITY_NAMES[task.priority]}
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 shrink-0 rounded-[1px]" style={{ backgroundColor: priorityColor }} />
            {TASK_PRIORITY_NAMES[task.priority]}
          </div>
        )}
      </TableCell>

      {/* Due date — sm+ only */}
      <TableCell className="hidden sm:table-cell w-28 whitespace-nowrap text-right">
        {dueDate ? (
          onDueDateClick ? (
            <button type="button" onClick={() => onDueDateClick(dueDate)} className={`${dueDateClass} hover:opacity-75 transition-opacity`}>
              <DueDateIcon className="h-3.5 w-3.5 shrink-0" />
              {format(dueDate, 'MMM d')}
            </button>
          ) : (
            <span className={dueDateClass}>
              <DueDateIcon className="h-3.5 w-3.5 shrink-0" />
              {format(dueDate, 'MMM d')}
            </span>
          )
        ) : (
          <span className="text-xs text-muted-foreground/40">—</span>
        )}
      </TableCell>

      {/* Actions — dropdown below lg, individual buttons on lg+ */}
      <TableCell className="w-10 lg:w-28 text-center lg:text-right">
        {hasActions && (
          <>
            {/* Below lg: dropdown */}
            <div className="lg:hidden flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Task options"
                    className="rounded p-1.5 text-muted-foreground/60 hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
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
                      <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-destructive focus:text-destructive">
                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* lg+: individual buttons with tooltips */}
            <TooltipProvider delayDuration={300}>
              <div className="hidden lg:flex items-center justify-end gap-1">
                {onEdit && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" onClick={onEdit} aria-label="Edit task" className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Edit</TooltipContent>
                  </Tooltip>
                )}
                {onDuplicate && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" onClick={onDuplicate} aria-label="Duplicate task" className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Duplicate</TooltipContent>
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" onClick={onDelete} aria-label="Delete task" className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Delete</TooltipContent>
                  </Tooltip>
                )}
              </div>
            </TooltipProvider>
          </>
        )}
      </TableCell>

    </TableRow>
  )
}
