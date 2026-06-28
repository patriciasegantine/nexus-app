import { TASK_STATUS_COLORS, TASK_STATUS_NAMES, TASK_STATUS_PILL_STYLES } from '@/constants/task'
import type { TaskStatus } from '@/types/task'

interface StatusBadgeProps {
  status: TaskStatus
  onClick?: () => void
  hideDot?: boolean
  variant?: 'default' | 'pill'
}

export function StatusBadge({ status, onClick, hideDot = false, variant = 'default' }: StatusBadgeProps) {
  if (variant === 'pill') {
    const pillClass = `inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${TASK_STATUS_PILL_STYLES[status]}`
    if (onClick) {
      return (
        <button type="button" onClick={onClick} className={`${pillClass} transition-opacity hover:opacity-75`}>
          {TASK_STATUS_NAMES[status]}
        </button>
      )
    }
    return <span className={pillClass}>{TASK_STATUS_NAMES[status]}</span>
  }

  const base = 'inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-muted-foreground'
  const content = (
    <>
      {!hideDot && (
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: TASK_STATUS_COLORS[status] }} />
      )}
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

  return <span className={base}>{content}</span>
}
