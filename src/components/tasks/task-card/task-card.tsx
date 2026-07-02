'use client'

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { TASK_STATUS_COLORS, TASK_PRIORITIES_COLORS } from "@/constants/task"
import { TaskActionsMenu } from "@/components/tasks/task-actions-menu"
import { TaskCardMeta } from "@/components/tasks/task-card/task-card-meta"
import { TaskCardStatus } from "@/components/tasks/task-card/task-card-status"
import { TaskCardProject } from "@/components/tasks/task-card/task-card-project"
import { isBefore, startOfToday } from "date-fns"
import { cn } from "@/lib/utils"
import type { TaskCard as TaskCardType } from "@/types/task"

interface TaskCardProps {
  task: TaskCardType & { project?: { id?: string; name: string; slug?: string } | null }
  onEdit?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
  onTagClick?: (tag: string) => void
  onStatusClick?: (status: TaskCardType["status"]) => void
  onPriorityClick?: (priority: TaskCardType["priority"]) => void
  onDueDateClick?: (dueDate: Date) => void
  showProject?: boolean
  /** On small screens, collapse to just the title until tapped. No effect at md+. */
  collapsible?: boolean
}

export function TaskCard({
  task,
  onEdit,
  onDuplicate,
  onDelete,
  onTagClick,
  onStatusClick,
  onPriorityClick,
  onDueDateClick,
  showProject = false,
  collapsible = false,
}: TaskCardProps) {
  const [expanded, setExpanded] = useState(false)
  const dueDate = task.dueDate ? new Date(task.dueDate) : null
  const isOverdue = dueDate != null && task.status !== 'DONE' && isBefore(dueDate, startOfToday())
  const statusColor = TASK_STATUS_COLORS[task.status]
  const priorityColor = TASK_PRIORITIES_COLORS[task.priority]

  return (
    <Card
      className="group group/row h-full border-l-4 bg-white dark:bg-card border border-border/70 shadow-[0_1px_4px_rgb(0_0_0/0.06)] dark:shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgb(0_0_0/0.10)] dark:hover:shadow-[0_8px_24px_rgb(0_0_0/0.32)]"
      style={{ borderLeftColor: statusColor, borderLeftWidth: '4px' }}
    >
      <CardContent className="p-3 flex flex-col h-full gap-2">

        <div className="flex items-start justify-between gap-2">
          {collapsible ? (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
              className="flex flex-1 min-w-0 items-start gap-1 text-left"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 mt-0.5 shrink-0 text-muted-foreground/60 transition-transform md:hidden",
                  expanded && "rotate-180"
                )}
              />
              <p className="font-bold text-sm leading-snug tracking-tight line-clamp-2 text-foreground flex-1 min-w-0">
                {task.title}
              </p>
            </button>
          ) : (
            <p className="font-bold text-sm leading-snug tracking-tight line-clamp-2 text-foreground flex-1 min-w-0">
              {task.title}
            </p>
          )}
          <TaskActionsMenu
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            triggerClassName="-mr-1 -mt-1 shrink-0 rounded p-1 text-muted-foreground/60 hover:bg-muted hover:text-foreground transition-colors"
          />
        </div>

        <div className={cn("flex flex-col gap-2", collapsible && !expanded && "hidden md:flex")}>
          <TaskCardStatus status={task.status} color={statusColor} onClick={onStatusClick} />

          {showProject && task.project && (
            <TaskCardProject project={task.project} />
          )}

          <TaskCardMeta
            taskId={task.id}
            tags={task.tags}
            priority={task.priority}
            priorityColor={priorityColor}
            dueDate={dueDate}
            isOverdue={isOverdue}
            onTagClick={onTagClick}
            onPriorityClick={onPriorityClick}
            onDueDateClick={onDueDateClick}
          />
        </div>

      </CardContent>
    </Card>
  )
}
