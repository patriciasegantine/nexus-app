import { TASK_STATUS_COLORS, TASK_STATUS_NAMES } from '@/constants/task'
import type { TaskStatus } from '@/types/task'

interface StatusBadgeProps {
  status: TaskStatus
  onClick?: () => void
}

export function StatusBadge({ status, onClick }: StatusBadgeProps) {
  const base = 'inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-muted-foreground'
  const content = (
    <>
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: TASK_STATUS_COLORS[status] }} />
      {TASK_STATUS_NAMES[status]}
    </>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} rounded px-1.5 py-0.5 transition-colors hover:bg-muted hover:text-foreground`}>
        {content}
      </button>
    )
  }

  return (
    <span className={base}>
      {content}
    </span>
  )
}
