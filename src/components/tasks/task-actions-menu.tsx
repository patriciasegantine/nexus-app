'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

interface TaskActionsMenuProps {
  onEdit?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
  triggerClassName?: string
}

export function TaskActionsMenu({ onEdit, onDuplicate, onDelete, triggerClassName }: TaskActionsMenuProps) {
  if (!onEdit && !onDuplicate && !onDelete) return null

  return (
    <DropdownMenu>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Task options"
                className={triggerClassName ?? "rounded p-1.5 text-muted-foreground/60 hover:bg-muted hover:text-foreground transition-colors"}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">Task options</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="w-36">
        {onEdit && (
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
            <Pencil className="h-3.5 w-3.5 mr-2" />
            Edit
          </DropdownMenuItem>
        )}
        {onDuplicate && (
          <DropdownMenuItem onClick={onDuplicate} className="cursor-pointer">
            <Copy className="h-3.5 w-3.5 mr-2" />
            Duplicate
          </DropdownMenuItem>
        )}
        {onDelete && (
          <>
            {(onEdit || onDuplicate) && <DropdownMenuSeparator />}
            <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-destructive focus:text-destructive">
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
