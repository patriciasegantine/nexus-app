'use client'

import { useEffect, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ClipboardList, LayoutGrid, List, Loader2, Plus } from "lucide-react"
import { format } from "date-fns"
import { TasksList } from "@/components/tasks/tasks-list"
import { TaskDialog } from "@/components/tasks/task-dialog/task-dialog"
import { TaskFilters } from "@/components/tasks/filters/task-filters"
import { TaskPagination } from "@/components/tasks/task-pagination"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { TaskDeleteDialog } from "@/components/tasks/task-dialog/task-delete-dialog"
import { PageHeader, PageHeaderAction } from "@/components/ui/page-header"
import { duplicateTask, deleteTask } from "@/actions/tasks"
import { toast } from "@/hooks/use-toast"
import type { TaskListItem } from "@/types/task"
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

interface TasksPageClientProps {
  tasks: TaskListItem[]
  total: number
  projects: Project[]
  tags: string[]
  page: number
  perPage: number
  hasFilters: boolean
}

export function TasksPageClient({ tasks, total, projects, tags, page, perPage, hasFilters }: TasksPageClientProps) {
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

  function handleNewTask() {
    setSelectedTask(null)
    setDialogOpen(true)
  }

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
    <div className="flex flex-col gap-6 min-h-[calc(100vh-8rem)]">
      <PageHeader
        title="Tasks"
        description="All your tasks across projects"
        action={
          <PageHeaderAction
            icon={Plus}
            iconOnlyOnMobile
            onClick={handleNewTask}
            aria-label="New task"
          >
            New task
          </PageHeaderAction>
        }
      />

      <TaskFilters projects={projects} tags={tags} />

      <hr className="border-border/60 -mt-2" />

      {total > 0 && (
        <div className="flex items-center justify-between -mt-2">
          <p className="text-sm text-muted-foreground">
            {total} {total === 1 ? "task" : "tasks"}
          </p>
          <div className="flex items-center gap-1 rounded-md border border-border/60 p-0.5">
            <button
              type="button"
              aria-label="Card view"
              onClick={() => handleViewChange("cards")}
              className={`rounded p-1.5 transition-colors ${view === "cards" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="List view"
              onClick={() => handleViewChange("list")}
              className={`rounded p-1.5 transition-colors ${view === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

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
            action={!hasFilters && (
              <Button size="sm" onClick={handleNewTask}>
                <Plus className="h-4 w-4 mr-2" />
                New task
              </Button>
            )}
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
