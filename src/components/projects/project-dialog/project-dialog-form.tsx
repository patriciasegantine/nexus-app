'use client'

import type { FieldErrors, UseFormRegister } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TagsInput } from "@/components/ui/tags-input"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { INVALID_INPUT_CLASS, DIALOG_PANEL_CLASS } from "@/lib/form-styles"
import { cn } from "@/lib/utils"
import type { ProjectFormValues, ProjectStatus, ProjectPriority } from "@/validations/project"
import type { ProjectFormData, SetFormField } from "./project-dialog"
import {
  PROJECT_COLORS,
  PROJECT_PRIORITY_ACCENT,
  PROJECT_PRIORITY_NAMES,
  PROJECT_STATUS_COLORS,
  PROJECT_STATUS_NAMES,
} from "../project-card/project-card.utils"
import {
  Archive,
  CalendarRange,
  Check,
  CheckCircle2,
  CircleDashed,
  Flag,
  Palette,
  PauseCircle,
  PlayCircle,
  SlidersHorizontal,
  X,
  type LucideIcon,
} from "lucide-react"

const STATUS_OPTIONS: ProjectStatus[] = [
  "PLANNING",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "ARCHIVED",
]

const PRIORITY_OPTIONS: ProjectPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
]

const PROJECT_STATUS_ICONS: Record<ProjectStatus, LucideIcon> = {
  PLANNING: CircleDashed,
  ACTIVE: PlayCircle,
  ON_HOLD: PauseCircle,
  COMPLETED: CheckCircle2,
  ARCHIVED: Archive,
}

interface ProjectDialogFormProps {
  register: UseFormRegister<ProjectFormValues>
  errors: FieldErrors<ProjectFormValues>
  isPending: boolean
  isEditing: boolean
  tags: string[]
  onTagsChange: (tags: string[]) => void
  tagInput: string
  onTagInputChange: (value: string) => void
  formData: ProjectFormData
  onFormDataChange: SetFormField
  onCancel: () => void
}

const panelTriggerClass = DIALOG_PANEL_CLASS

function ProjectStatusSelectLabel({ status }: { status: ProjectStatus }) {
  const StatusIcon = PROJECT_STATUS_ICONS[status]

  return (
    <span className="flex items-center gap-2">
      <StatusIcon className="h-3.5 w-3.5" style={{ color: PROJECT_STATUS_COLORS[status] }} />
      <span>{PROJECT_STATUS_NAMES[status]}</span>
    </span>
  )
}

function ProjectPrioritySelectLabel({ priority }: { priority: ProjectPriority | null }) {
  return (
    <span className="flex items-center gap-2">
      <Flag className={cn("h-3.5 w-3.5", priority ? PROJECT_PRIORITY_ACCENT[priority] : "text-muted-foreground")} />
      <span>{priority ? PROJECT_PRIORITY_NAMES[priority] : "No priority"}</span>
    </span>
  )
}

export function ProjectDialogForm({
  register,
  errors,
  isPending,
  isEditing,
  tags,
  onTagsChange,
  tagInput,
  onTagInputChange,
  formData,
  onFormDataChange,
  onCancel,
}: ProjectDialogFormProps) {

  return (
    <>
      <div className="grid sm:grid-cols-[1fr_350px]">
        {/* ── Main column ── */}
        <div className="space-y-5 border-t border-border/70 p-7">

          {/* Name */}
          <div className="flex-1 space-y-2">
            <Label
              htmlFor="name"
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Name
            </Label>
            <Input
              id="name"
              placeholder="Project name"
              className={cn(errors.name && INVALID_INPUT_CLASS)}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Optional description"
              rows={8}
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

        {/* ── Properties aside ── */}
        <aside className="border-t border-border/70 bg-muted/50 px-7 py-10 sm:border-l">
          <div className="mb-6 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </div>
            <p className="text-sm font-semibold text-foreground">Properties</p>
          </div>

          <div className="space-y-5">
            {/* Color */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Palette className="h-3 w-3" />
                Color
              </Label>
              <div className="flex flex-wrap gap-2.5 pt-0.5">
                {PROJECT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onFormDataChange("color", c)}
                    className={cn(
                      "h-6 w-6 rounded-full transition-all",
                      formData.color === c
                        ? "ring-2 ring-offset-2 ring-offset-background scale-110"
                        : "hover:scale-110 opacity-70 hover:opacity-100"
                    )}
                    style={{
                      backgroundColor: c,
                      ...(formData.color === c ? ({ "--tw-ring-color": c } as React.CSSProperties) : {}),
                    }}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-border/50" />

            {/* Status */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(v) => onFormDataChange("status", v as ProjectStatus)}>
                <SelectTrigger className={cn(panelTriggerClass, "[&>span]:!flex [&>span]:items-center")}>
                  <ProjectStatusSelectLabel status={formData.status} />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      <ProjectStatusSelectLabel status={status} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Flag className={cn("h-3 w-3", formData.priority ? PROJECT_PRIORITY_ACCENT[formData.priority] : "text-muted-foreground")} />
                Priority
              </Label>
              <Select
                value={formData.priority ?? "none"}
                onValueChange={(v) =>
                  onFormDataChange("priority", v === "none" ? null : (v as ProjectPriority))
                }
              >
                <SelectTrigger className={cn(panelTriggerClass, "[&>span]:!flex [&>span]:items-center")}>
                  <ProjectPrioritySelectLabel priority={formData.priority} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <ProjectPrioritySelectLabel priority={null} />
                  </SelectItem>
                  {PRIORITY_OPTIONS.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      <ProjectPrioritySelectLabel priority={priority} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="border-t border-border/50" />

            {/* Timeline */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <CalendarRange className="h-3 w-3" />
                Timeline
              </Label>
              <div className="space-y-2">
                <DatePicker
                  value={formData.startDate}
                  onChange={(v) => onFormDataChange("startDate", v)}
                  placeholder="Start date"
                  className={cn(panelTriggerClass, "w-full")}
                />
                <DatePicker
                  value={formData.targetDate}
                  onChange={(v) => onFormDataChange("targetDate", v)}
                  placeholder="Target date"
                  className={cn(panelTriggerClass, "w-full")}
                />
              </div>
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
          {isPending ? "Saving..." : isEditing ? "Save changes" : "Create project"}
        </Button>
      </div>
    </>
  )
}
