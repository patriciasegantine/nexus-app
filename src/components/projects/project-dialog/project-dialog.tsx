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
import { createProject, updateProject } from "@/actions/projects"
import { projectFormSchema as projectSchema, type ProjectFormValues, type ProjectStatus, type ProjectPriority } from "@/validations/project"
import { DEFAULT_PROJECT_COLOR } from "../project-card/project-card.utils"
import { toast } from "@/hooks/use-toast"
import { ProjectDialogForm } from "./project-dialog-form"

function toDateString(date: Date | null | undefined): string {
  if (!date) return ""
  return date.toISOString().slice(0, 10)
}

export interface ProjectFormData {
  color: string
  status: ProjectStatus
  priority: ProjectPriority | null
  startDate: Date | undefined
  targetDate: Date | undefined
}

export type SetFormField = <K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) => void

const DEFAULT_PROJECT_FORM_DATA: ProjectFormData = {
  color: DEFAULT_PROJECT_COLOR,
  status: "ACTIVE",
  priority: null,
  startDate: undefined,
  targetDate: undefined,
}

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: {
    id: string
    name: string
    description?: string | null
    color?: string
    tags?: string[]
    status?: ProjectStatus
    priority?: ProjectPriority | null
    startDate?: Date | null
    targetDate?: Date | null
    icon?: string | null
  }
}

export function ProjectDialog({ open, onOpenChange, project }: ProjectDialogProps) {
  const isEditing = !!project
  const [isPending, startTransition] = useTransition()
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [projectFormData, setProjectFormData] = useState<ProjectFormData>(DEFAULT_PROJECT_FORM_DATA)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  const initialProjectFormData = useRef<ProjectFormData>(DEFAULT_PROJECT_FORM_DATA)
  const initialTags = useRef<string[]>([])

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  })

  useEffect(() => {
    if (open) {
      const initProjectFormData: ProjectFormData = {
        color: project?.color ?? DEFAULT_PROJECT_COLOR,
        status: project?.status ?? "ACTIVE",
        priority: project?.priority ?? null,
        startDate: project?.startDate ? new Date(project.startDate) : undefined,
        targetDate: project?.targetDate ? new Date(project.targetDate) : undefined,
      }
      const initTags = project?.tags ?? []

      reset({ name: project?.name ?? "", description: project?.description ?? "", icon: project?.icon ?? "" })
      setTags(initTags)
      setTagInput("")
      setProjectFormData(initProjectFormData)
      initialProjectFormData.current = initProjectFormData
      initialTags.current = initTags
    }
  }, [open, project, reset])

  function setFormField<K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) {
    setProjectFormData((prev) => ({ ...prev, [key]: value }))
  }

  function isControlledDirty() {
    const init = initialProjectFormData.current
    return (
      projectFormData.color !== init.color ||
      projectFormData.status !== init.status ||
      projectFormData.priority !== init.priority ||
      toDateString(projectFormData.startDate) !== toDateString(init.startDate) ||
      toDateString(projectFormData.targetDate) !== toDateString(init.targetDate) ||
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

  function onSubmit(data: ProjectFormValues) {
    const payload = new FormData()
    payload.set("name", data.name)
    payload.set("description", data.description ?? "")
    payload.set("icon", data.icon ?? "")
    payload.set("tags", JSON.stringify(tags))
    payload.set("color", projectFormData.color)
    payload.set("status", projectFormData.status)
    if (projectFormData.priority) payload.set("priority", projectFormData.priority)
    if (projectFormData.startDate) payload.set("startDate", toDateString(projectFormData.startDate))
    if (projectFormData.targetDate) payload.set("targetDate", toDateString(projectFormData.targetDate))

    startTransition(async () => {
      const result = isEditing
        ? await updateProject(project.id, payload)
        : await createProject(payload)

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
            <DialogTitle>{isEditing ? "Edit project" : "New project"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <ProjectDialogForm
              register={register}
              errors={errors}
              isPending={isPending}
              isEditing={isEditing}
              tags={tags}
              onTagsChange={setTags}
              tagInput={tagInput}
              onTagInputChange={setTagInput}
              formData={projectFormData}
              onFormDataChange={setFormField}
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
