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
import { projectFormSchema as projectSchema, type ProjectFormValues } from "@/validations/project"
import { DEFAULT_PROJECT_COLOR } from "../project-card/project-card.utils"
import { toast } from "@/hooks/use-toast"
import { ProjectDialogForm } from "./project-dialog-form"

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: { id: string; name: string; description?: string | null; color?: string; tags?: string[] }
}

export function ProjectDialog({ open, onOpenChange, project }: ProjectDialogProps) {
  const isEditing = !!project
  const [isPending, startTransition] = useTransition()
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [color, setColor] = useState<string>(DEFAULT_PROJECT_COLOR)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  const initialColor = useRef(DEFAULT_PROJECT_COLOR)
  const initialTags = useRef<string[]>([])

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  })

  useEffect(() => {
    if (open) {
      const initColor = project?.color ?? DEFAULT_PROJECT_COLOR
      const initTags = project?.tags ?? []

      reset({
        name: project?.name ?? "",
        description: project?.description ?? "",
      })
      setTags(initTags)
      setTagInput("")
      setColor(initColor)
      initialColor.current = initColor
      initialTags.current = initTags
    }
  }, [open, project, reset])

  function isControlledDirty() {
    return (
      color !== initialColor.current ||
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
    const formData = new FormData()
    formData.set("name", data.name)
    formData.set("description", data.description ?? "")
    formData.set("tags", JSON.stringify(tags))
    formData.set("color", color)

    startTransition(async () => {
      const result = isEditing
        ? await updateProject(project.id, formData)
        : await createProject(formData)

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
          className="gap-0 p-0 sm:max-w-3xl sm:overflow-hidden sm:p-0"
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
              color={color}
              onColorChange={setColor}
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
