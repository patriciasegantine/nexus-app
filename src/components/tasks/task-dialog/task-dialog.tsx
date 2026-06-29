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
  const [priority, setPriority] = useState("MEDIUM")
  const [status, setStatus] = useState("TODO")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  const initialControlled = useRef({
    priority: "MEDIUM",
    status: "TODO",
    dueDate: undefined as Date | undefined,
    tags: [] as string[],
  })

  const { register, handleSubmit, formState: { errors, isDirty }, reset, setValue, watch } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
  })

  const selectedProjectId = watch("projectId") ?? ""

  useEffect(() => {
    if (open) {
      const initPriority = task?.priority || "MEDIUM"
      const initStatus = task?.status || "TODO"
      const initDueDate = task?.dueDate ? new Date(task.dueDate) : undefined
      const initTags = task?.tags ?? []

      reset({
        title: task?.title ?? "",
        description: task?.description ?? "",
        projectId: projectId ?? "",
      })
      setTags(initTags)
      setTagInput("")
      setPriority(initPriority)
      setStatus(initStatus)
      setDueDate(initDueDate)

      initialControlled.current = {
        priority: initPriority,
        status: initStatus,
        dueDate: initDueDate,
        tags: initTags,
      }

      if (isEditing || !projectId) {
        fetchProjects().then(setProjects)
      }
    }
  }, [open, task, projectId, isEditing, reset])

  function isControlledDirty() {
    const init = initialControlled.current
    return (
      priority !== init.priority ||
      status !== init.status ||
      dueDate?.getTime() !== init.dueDate?.getTime() ||
      tags.join(",") !== init.tags.join(",")
    )
  }

  function handleOpenChange(val: boolean) {
    if (!val) {
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
    const formData = new FormData()
    formData.set("title", data.title)
    formData.set("description", data.description ?? "")
    formData.set("projectId", data.projectId)
    formData.set("priority", priority)
    formData.set("status", status)
    formData.set("tags", JSON.stringify(tags))
    formData.set("dueDate", dueDate ? format(dueDate, "yyyy-MM-dd") : "")

    startTransition(async () => {
      const result = isEditing
        ? await updateTask(task.id, formData)
        : await createTask(formData)

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
              priority={priority}
              onPriorityChange={setPriority}
              status={status}
              onStatusChange={setStatus}
              dueDate={dueDate}
              onDueDateChange={setDueDate}
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
