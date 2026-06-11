'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/tasks/status-badge"
import { PriorityBadge } from "@/components/tasks/priority-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Copy, Trash2 } from "lucide-react"
import type { TaskCard as TaskCardType } from "@/types/task"

interface TaskCardProps {
  task: TaskCardType & { project?: { id?: string; name: string } | null }
  onClick?: () => void
  onEdit?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
  showProject?: boolean
}

export function TaskCard({ task, onClick, onEdit, onDuplicate, onDelete, showProject = false }: TaskCardProps) {
  return (
    <Card
      className="group hover:shadow-md hover:bg-muted/30 transition-all duration-200 h-full cursor-pointer border border-border/50 bg-card"
      onClick={onClick}
    >
      <CardContent className="p-4 flex flex-col h-full gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight line-clamp-2 text-foreground">
              {task.title}
            </p>
            {showProject && task.project && (
              <p className="text-xs text-muted-foreground mt-1">{task.project.name}</p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted shrink-0 -mt-0.5 -mr-1"
                onClick={(e) => e.stopPropagation()}
                aria-label="Task options"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onEdit?.() }}
                className="cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onDuplicate?.() }}
                className="cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onDelete?.() }}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {task.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <span className="text-xs text-muted-foreground self-center">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
