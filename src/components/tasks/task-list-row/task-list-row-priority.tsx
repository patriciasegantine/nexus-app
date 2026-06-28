import { TASK_PRIORITY_NAMES } from "@/constants/task"
import type { TaskPriority } from "@/types/task"

interface TaskListRowPriorityProps {
  priority: TaskPriority
  color: string
  onClick?: (priority: TaskPriority) => void
}

export function TaskListRowPriority({ priority, color, onClick }: TaskListRowPriorityProps) {
  const content = (
    <>
      <span className="h-2 w-2 shrink-0 rounded-[1px]" style={{ backgroundColor: color }} />
      {TASK_PRIORITY_NAMES[priority]}
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(priority)}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground rounded px-1.5 py-0.5 transition-colors hover:bg-muted hover:text-foreground"
      >
        {content}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      {content}
    </div>
  )
}
