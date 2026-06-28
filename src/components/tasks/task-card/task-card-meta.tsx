import { TaskTags } from "@/components/tasks/task-tags/task-tags"
import { TASK_PRIORITY_NAMES } from "@/constants/task"
import { AlertTriangle, CalendarDays } from "lucide-react"
import { format } from "date-fns"
import type { TaskPriority } from "@/types/task"

interface TaskCardMetaProps {
  taskId: string
  tags: string[]
  priority: TaskPriority
  priorityColor: string
  dueDate: Date | null
  isOverdue: boolean
  onTagClick?: (tag: string) => void
  onPriorityClick?: (priority: TaskPriority) => void
  onDueDateClick?: (dueDate: Date) => void
}

export function TaskCardMeta({
  taskId,
  tags,
  priority,
  priorityColor,
  dueDate,
  isOverdue,
  onTagClick,
  onPriorityClick,
  onDueDateClick,
}: TaskCardMetaProps) {
  return (
    <div className="mt-auto flex flex-col gap-1 pt-2 border-t border-border/40">

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

        {onPriorityClick ? (
          <button
            type="button"
            onClick={() => onPriorityClick(priority)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground/80 hover:text-foreground transition-colors ml-auto"
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: priorityColor }} />
            {TASK_PRIORITY_NAMES[priority]}
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 ml-auto">
            <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: priorityColor }} />
            {TASK_PRIORITY_NAMES[priority]}
          </div>
        )}
      </div>

      <div className="pt-0.5">
        <TaskTags taskId={taskId} tags={tags} onTagClick={onTagClick} />
      </div>

    </div>
  )
}
