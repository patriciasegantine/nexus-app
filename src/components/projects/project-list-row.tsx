'use client'

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CalendarRange,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProjectDialog } from "@/components/projects/project-dialog/project-dialog"
import { ProjectTags } from "@/components/projects/project-tags/project-tags"
import { AppRoutes } from "@/constants/routes"
import { deleteProject } from "@/actions/projects"
import { toast } from "@/hooks/use-toast"
import type { ProjectBoardItem } from "@/types/project"
import { formatProjectDate } from "@/components/projects/project-card/project-card.utils"
import { ProjectPriorityMeta, ProjectStatusMeta } from "@/components/projects/project-meta"

interface ProjectListRowProps {
  project: ProjectBoardItem
  onTagClick?: (tag: string) => void
}

export function ProjectListRow({ project, onTagClick }: ProjectListRowProps) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [isDeleting, startDelete] = useTransition()

  function handleDeleteOpenChange(open: boolean) {
    setDeleteOpen(open)
    if (!open) setDeleteConfirm("")
  }

  function handleDelete() {
    startDelete(async () => {
      const result = await deleteProject(project.id)
      if (!result.success) {
        toast({ variant: "destructive", description: result.error })
        return
      }
      setDeleteOpen(false)
      setDeleteConfirm("")
      router.refresh()
    })
  }

  return (
    <>
      <div className="grid grid-cols-[minmax(280px,1.8fr)_120px_112px_minmax(160px,0.8fr)_minmax(180px,0.9fr)_96px_40px] items-center gap-4 border-b border-border/70 bg-card px-4 py-3 transition-colors last:border-b-0 hover:bg-muted/35">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: project.color }}
          >
            <span className="text-sm font-semibold text-white">
              {project.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 space-y-1.5">
            <div className="min-w-0">
              <Link
                href={`${AppRoutes.DASHBOARD.PROJECTS}/${project.slug}`}
                className="block truncate text-sm font-semibold text-foreground underline-offset-4 hover:underline"
              >
                {project.name}
              </Link>
              {project.description && (
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {project.description}
                </p>
              )}
            </div>
            <ProjectTags projectId={project.id} tags={project.tags} onTagClick={onTagClick} />
          </div>
        </div>

        <div>
          <ProjectStatusMeta status={project.status} />
        </div>

        <div>
          {project.priority ? (
            <ProjectPriorityMeta priority={project.priority} />
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>

        <div className="min-w-0 text-xs text-muted-foreground">
          {project.startDate || project.targetDate ? (
            <span className="inline-flex min-w-0 items-start gap-1.5">
              <CalendarRange className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span className="flex min-w-0 flex-col">
                {project.startDate && (
                  <span className="truncate">{formatProjectDate(project.startDate)}</span>
                )}
                {project.targetDate && (
                  <span className="truncate">{formatProjectDate(project.targetDate)}</span>
                )}
              </span>
            </span>
          ) : (
            <span>-</span>
          )}
        </div>

        <div className="min-w-0 space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-medium text-foreground">{project.progress}%</span>
            {project.overdue > 0 && (
              <span className="text-amber-600 dark:text-amber-500">{project.overdue} overdue</span>
            )}
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-muted-foreground/45 transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="text-right text-xs text-muted-foreground">
          <p className="font-medium text-foreground">{project.total} tasks</p>
          <p>{project.done} done</p>
        </div>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Project actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => setEditOpen(true)} className="cursor-pointer">
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setDeleteOpen(true)}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProjectDialog open={editOpen} onOpenChange={setEditOpen} project={project} />

      <Dialog open={deleteOpen} onOpenChange={handleDeleteOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">{project.name}</span>? This will also
              delete all tasks in this project. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor={`delete-project-row-${project.id}`} className="text-sm text-muted-foreground">
              Type <span className="font-medium text-foreground">{project.slug}</span> to confirm.
            </Label>
            <Input
              id={`delete-project-row-${project.id}`}
              value={deleteConfirm}
              onChange={(event) => setDeleteConfirm(event.target.value)}
              placeholder={project.slug}
              disabled={isDeleting}
            />
          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => handleDeleteOpenChange(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || deleteConfirm !== project.slug}
            >
              {isDeleting ? "Deleting..." : "Delete project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
