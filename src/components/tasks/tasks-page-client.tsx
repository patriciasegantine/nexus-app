'use client'

import { useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Loader2, Plus } from "lucide-react"
import { format } from "date-fns"
import { TasksList } from "@/components/tasks/tasks-list"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { TaskFilters } from "@/components/tasks/task-filters"
import { TaskPagination } from "@/components/tasks/task-pagination"
import { TasksEmptyState } from "@/components/tasks/tasks-empty-state"
import { TaskDeleteDialog } from "@/components/tasks/task-delete-dialog"
import { PageHeader, PageHeaderAction } from "@/components/ui/page-header"
import { duplicateTask, deleteTask } from "@/actions/tasks"
import { toast } from "@/hooks/use-toast"
import type { TaskListItem } from "@/types/task"
import type { Project } from "@/types/project"

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

      <div className="flex-1 relative">
        {isDuplicating && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px] rounded-lg">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {tasks.length === 0 ? (
          <TasksEmptyState hasFilters={hasFilters} onNewTask={handleNewTask} />
        ) : (
          <TasksList
            tasks={tasks}
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
