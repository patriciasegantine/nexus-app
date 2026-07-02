import {
  Archive,
  CheckCircle2,
  CircleDashed,
  Flag,
  PauseCircle,
  PlayCircle,
  type LucideIcon,
} from "lucide-react"
import type { ProjectPriority, ProjectStatus } from "@/types/project"
import { cn } from "@/lib/utils"
import {
  PROJECT_PRIORITY_ACCENT,
  PROJECT_PRIORITY_NAMES,
  PROJECT_STATUS_COLORS,
  PROJECT_STATUS_NAMES,
} from "@/components/projects/project-card/project-card.utils"

const PROJECT_STATUS_ICONS: Record<ProjectStatus, LucideIcon> = {
  PLANNING: CircleDashed,
  ACTIVE: PlayCircle,
  ON_HOLD: PauseCircle,
  COMPLETED: CheckCircle2,
  ARCHIVED: Archive,
}

interface ProjectMetaProps {
  variant?: "plain" | "tag"
}

interface ProjectStatusMetaProps extends ProjectMetaProps {
  status: ProjectStatus
}

interface ProjectPriorityMetaProps extends ProjectMetaProps {
  priority: ProjectPriority | null
}

export function ProjectStatusMeta({ status, variant = "plain" }: ProjectStatusMetaProps) {
  const StatusIcon = PROJECT_STATUS_ICONS[status]

  return (
    <span className={metaClassName(variant)}>
      <StatusIcon className="h-3 w-3 shrink-0" style={{ color: PROJECT_STATUS_COLORS[status] }} />
      {PROJECT_STATUS_NAMES[status]}
    </span>
  )
}

export function ProjectPriorityMeta({ priority, variant = "plain" }: ProjectPriorityMetaProps) {
  if (!priority) {
    return <span className={metaClassName(variant)}>No priority</span>
  }

  return (
    <span className={metaClassName(variant)}>
      <Flag className={cn("h-3 w-3 shrink-0", PROJECT_PRIORITY_ACCENT[priority])} />
      {PROJECT_PRIORITY_NAMES[priority]}
    </span>
  )
}

function metaClassName(variant: ProjectMetaProps["variant"]) {
  return cn(
    "inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-muted-foreground",
    variant === "tag" && "rounded-full border border-border/70 bg-muted/55 px-2 py-0.5"
  )
}
