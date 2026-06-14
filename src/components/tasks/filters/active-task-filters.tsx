import { format, isValid, parseISO } from "date-fns"
import { X } from "lucide-react"
import { TASK_PRIORITY_NAMES, TASK_STATUS_NAMES } from "@/constants/task"
import type { TaskPriority, TaskStatus } from "@/types/task"
import type { Project } from "@/types/project"

const DUE_DATE_LABELS: Record<string, string> = {
  overdue: "Overdue",
  today: "Due today",
  this_week: "Due this week",
  no_due_date: "No due date",
}

interface ActiveTaskFiltersProps {
  status: string
  priority: string
  projectId: string
  dueDate: string
  dueDateExact: string
  tag: string
  projects: Project[]
  onRemove: (key: string) => void
}

export function ActiveTaskFilters({
  status,
  priority,
  projectId,
  dueDate,
  dueDateExact,
  tag,
  projects,
  onRemove,
}: ActiveTaskFiltersProps) {
  const projectName = projects.find((project) => project.id === projectId)?.name
  const exactDate = dueDateExact ? parseISO(dueDateExact) : null
  const filters = [
    status && { key: "status", label: TASK_STATUS_NAMES[status as TaskStatus] ?? status },
    priority && { key: "priority", label: TASK_PRIORITY_NAMES[priority as TaskPriority] ?? priority },
    projectId && { key: "projectId", label: projectName ?? "Project" },
    dueDate && { key: "dueDate", label: DUE_DATE_LABELS[dueDate] ?? dueDate },
    exactDate && isValid(exactDate) && {
      key: "dueDateExact",
      label: `Due ${format(exactDate, "MMM d, yyyy")}`,
    },
    tag && { key: "tag", label: `#${tag}` },
  ].filter((filter): filter is { key: string; label: string } => Boolean(filter))

  if (filters.length === 0) return null

  return (
    <div className="flex w-full flex-wrap items-center gap-1.5 pt-1">
      {filters.map((filter) => (
        <button
          key={filter.key}
          type="button"
          onClick={() => onRemove(filter.key)}
          className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={`Remove ${filter.label} filter`}
        >
          {filter.label}
          <X className="h-3 w-3" />
        </button>
      ))}
    </div>
  )
}
