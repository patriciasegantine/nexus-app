'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TasksList } from "@/components/tasks/tasks-list"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { TaskFilters } from "@/components/tasks/task-filters"
import { TaskPagination } from "@/components/tasks/task-pagination"
import { ClipboardList, Plus } from "lucide-react"
import type { TaskListItem } from "@/types/task"
import type { Project } from "@/types/project"

interface TasksPageClientProps {
  tasks: TaskListItem[]
  total: number
  projects: Project[]
  page: number
  perPage: number
  hasFilters: boolean
}

export function TasksPageClient({ tasks, total, projects, page, perPage, hasFilters }: TasksPageClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskListItem | null>(null)

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

  return (
    <div className="flex flex-col gap-6 min-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">All your tasks across projects</p>
        </div>
        <Button size="sm" onClick={handleNewTask}>
          <Plus className="h-4 w-4 mr-2" />
          New task
        </Button>
      </div>

      <TaskFilters projects={projects} />

      <hr className="border-border/60 -mt-2" />

      <div className="flex-1">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[20rem] text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            {hasFilters ? (
              <p className="text-muted-foreground">No tasks match your filters.</p>
            ) : (
              <>
                <p className="text-muted-foreground mb-4">No tasks yet. Create your first one.</p>
                <Button size="sm" onClick={handleNewTask}>
                  <Plus className="h-4 w-4 mr-2" />
                  New task
                </Button>
              </>
            )}
          </div>
        ) : (
          <TasksList tasks={tasks} onTaskClick={handleEditTask} />
        )}
      </div>

      <TaskPagination total={total} page={page} perPage={perPage} />

      <TaskDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        projectId={selectedTask?.project?.id}
        task={selectedTask || undefined}
      />
    </div>
  )
}
