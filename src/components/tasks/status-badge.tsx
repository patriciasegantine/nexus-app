import { TASK_STATUS_NAMES } from '@/constants/task'
import type { TaskStatus } from '@/types/task'

const STATUS_BG: Record<TaskStatus, string> = {
  TODO: 'bg-[hsl(var(--status-todo)/0.15)]',
  IN_PROGRESS: 'bg-[hsl(var(--status-in-progress)/0.15)]',
  DONE: 'bg-[hsl(var(--status-done)/0.15)]',
}

interface StatusBadgeProps {
  status: TaskStatus
  onClick?: () => void
}

export function StatusBadge({ status, onClick }: StatusBadgeProps) {
  const base = `inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BG[status]}`

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} transition-[filter] hover:brightness-95`}>
        {TASK_STATUS_NAMES[status]}
      </button>
    )
  }

  return (
    <span className={base}>
      {TASK_STATUS_NAMES[status]}
    </span>
  )
}
