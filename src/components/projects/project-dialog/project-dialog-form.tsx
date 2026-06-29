'use client'

import type { FieldErrors, UseFormRegister } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TagsInput } from "@/components/ui/tags-input"
import { INVALID_INPUT_CLASS } from "@/lib/form-styles"
import { cn } from "@/lib/utils"
import type { ProjectFormValues } from "@/validations/project"
import { PROJECT_COLORS } from "../project-card/project-card.utils"
import { Check, Palette, SlidersHorizontal, X } from "lucide-react"

interface ProjectDialogFormProps {
  register: UseFormRegister<ProjectFormValues>
  errors: FieldErrors<ProjectFormValues>
  isPending: boolean
  isEditing: boolean
  tags: string[]
  onTagsChange: (tags: string[]) => void
  tagInput: string
  onTagInputChange: (value: string) => void
  color: string
  onColorChange: (color: string) => void
  onCancel: () => void
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
  color,
  onColorChange,
  onCancel,
}: ProjectDialogFormProps) {
  return (
    <>
      <div className="grid sm:grid-cols-[1fr_260px]">
        <div className="space-y-4 border-t border-border/70 p-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Project name"
              className={cn(
                "border-border/80 bg-muted/35 hover:border-muted-foreground/35 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
                errors.name && INVALID_INPUT_CLASS
              )}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Optional description"
              rows={4}
              className="resize-none border-border/80 bg-muted/35 text-sm placeholder:text-muted-foreground/55 hover:border-muted-foreground/35 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
              {...register("description")}
            />
          </div>

          <div className="border-t border-border/70 pt-3 [&_input]:border-border/80 [&_input]:bg-muted/35 [&_input]:hover:border-muted-foreground/35 [&_input]:focus-visible:ring-1 [&_input]:focus-visible:ring-ring [&_input]:focus-visible:ring-offset-0">
            <TagsInput
              value={tags}
              onChange={onTagsChange}
              inputValue={tagInput}
              onInputChange={onTagInputChange}
            />
          </div>
        </div>

        <aside className="border-t border-border/70 bg-muted/50 p-6 sm:border-l">
          <div className="mb-6 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </div>
            <p className="text-sm font-semibold text-foreground">Properties</p>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Palette className="h-3 w-3" />
              Color
            </Label>
            <div className="flex flex-wrap gap-2 pt-1">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onColorChange(c)}
                  className={cn(
                    "h-7 w-7 rounded-full transition-all",
                    color === c
                      ? "ring-2 ring-offset-2 ring-offset-background scale-110"
                      : "hover:scale-110 opacity-70 hover:opacity-100"
                  )}
                  style={{ backgroundColor: c, ...(color === c ? { '--tw-ring-color': c } as React.CSSProperties : {}) }}
                  aria-label={c}
                />
              ))}
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
