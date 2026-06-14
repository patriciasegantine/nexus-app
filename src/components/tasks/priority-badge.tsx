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
      <span className="text-sm">{TASK_PRIORITY_NAMES[priority]}</span>
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1.5 rounded-sm transition-opacity hover:opacity-75"
      >
        {content}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1.5">{content}</div>
  )
}
