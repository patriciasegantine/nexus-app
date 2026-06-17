'use client'

import { useState, useTransition } from "react"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProjectTags } from "@/components/projects/project-tags/project-tags"
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
import { AppRoutes } from "@/constants/routes"
import { deleteProject } from "@/actions/projects"
import { ProjectDialog } from "../project-dialog/project-dialog"
import type { ProjectBoardItem } from "@/types/project"

export interface ProjectCardProps {
  project: ProjectBoardItem
  onTagClick?: (tag: string) => void
}

export function ProjectCard({ project, onTagClick }: ProjectCardProps) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [deleteError, setDeleteError] = useState("")
  const [isDeleting, startDelete] = useTransition()

  function handleDeleteOpenChange(open: boolean) {
    setDeleteOpen(open)
    if (!open) {
      setDeleteConfirm("")
      setDeleteError("")
    }
  }

  function handleDelete() {
    setDeleteError("")
    startDelete(async () => {
      const result = await deleteProject(project.id)
      if (!result.success) {
        setDeleteError(result.error)
        return
      }
      setDeleteOpen(false)
      setDeleteConfirm("")
      router.refresh()
    })
  }

  return (
    <>
      <Card className="border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
        <CardContent className="p-4">
          <div className="space-y-3">

            {/* Header: avatar + name/description + menu */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                  style={{ backgroundColor: project.color }}
                >
                  <span className="text-sm font-semibold text-white">
                    {project.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <Link
                    href={`${AppRoutes.DASHBOARD.PROJECTS}/${project.slug}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {project.name}
                  </Link>
                  {project.description && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    className="-mr-1 -mt-1 shrink-0 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Project options"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
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

            {/* Progress bar + stats */}
            <div className="space-y-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-muted-foreground/40 transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{project.total} tasks</span>
                <span>{project.todo} todo</span>
                <span>{project.inProgress} in progress</span>
                <span>{project.done} done</span>
                {project.overdue > 0 && (
                  <span className="text-destructive">{project.overdue} overdue</span>
                )}
                <span className="ml-auto font-medium text-foreground">{project.progress}%</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex w-full py-2">
              <ProjectTags
                projectId={project.id}
                tags={project.tags}
                onTagClick={onTagClick}
              />
            </div>

          </div>
        </CardContent>
      </Card>

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
            <Label htmlFor={`delete-project-${project.id}`} className="text-sm text-muted-foreground">
              Type <span className="font-medium text-foreground">{project.slug}</span> to confirm.
            </Label>
            <Input
              id={`delete-project-${project.id}`}
              value={deleteConfirm}
              onChange={(event) => setDeleteConfirm(event.target.value)}
              placeholder={project.slug}
              disabled={isDeleting}
            />
          </div>
          {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
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
