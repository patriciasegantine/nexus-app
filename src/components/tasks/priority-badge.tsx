import { TASK_PRIORITIES_COLORS, TASK_PRIORITY_NAMES } from '@/constants/task'
import type { TaskPriority } from '@/types/task'

interface PriorityBadgeProps {
  priority: TaskPriority
  onClick?: () => void
}

export function PriorityBadge({ priority, onClick }: PriorityBadgeProps) {
  const content = (
    <>
      <div
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: TASK_PRIORITIES_COLORS[priority] }}
      />
      <span>{TASK_PRIORITY_NAMES[priority]}</span>
    </>
  )
  const base = "flex items-center gap-1.5 text-xs font-medium text-muted-foreground"

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} rounded px-1.5 py-0.5 transition-colors hover:bg-muted hover:text-foreground`}
      >
        {content}
      </button>
    )
  }

  return (
    <div className={base}>{content}</div>
  )
}
