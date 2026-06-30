'use client'

import { useEffect, useRef, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createTask, updateTask } from "@/actions/tasks"
import { fetchProjects } from "@/actions/projects"
import { taskFormSchema as taskSchema, type TaskFormValues } from "@/validations/task"
import { format } from "date-fns"
import type { TaskCard } from "@/types/task"
import { toast } from "@/hooks/use-toast"
import { TaskDialogForm } from "./task-dialog-form"

export interface TaskFormData {
  priority: string
  status: string
  dueDate: Date | undefined
}

export type SetTaskFormField = <K extends keyof TaskFormData>(key: K, value: TaskFormData[K]) => void

const DEFAULT_TASK_FORM_DATA: TaskFormData = {
  priority: "MEDIUM",
  status: "TODO",
  dueDate: undefined,
}

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId?: string
  task?: TaskCard
}

export function TaskDialog({ open, onOpenChange, projectId, task }: TaskDialogProps) {
  const isEditing = !!task
  const [isPending, startTransition] = useTransition()
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [taskFormData, setTaskFormData] = useState<TaskFormData>(DEFAULT_TASK_FORM_DATA)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  const initialTaskFormData = useRef<TaskFormData>(DEFAULT_TASK_FORM_DATA)
  const initialTags = useRef<string[]>([])

  const { register, handleSubmit, formState: { errors, isDirty }, reset, setValue, watch } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
  })

  const selectedProjectId = watch("projectId") ?? ""

  useEffect(() => {
    if (open) {
      const initFormData: TaskFormData = {
        priority: task?.priority || "MEDIUM",
        status: task?.status || "TODO",
        dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
      }
      const initTags = task?.tags ?? []

      reset({ title: task?.title ?? "", description: task?.description ?? "", projectId: projectId ?? "" })
      setTags(initTags)
      setTagInput("")
      setTaskFormData(initFormData)
      initialTaskFormData.current = initFormData
      initialTags.current = initTags

      if (isEditing || !projectId) {
        fetchProjects().then(setProjects)
      }
    }
  }, [open, task, projectId, isEditing, reset])

  function setFormField<K extends keyof TaskFormData>(key: K, value: TaskFormData[K]) {
    setTaskFormData((prev) => ({ ...prev, [key]: value }))
  }

  function isControlledDirty() {
    const init = initialTaskFormData.current
    return (
      taskFormData.priority !== init.priority ||
      taskFormData.status !== init.status ||
      taskFormData.dueDate?.getTime() !== init.dueDate?.getTime() ||
      tags.join(",") !== initialTags.current.join(",")
    )
  }

  function handleOpenChange(val: boolean) {
    if (!val) {
      if (showDiscardConfirm) return
      if (isDirty || isControlledDirty()) {
        setShowDiscardConfirm(true)
        return
      }
      setTimeout(() => { document.body.style.pointerEvents = '' }, 0)
      onOpenChange(false)
      return
    }
    onOpenChange(val)
  }

  function handleDiscard() {
    setShowDiscardConfirm(false)
    setTimeout(() => { document.body.style.pointerEvents = '' }, 0)
    onOpenChange(false)
  }

  function onSubmit(data: TaskFormValues) {
    const payload = new FormData()
    payload.set("title", data.title)
    payload.set("description", data.description ?? "")
    payload.set("projectId", data.projectId)
    payload.set("priority", taskFormData.priority)
    payload.set("status", taskFormData.status)
    payload.set("tags", JSON.stringify(tags))
    payload.set("dueDate", taskFormData.dueDate ? format(taskFormData.dueDate, "yyyy-MM-dd") : "")

    startTransition(async () => {
      const result = isEditing
        ? await updateTask(task.id, payload)
        : await createTask(payload)

      if (!result.success) {
        toast({ variant: "destructive", description: result.error })
        return
      }

      onOpenChange(false)
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="gap-0 p-0 sm:max-w-5xl sm:overflow-hidden sm:p-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className="px-6 pb-4 pt-6">
            <DialogTitle>{isEditing ? "Edit task" : "New task"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TaskDialogForm
              register={register}
              errors={errors}
              setValue={setValue}
              isPending={isPending}
              isEditing={isEditing}
              projectId={projectId}
              projects={projects}
              selectedProjectId={selectedProjectId}
              tags={tags}
              onTagsChange={setTags}
              tagInput={tagInput}
              onTagInputChange={setTagInput}
              taskFormData={taskFormData}
              onTaskFormDataChange={setFormField}
              onCancel={() => handleOpenChange(false)}
            />
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDiscardConfirm} onOpenChange={setShowDiscardConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. If you leave now, they will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscard}>Discard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
