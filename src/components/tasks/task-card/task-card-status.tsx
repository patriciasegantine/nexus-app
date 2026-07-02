import {
  CheckCircle2,
  CircleDashed,
  PlayCircle,
  type LucideIcon,
} from "lucide-react"
import { TASK_STATUS_NAMES } from "@/constants/task"
import type { TaskStatus } from "@/types/task"

const TASK_STATUS_ICONS: Record<TaskStatus, LucideIcon> = {
  TODO: CircleDashed,
  IN_PROGRESS: PlayCircle,
  DONE: CheckCircle2,
}

interface TaskCardStatusProps {
  status: TaskStatus
  color: string
  onClick?: (status: TaskStatus) => void
}

export function TaskCardStatus({ status, color, onClick }: TaskCardStatusProps) {
  const StatusIcon = TASK_STATUS_ICONS[status]
  const content = (
    <>
      <StatusIcon className="h-3 w-3 shrink-0" style={{ color }} />
      {TASK_STATUS_NAMES[status]}
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(status)}
        className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {content}
      </button>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-muted-foreground">
      {content}
    </span>
  )
}
