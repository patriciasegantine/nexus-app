import { TASK_STATUS_NAMES } from "@/constants/task"
import type { TaskStatus } from "@/types/task"

interface TaskCardStatusProps {
  status: TaskStatus
  color: string
  onClick?: (status: TaskStatus) => void
}

export function TaskCardStatus({ status, color, onClick }: TaskCardStatusProps) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(status)}
        className="text-xs font-semibold w-fit hover:opacity-75 transition-opacity"
        style={{ color }}
      >
        {TASK_STATUS_NAMES[status]}
      </button>
    )
  }

  return (
    <span className="text-xs font-semibold" style={{ color }}>
      {TASK_STATUS_NAMES[status]}
    </span>
  )
}
