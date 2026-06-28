'use client'

import { Card, CardContent } from "@/components/ui/card"
import { TaskTags } from "@/components/tasks/task-tags/task-tags"
import {
  TASK_STATUS_COLORS,
  TASK_STATUS_NAMES,
  TASK_PRIORITIES_COLORS,
  TASK_PRIORITY_NAMES,
} from "@/constants/task"
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
import { AlertTriangle, CalendarDays, Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { AppRoutes } from "@/constants/routes"
import { format, isBefore, startOfToday } from "date-fns"
import type { TaskCard as TaskCardType } from "@/types/task"

interface TaskCardProps {
  task: TaskCardType & { project?: { id?: string; name: string; slug?: string } | null }
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
  const statusColor = TASK_STATUS_COLORS[task.status]
  const priorityColor = TASK_PRIORITIES_COLORS[task.priority]

  return (
    <Card
      className="group h-full border-l-4 bg-white dark:bg-card border border-border/70 shadow-[0_1px_4px_rgb(0_0_0/0.06)] dark:shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgb(0_0_0/0.10)] dark:hover:shadow-[0_8px_24px_rgb(0_0_0/0.32)]"
      style={{ borderLeftColor: statusColor, borderLeftWidth: '4px' }}
    >
      <CardContent className="p-3 flex flex-col h-full gap-2">

        {/* Title + menu */}
        <div className="flex items-start justify-between gap-2">
          <p className="font-bold text-sm leading-snug tracking-tight line-clamp-2 text-foreground flex-1 min-w-0">
            {task.title}
          </p>

          <DropdownMenu>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="-mr-1 -mt-1 shrink-0 rounded p-1 text-muted-foreground/60 hover:bg-muted hover:text-foreground transition-colors"
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
         
         {/* Status — plain coloured text, no pill */}
        {onStatusClick ? (
          <button
            type="button"
            onClick={() => onStatusClick(task.status)}
            className="text-xs font-semibold w-fit hover:opacity-75 transition-opacity"
            style={{ color: statusColor }}
          >
            {TASK_STATUS_NAMES[task.status]}
          </button>
        ) : (
          <span className="text-xs font-semibold" style={{ color: statusColor }}>
            {TASK_STATUS_NAMES[task.status]}
          </span>
        )}

        {/* Project */}
        {showProject && task.project && (
          task.project.slug ? (
            <Link
              href={`${AppRoutes.DASHBOARD.PROJECTS}/${task.project.slug}`}
              className="text-xs text-muted-foreground/80 truncate hover:text-foreground transition-colors w-fit"
              onClick={(e) => e.stopPropagation()}
            >
              {task.project.name}
            </Link>
          ) : (
            <p className="text-xs text-muted-foreground/80 truncate">{task.project.name}</p>
          )
        )}

        {/* Metadata — auto-pushed to bottom */}
        <div className="mt-auto flex flex-col gap-1 pt-2 border-t border-border/40">

          {/* Date + Priority na mesma linha */}
          <div className="flex items-center justify-between gap-2">
            {dueDate && (
              isOverdue ? (
                onDueDateClick ? (
                  <button
                    type="button"
                    onClick={() => onDueDateClick(dueDate)}
                    className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500 hover:opacity-75 transition-opacity"
                  >
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    <span>Overdue · {format(dueDate, 'MMM d')}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    <span>Overdue · {format(dueDate, 'MMM d')}</span>
                  </div>
                )
              ) : (
                onDueDateClick ? (
                  <button
                    type="button"
                    onClick={() => onDueDateClick(dueDate)}
                    className="flex items-center gap-1 text-xs text-muted-foreground/80 hover:text-foreground transition-colors"
                  >
                    <CalendarDays className="h-3 w-3 shrink-0" />
                    <span>{format(dueDate, 'MMM d')}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
                    <CalendarDays className="h-3 w-3 shrink-0" />
                    <span>{format(dueDate, 'MMM d')}</span>
                  </div>
                )
              )
            )}

            {/* Priority — coloured square + label */}
            {onPriorityClick ? (
              <button
                type="button"
                onClick={() => onPriorityClick(task.priority)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground/80 hover:text-foreground transition-colors ml-auto"
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: priorityColor }} />
                {TASK_PRIORITY_NAMES[task.priority]}
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 ml-auto">
                <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: priorityColor }} />
                {TASK_PRIORITY_NAMES[task.priority]}
              </div>
            )}
          </div>

          <div className="pt-0.5">
            <TaskTags taskId={task.id} tags={task.tags} onTagClick={onTagClick} />
          </div>

        </div>

      </CardContent>
    </Card>
  )
}
