import { AlertTriangle, CalendarDays } from "lucide-react"
import { format } from "date-fns"

interface TaskListRowDueDateProps {
  dueDate: Date | null
  isOverdue: boolean
  onClick?: (dueDate: Date) => void
}

export function TaskListRowDueDate({ dueDate, isOverdue, onClick }: TaskListRowDueDateProps) {
  if (!dueDate) {
    return <span className="text-xs text-muted-foreground/40">—</span>
  }

  const Icon = isOverdue ? AlertTriangle : CalendarDays
  const className = `inline-flex items-center gap-1 text-xs ${isOverdue ? 'text-amber-600 dark:text-amber-500' : 'text-muted-foreground'}`

  if (onClick) {
    return (
      <button type="button" onClick={() => onClick(dueDate)} className={`${className} hover:opacity-75 transition-opacity`}>
        <Icon className="h-3.5 w-3.5 shrink-0" />
        {format(dueDate, 'MMM d')}
      </button>
    )
  }

  return (
    <span className={className}>
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {format(dueDate, 'MMM d')}
    </span>
  )
}
