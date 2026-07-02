'use client'

import { Suspense, useEffect, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { AlertTriangle, CheckCircle2, ClipboardList, Loader2, PlayCircle, Plus } from "lucide-react"
import { format } from "date-fns"
import { TasksList } from "@/components/tasks/tasks-list"
import { TaskDialog } from "@/components/tasks/task-dialog/task-dialog"
import { TaskFilters } from "@/components/tasks/filters/task-filters"
import { TaskPagination } from "@/components/tasks/task-pagination"
import { EmptyState } from "@/components/ui/empty-state"
import { SummaryMetric } from "@/components/ui/summary-metric"
import { TaskDeleteDialog } from "@/components/tasks/task-dialog/task-delete-dialog"
import { duplicateTask, deleteTask } from "@/actions/tasks"
import { toast } from "@/hooks/use-toast"
import type { TaskListItem } from "@/types/task"
import type { TaskStats } from "@/lib/data/tasks"
import type { Project } from "@/types/project"
import {
  DEFAULT_TASK_PAGE_SIZE,
  DEFAULT_TASK_SORT,
  DEFAULT_TASK_VIEW,
  TASK_PAGE_SIZE_PREFERENCE_KEY,
  TASK_SORT_OPTIONS,
  TASK_SORT_PREFERENCE_KEY,
  TASK_VIEW_PREFERENCE_KEY,
  TaskViewOption,
  isTaskPageSizeOption,
} from "@/constants/preferences"
import { NewTaskButton } from "./task-card/new-task-button"

interface TasksPageClientProps {
  tasks: TaskListItem[]
  total: number
  stats: TaskStats
  projects: Project[]
  tags: string[]
  page: number
  perPage: number
  hasFilters: boolean
}

export function TasksPageClient({ tasks, total, stats, projects, tags, page, perPage, hasFilters }: TasksPageClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskListItem | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<TaskListItem | null>(null)
  const [isDuplicating, startDuplicate] = useTransition()
  const [view, setView] = useState<TaskViewOption>(DEFAULT_TASK_VIEW)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    let shouldReplace = false

    if (!params.has("sort")) {
      const preferredSort = window.localStorage.getItem(TASK_SORT_PREFERENCE_KEY)
      const hasPreferredSort = TASK_SORT_OPTIONS.some((option) => option.value === preferredSort)

      if (preferredSort && hasPreferredSort && preferredSort !== DEFAULT_TASK_SORT) {
        params.set("sort", preferredSort)
        shouldReplace = true
      }
    }

    if (!params.has("pageSize")) {
      const preferredPageSize = Number(window.localStorage.getItem(TASK_PAGE_SIZE_PREFERENCE_KEY))

      if (isTaskPageSizeOption(preferredPageSize) && preferredPageSize !== DEFAULT_TASK_PAGE_SIZE) {
        params.set("pageSize", String(preferredPageSize))
        params.delete("page")
        shouldReplace = true
      }
    }

    const savedView = window.localStorage.getItem(TASK_VIEW_PREFERENCE_KEY)
    if (savedView === "cards" || savedView === "list") {
      setView(savedView)
    }

    if (shouldReplace) {
      router.replace(`${pathname}?${params.toString()}`)
    }
  }, [pathname, router, searchParams])

  function handleViewChange(newView: TaskViewOption) {
    setView(newView)
    window.localStorage.setItem(TASK_VIEW_PREFERENCE_KEY, newView)
  }

  // function handleNewTask() {
  //   setSelectedTask(null)
  //   setDialogOpen(true)
  // }

  function handleEditTask(task: TaskListItem) {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  function handleDialogClose() {
    setSelectedTask(null)
    setDialogOpen(false)
  }

  function handleDuplicate(task: TaskListItem) {
    startDuplicate(async () => {
      const result = await duplicateTask(task.id)
      if (result.success) {
        toast({ title: "Task duplicated successfully." })
      } else {
        toast({ title: result.error, variant: "destructive" })
      }
    })
  }

  async function handleConfirmDelete(id: string) {
    setTaskToDelete(null)
    const result = await deleteTask(id)
    if (result.success) {
      toast({ title: "Task deleted." })
    } else {
      toast({ title: result.error, variant: "destructive" })
    }
  }

  function handleFilterClick(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (key === "dueDateExact") params.delete("dueDate")
    params.set(key, value)
    params.delete("page")
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
        <SummaryMetric icon={ClipboardList} label="Tasks" value={stats.total} />
        <SummaryMetric icon={PlayCircle} label="In progress" value={stats.inProgress} />
        <SummaryMetric icon={AlertTriangle} label="Overdue" value={stats.overdue} tone={stats.overdue > 0 ? "danger" : "default"} />
        <SummaryMetric icon={CheckCircle2} label="Completed" value={stats.completed} />
      </div>

        <Suspense>
          <TaskFilters projects={projects} tags={tags} view={view} onViewChange={handleViewChange} />
        </Suspense>

      <div className="border-t border-border/60 pt-4">
        {total > 0 ? (
          <p className="text-sm text-muted-foreground">
            {total} {total === 1 ? "task" : "tasks"}
          </p>
        ) : (
          <span />
        )}
      </div>

      <div className="flex-1 relative">
        {isDuplicating && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px] rounded-lg">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {tasks.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title={hasFilters ? "No tasks match your filters." : "No tasks yet. Create your first one."}
            action={!hasFilters && <NewTaskButton />}
          />
        ) : (
          <TasksList
            tasks={tasks}
            view={view}
            onEdit={handleEditTask}
            onDuplicate={handleDuplicate}
            onDelete={setTaskToDelete}
            onTagClick={(tag) => handleFilterClick("tag", tag)}
            onStatusClick={(status) => handleFilterClick("status", status)}
            onPriorityClick={(priority) => handleFilterClick("priority", priority)}
            onDueDateClick={(dueDate) => handleFilterClick("dueDateExact", format(dueDate, "yyyy-MM-dd"))}
          />
        )}
      </div>

      <TaskPagination total={total} page={page} perPage={perPage} />

      <TaskDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        projectId={selectedTask?.project?.id}
        task={selectedTask || undefined}
      />

      <TaskDeleteDialog
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
