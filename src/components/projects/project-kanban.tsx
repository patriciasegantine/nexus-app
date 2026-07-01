'use client'

import { useState, useTransition } from "react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TaskCard } from "@/components/tasks/task-card/task-card"
import { TaskDialog } from "@/components/tasks/task-dialog/task-dialog"
import { ProjectDialog } from "@/components/projects/project-dialog/project-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CalendarRange, ClipboardList, Flag, ListChecks, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TASK_STATUS_NAMES, TASK_STATUS_COLUMNS } from "@/constants/task"
import { AppRoutes } from "@/constants/routes"
import { deleteProject } from "@/actions/projects"
import type { TaskStatus, TaskCard as TaskCardType } from "@/types/task"
import type { ProjectPriority, ProjectStatus, ProjectWithTasks } from "@/types/project"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface ProjectKanbanProps {
  project: ProjectWithTasks
}

const PROJECT_STATUS_NAMES: Record<ProjectStatus, string> = {
  PLANNING: "Planning",
  ACTIVE: "Active",
  ON_HOLD: "On hold",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
}

const PROJECT_STATUS_STYLES: Record<ProjectStatus, string> = {
  PLANNING: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300",
  ACTIVE: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  ON_HOLD: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  COMPLETED: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  ARCHIVED: "bg-muted text-muted-foreground",
}

const PROJECT_PRIORITY_NAMES: Record<ProjectPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
}

const PROJECT_PRIORITY_ACCENT: Record<ProjectPriority, string> = {
  LOW: "text-emerald-600 dark:text-emerald-400",
  MEDIUM: "text-amber-600 dark:text-amber-400",
  HIGH: "text-rose-600 dark:text-rose-400",
}

function formatProjectDate(date: Date) {
  return format(new Date(date), "MMM d, yyyy")
}

function formatProjectTimeline(startDate: Date | null, targetDate: Date | null) {
  if (startDate && targetDate) {
    return `${formatProjectDate(startDate)} - ${formatProjectDate(targetDate)}`
  }

  if (startDate) return `Starts ${formatProjectDate(startDate)}`
  if (targetDate) return `Target ${formatProjectDate(targetDate)}`
  return null
}

export function ProjectKanban({ project }: ProjectKanbanProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskCardType | null>(null)
  const [editProjectOpen, setEditProjectOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [isPending, startTransition] = useTransition()

  const tasksByStatus = TASK_STATUS_COLUMNS.reduce((acc, status) => {
    acc[status] = project.tasks.filter((t) => t.status === status)
    return acc
  }, {} as Record<TaskStatus, typeof project.tasks>)
  const timeline = formatProjectTimeline(project.startDate, project.targetDate)

  function handleNewTask() {
    setSelectedTask(null)
    setDialogOpen(true)
  }

  function handleEditTask(task: TaskCardType) {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  function handleDialogClose() {
    setSelectedTask(null)
    setDialogOpen(false)
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProject(project.id)
      if (!result.success) {
        toast({ variant: "destructive", description: result.error })
        return
      }
      router.push(AppRoutes.DASHBOARD.PROJECTS)
    })
  }

  return (
    <>
      <div className="space-y-5">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link
            href={AppRoutes.DASHBOARD.PROJECTS}
            className="hover:text-foreground transition-colors"
          >
            Projects
          </Link>
          <span>/</span>
          <span className="text-foreground">{project.name}</span>
        </nav>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
              style={{ backgroundColor: project.color }}
            >
              <span className="text-white text-base font-semibold">
                {project.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditProjectOpen(true)}
                  className="min-w-0 text-left text-2xl font-bold tracking-tight underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <span className="block truncate">{project.name}</span>
                </button>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 shrink-0 border-border/80 bg-background text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground"
                      aria-label="Project actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setEditProjectOpen(true)}>
                      <Pencil className="h-3.5 w-3.5 mr-2" />
                      Edit project
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteOpen(true)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Delete project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {project.description && (
                <p className="text-sm text-muted-foreground truncate">{project.description}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className={cn("gap-1.5 rounded-full px-2.5 py-1", PROJECT_STATUS_STYLES[project.status])}
                >
                  <ListChecks className="h-3 w-3" />
                  {PROJECT_STATUS_NAMES[project.status]}
                </Badge>

                {project.priority && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 rounded-full bg-muted px-2.5 py-1 text-muted-foreground"
                  >
                    <Flag className={cn("h-3 w-3", PROJECT_PRIORITY_ACCENT[project.priority])} />
                    {PROJECT_PRIORITY_NAMES[project.priority]}
                  </Badge>
                )}

                {timeline && (
                  <Badge
                    variant="outline"
                    className="gap-1.5 rounded-full border-border/80 bg-background px-2.5 py-1 text-muted-foreground"
                  >
                    <CalendarRange className="h-3 w-3" />
                    {timeline}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleNewTask}>
                <Plus className="h-4 w-4 mr-2" />
                New task
              </Button>
            </div>
          </div>
        </div>

        {project.tasks.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No tasks yet." className="py-24" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TASK_STATUS_COLUMNS.map((status) => (
              <div key={status} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">{TASK_STATUS_NAMES[status]}</h2>
                  <Badge variant="secondary">{tasksByStatus[status].length}</Badge>
                </div>
                <div className="space-y-2">
                  {tasksByStatus[status].map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={() => handleEditTask(task)}
                      showProject={false}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        projectId={project.id}
        task={selectedTask || undefined}
      />

      <ProjectDialog
        open={editProjectOpen}
        onOpenChange={setEditProjectOpen}
        project={project}
      />

      <AlertDialog open={deleteOpen} onOpenChange={(open) => { setDeleteOpen(open); if (!open) setDeleteConfirm("") }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This will permanently delete{" "}
              <span className="font-medium text-foreground">&ldquo;{project.name}&rdquo;</span>{" "}
              and all its tasks. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              To confirm, type <span className="font-medium text-foreground">{project.slug}</span> below:
            </Label>
            <Input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={project.slug}
              className="placeholder:text-muted-foreground/60"
              disabled={isPending}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isPending || deleteConfirm !== project.slug}
            >
              {isPending ? "Deleting..." : "Delete project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
