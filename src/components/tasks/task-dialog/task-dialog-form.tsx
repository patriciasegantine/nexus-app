'use client'

import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TagsInput } from "@/components/ui/tags-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { TASK_PRIORITY_NAMES, TASK_STATUS_NAMES } from "@/constants/task"
import { INVALID_INPUT_CLASS, DIALOG_PANEL_CLASS } from "@/lib/form-styles"
import { cn } from "@/lib/utils"
import type { TaskFormValues } from "@/validations/task"
import type { TaskFormData, SetTaskFormField } from "./task-dialog"
import { CalendarDays, Check, Flag, FolderKanban, ListChecks, SlidersHorizontal, X } from "lucide-react"

const priorityAccent: Record<string, string> = {
  LOW: "text-emerald-600 dark:text-emerald-400",
  MEDIUM: "text-amber-600 dark:text-amber-400",
  HIGH: "text-rose-600 dark:text-rose-400",
}

const panelTriggerClass = DIALOG_PANEL_CLASS

interface TaskDialogFormProps {
  register: UseFormRegister<TaskFormValues>
  errors: FieldErrors<TaskFormValues>
  setValue: UseFormSetValue<TaskFormValues>
  isPending: boolean
  isEditing: boolean
  projectId?: string
  projects: { id: string; name: string }[]
  selectedProjectId: string
  tags: string[]
  onTagsChange: (tags: string[]) => void
  tagInput: string
  onTagInputChange: (value: string) => void
  taskFormData: TaskFormData
  onTaskFormDataChange: SetTaskFormField
  onCancel: () => void
}

export function TaskDialogForm({
  register,
  errors,
  setValue,
  isPending,
  isEditing,
  projectId,
  projects,
  selectedProjectId,
  tags,
  onTagsChange,
  tagInput,
  onTagInputChange,
  taskFormData,
  onTaskFormDataChange,
  onCancel,
}: TaskDialogFormProps) {
  return (
    <>
      <div className="grid sm:grid-cols-[1fr_350px]">
        <div className="space-y-4 border-t border-border/70 p-7">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Task title"
              className={cn(errors.title && INVALID_INPUT_CLASS)}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Add decisions, context, acceptance criteria, or a quick note."
              rows={4}
              className="resize-none text-sm"
              {...register("description")}
            />
          </div>

          <div className="border-t border-border/70 pt-3">
            <TagsInput
              value={tags}
              onChange={onTagsChange}
              inputValue={tagInput}
              onInputChange={onTagInputChange}
            />
          </div>
        </div>

        <aside className="border-t border-border/70 bg-muted/50 px-7 py-10 sm:border-l">
          <div className="mb-6 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </div>
            <p className="text-sm font-semibold text-foreground">Properties</p>
          </div>

          <div className="space-y-5">
            {(isEditing || !projectId) && (
              <div className="space-y-1.5">
                <Label htmlFor="project" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <FolderKanban className="h-3 w-3" />
                  Project
                </Label>
                <Select
                  value={selectedProjectId}
                  onValueChange={(value) => setValue("projectId", value, { shouldValidate: true })}
                >
                  <SelectTrigger
                    id="project"
                    className={cn(panelTriggerClass, errors.projectId && "border-destructive/70 bg-destructive/5")}
                  >
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.projectId && (
                  <p className="text-xs text-destructive">{errors.projectId.message}</p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="status" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <ListChecks className="h-3 w-3" />
                Status
              </Label>
              <Select value={taskFormData.status} onValueChange={(v) => onTaskFormDataChange("status", v)}>
                <SelectTrigger id="status" className={panelTriggerClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">{TASK_STATUS_NAMES.TODO}</SelectItem>
                  <SelectItem value="IN_PROGRESS">{TASK_STATUS_NAMES.IN_PROGRESS}</SelectItem>
                  <SelectItem value="DONE">{TASK_STATUS_NAMES.DONE}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="priority" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Flag className={cn("h-3 w-3", priorityAccent[taskFormData.priority])} />
                Priority
              </Label>
              <Select value={taskFormData.priority} onValueChange={(v) => onTaskFormDataChange("priority", v)}>
                <SelectTrigger id="priority" className={panelTriggerClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">{TASK_PRIORITY_NAMES.LOW}</SelectItem>
                  <SelectItem value="MEDIUM">{TASK_PRIORITY_NAMES.MEDIUM}</SelectItem>
                  <SelectItem value="HIGH">{TASK_PRIORITY_NAMES.HIGH}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <CalendarDays className="h-3 w-3" />
                Due date
              </Label>
              <DatePicker
                value={taskFormData.dueDate}
                onChange={(v) => onTaskFormDataChange("dueDate", v)}
                placeholder="Pick a due date"
                className={DIALOG_PANEL_CLASS}
              />
            </div>
          </div>
        </aside>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border/70 px-6 py-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          <Check className="h-4 w-4" />
          {isPending ? "Saving..." : isEditing ? "Save changes" : "Create task"}
        </Button>
      </div>
    </>
  )
}
