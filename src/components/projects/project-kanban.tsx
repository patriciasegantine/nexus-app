'use client'

import { useEffect, useMemo, useState, useTransition, type CSSProperties } from "react"
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PriorityFilterField, TagFilterField } from "@/components/tasks/filters/task-filter-fields"
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
import { CalendarRange, ClipboardList, Flag, ListChecks, ListFilter, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TASK_STATUS_NAMES, TASK_STATUS_COLUMNS } from "@/constants/task"
import { AppRoutes } from "@/constants/routes"
import { deleteProject } from "@/actions/projects"
import { updateTaskStatus } from "@/actions/tasks"
import type { TaskStatus, TaskCard as TaskCardType } from "@/types/task"
import type { ProjectWithTasks } from "@/types/project"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  formatProjectTimeline,
  PROJECT_PRIORITY_ACCENT,
  PROJECT_PRIORITY_NAMES,
  PROJECT_STATUS_NAMES,
  PROJECT_STATUS_STYLES,
} from "@/components/projects/project-card/project-card.utils"

interface ProjectKanbanProps {
  project: ProjectWithTasks
}

type ColumnFilter = { priority: string | null; tag: string | null }

const EMPTY_COLUMN_FILTERS: Record<TaskStatus, ColumnFilter> = {
  TODO: { priority: null, tag: null },
  IN_PROGRESS: { priority: null, tag: null },
  DONE: { priority: null, tag: null },
}

export function ProjectKanban({ project }: ProjectKanbanProps) {
  const router = useRouter()
  const [tasks, setTasks] = useState<TaskCardType[]>(project.tasks)
  const [columnFilters, setColumnFilters] = useState(EMPTY_COLUMN_FILTERS)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskCardType | null>(null)
  const [editProjectOpen, setEditProjectOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setTasks(project.tasks)
  }, [project.tasks])

  const allTags = useMemo(
    () => Array.from(new Set(tasks.flatMap((t) => t.tags))).sort(),
    [tasks]
  )

  const tasksByStatus = TASK_STATUS_COLUMNS.reduce((acc, status) => {
    const filter = columnFilters[status]
    acc[status] = tasks.filter((t) => {
      if (t.status !== status) return false
      if (filter.priority && t.priority !== filter.priority) return false
      if (filter.tag && !t.tags.includes(filter.tag)) return false
      return true
    })
    return acc
  }, {} as Record<TaskStatus, typeof tasks>)
  const timeline = formatProjectTimeline(project.startDate, project.targetDate)

  function isColumnFilterActive(status: TaskStatus) {
    return columnFilters[status].priority !== null || columnFilters[status].tag !== null
  }

  function setColumnFilter(status: TaskStatus, key: keyof ColumnFilter, value: string | null) {
    setColumnFilters((prev) => ({ ...prev, [status]: { ...prev[status], [key]: value } }))
  }

  function clearColumnFilter(status: TaskStatus) {
    setColumnFilters((prev) => ({ ...prev, [status]: { priority: null, tag: null } }))
  }

  async function handleDragEnd({ source, destination, draggableId }: DropResult) {
    if (!destination) return

    const sourceStatus = source.droppableId as TaskStatus
    const destStatus = destination.droppableId as TaskStatus
    if (sourceStatus === destStatus) return

    const previousTasks = tasks
    setTasks((prev) => prev.map((t) => (t.id === draggableId ? { ...t, status: destStatus } : t)))

    const formData = new FormData()
    formData.set("status", destStatus)
    const result = await updateTaskStatus(draggableId, formData)
    if (!result.success) {
      setTasks(previousTasks)
      toast({ variant: "destructive", description: result.error })
    }
  }

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

        {tasks.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No tasks yet." className="py-24" />
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TASK_STATUS_COLUMNS.map((status) => (
                <div key={status} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium">{TASK_STATUS_NAMES[status]}</h2>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="secondary">{tasksByStatus[status].length}</Badge>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-6 w-6 text-muted-foreground hover:text-foreground",
                              isColumnFilterActive(status) && "text-primary hover:text-primary"
                            )}
                            aria-label={`Filter ${TASK_STATUS_NAMES[status]} column`}
                          >
                            <ListFilter className="h-3.5 w-3.5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-56 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Filter
                            </p>
                            {isColumnFilterActive(status) && (
                              <button
                                type="button"
                                onClick={() => clearColumnFilter(status)}
                                className="text-xs text-muted-foreground hover:text-foreground hover:underline underline-offset-2"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                          <PriorityFilterField
                            value={columnFilters[status].priority ?? ""}
                            onChange={(value) => setColumnFilter(status, "priority", value)}
                          />
                          <TagFilterField
                            value={columnFilters[status].tag ?? ""}
                            onChange={(value) => setColumnFilter(status, "tag", value)}
                            tags={allTags}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          "space-y-2 min-h-16 rounded-md transition-colors",
                          snapshot.isDraggingOver && "bg-muted/60"
                        )}
                      >
                        {tasksByStatus[status].length === 0 && (
                          <p className="py-6 text-center text-xs italic text-muted-foreground/70">
                            No tasks
                          </p>
                        )}
                        {tasksByStatus[status].map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(dragProvided, dragSnapshot) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                style={dragProvided.draggableProps.style as CSSProperties}
                                className={cn(dragSnapshot.isDragging && "opacity-90")}
                              >
                                <TaskCard
                                  task={task}
                                  onEdit={() => handleEditTask(task)}
                                  showProject={false}
                                  collapsible
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
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
