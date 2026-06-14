import type { ReactNode } from "react"
import { SlidersHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
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
  projects,
  tags,
  onFilterChange,
  onClear,
}: MobileTaskFiltersProps) {
  function handleClear() {
    onClear()
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-10 w-10 shrink-0 md:hidden"
          aria-label="More filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -right-1.5 -top-1.5 h-5 min-w-5 px-1 text-[10px]"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="md:hidden">
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Refine the tasks shown</DrawerDescription>
        </DrawerHeader>

        <DrawerBody>
          <div className="space-y-4">
            <FilterField label="Status">
              <StatusFilterField
                value={status}
                onChange={(value) => onFilterChange("status", value)}
                className="w-full"
              />
            </FilterField>

            <FilterField label="Priority">
              <PriorityFilterField
                value={priority}
                onChange={(value) => onFilterChange("priority", value)}
                className="w-full"
              />
            </FilterField>

            <FilterField label="Project">
              <ProjectFilterField
                value={projectId}
                onChange={(value) => onFilterChange("projectId", value)}
                projects={projects}
                className="w-full"
              />
            </FilterField>

            <FilterField label="Due date">
              <DueDateFilterField
                value={dueDate}
                onChange={(value) => onFilterChange("dueDate", value)}
                className="w-full"
              />
            </FilterField>

            <FilterField label="Tag">
              <TagFilterField
                value={tag}
                onChange={(value) => onFilterChange("tag", value)}
                tags={tags}
                className="w-full"
              />
            </FilterField>
          </div>
        </DrawerBody>

        <DrawerFooter>
          {activeCount > 0 && (
            <Button variant="outline" className="flex-1" onClick={handleClear}>
              Clear filters
            </Button>
          )}
          <Button className="flex-1" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function FilterField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{label}</p>
      {children}
    </div>
  )
}
