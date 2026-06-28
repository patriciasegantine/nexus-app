'use client'

import { TaskActionsMenu } from "@/components/tasks/task-actions-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Copy, Pencil, Trash2 } from "lucide-react"

interface TaskListRowActionsProps {
  onEdit?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
}

export function TaskListRowActions({ onEdit, onDuplicate, onDelete }: TaskListRowActionsProps) {
  if (!onEdit && !onDuplicate && !onDelete) return null

  return (
    <>
      <div className="lg:hidden flex justify-center">
        <TaskActionsMenu onEdit={onEdit} onDuplicate={onDuplicate} onDelete={onDelete} />
      </div>

      <TooltipProvider delayDuration={300}>
        <div className="hidden lg:flex items-center justify-end gap-1">
          {onEdit && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" onClick={onEdit} aria-label="Edit task" className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Edit</TooltipContent>
            </Tooltip>
          )}
          {onDuplicate && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" onClick={onDuplicate} aria-label="Duplicate task" className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Duplicate</TooltipContent>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" onClick={onDelete} aria-label="Delete task" className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Delete</TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    </>
  )
}
