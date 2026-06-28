import { AlertTriangle, CalendarDays } from "lucide-react"
import { format } from "date-fns"

interface TaskListRowTitleProps {
  title: string
  project?: { name: string } | null
  dueDate: Date | null
  isOverdue: boolean
}

export function TaskListRowTitle({ title, project, dueDate, isOverdue }: TaskListRowTitleProps) {
  const DueDateIcon = isOverdue ? AlertTriangle : CalendarDays

  return (
    <>
      <p className="font-semibold text-sm leading-tight text-foreground line-clamp-2 sm:line-clamp-1">
        {title}
      </p>
      {project && (
        <p className="text-xs text-muted-foreground/60 truncate mt-0.5">{project.name}</p>
      )}
      {dueDate && (
        <div className={`sm:hidden mt-0.5 inline-flex items-center gap-1 text-xs ${isOverdue ? 'text-amber-600 dark:text-amber-500' : 'text-muted-foreground/60'}`}>
          <DueDateIcon className="h-3 w-3 shrink-0" />
          {format(dueDate, 'MMM d')}
        </div>
      )}
    </>
  )
}
