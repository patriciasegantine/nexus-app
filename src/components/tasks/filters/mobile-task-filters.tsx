import { FilterField } from "@/components/ui/filter-field"
import { FilterMobileDrawer } from "@/components/ui/filter-mobile-drawer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DueDateFilterField,
  PriorityFilterField,
  ProjectFilterField,
  StatusFilterField,
  TagFilterField,
} from "@/components/tasks/filters/task-filter-fields"
import type { Project } from "@/types/project"

interface MobileTaskFiltersProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeCount: number
  status: string
  priority: string
  projectId: string
  dueDate: string
  tag: string
  sort: string
  projects: Project[]
  tags: string[]
  onFilterChange: (key: string, value: string | null) => void
  onClear: () => void
}

export function MobileTaskFilters({
  open,
  onOpenChange,
  activeCount,
  status,
  priority,
  projectId,
  dueDate,
  tag,
  sort,
  projects,
  tags,
  onFilterChange,
  onClear,
}: MobileTaskFiltersProps) {
  return (
    <FilterMobileDrawer
      open={open}
      onOpenChange={onOpenChange}
      activeCount={activeCount}
      description="Refine the tasks shown"
      onClear={onClear}
    >
      <FilterField label="Status">
        <StatusFilterField value={status} onChange={(v) => onFilterChange("status", v)} className="w-full" />
      </FilterField>

      <FilterField label="Priority">
        <PriorityFilterField value={priority} onChange={(v) => onFilterChange("priority", v)} className="w-full" />
      </FilterField>

      <FilterField label="Project">
        <ProjectFilterField value={projectId} onChange={(v) => onFilterChange("projectId", v)} projects={projects} className="w-full" />
      </FilterField>

      <FilterField label="Due date">
        <DueDateFilterField value={dueDate} onChange={(v) => onFilterChange("dueDate", v)} className="w-full" />
      </FilterField>

      <FilterField label="Tag">
        <TagFilterField value={tag} onChange={(v) => onFilterChange("tag", v)} tags={tags} className="w-full" />
      </FilterField>

      <FilterField label="Sort by">
        <Select value={sort || "updatedAt"} onValueChange={(v) => onFilterChange("sort", v === "updatedAt" ? null : v)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt">Recently updated</SelectItem>
            <SelectItem value="dueDate">Due date</SelectItem>
            <SelectItem value="title">Title A–Z</SelectItem>
          </SelectContent>
        </Select>
      </FilterField>
    </FilterMobileDrawer>
  )
}
