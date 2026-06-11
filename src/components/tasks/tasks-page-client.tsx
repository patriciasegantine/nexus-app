'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TasksList } from "@/components/tasks/tasks-list"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { TaskFilters } from "@/components/tasks/task-filters"
import { TaskPagination } from "@/components/tasks/task-pagination"
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
import { ClipboardList, Plus } from "lucide-react"
import { duplicateTask, deleteTask } from "@/actions/tasks"
import { toast } from "@/hooks/use-toast"
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
  const [taskToDelete, setTaskToDelete] = useState<TaskListItem | null>(null)

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

  async function handleDuplicate(task: TaskListItem) {
    const result = await duplicateTask(task.id)
    if (result.success) {
      toast({ title: "Task duplicated successfully." })
    } else {
      toast({ title: result.error, variant: "destructive" })
    }
  }

  async function handleConfirmDelete() {
    if (!taskToDelete) return
    const id = taskToDelete.id
    setTaskToDelete(null)
    const result = await deleteTask(id)
    if (result.success) {
      toast({ title: "Task deleted." })
    } else {
      toast({ title: result.error, variant: "destructive" })
    }
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
          <TasksList
            tasks={tasks}
            onTaskClick={handleEditTask}
            onDuplicate={handleDuplicate}
            onDelete={(task) => setTaskToDelete(task)}
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

      <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">&ldquo;{taskToDelete?.title}&rdquo;</span>?{" "}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
